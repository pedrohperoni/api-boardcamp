import db from "../database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  try {
    const { rows: rentals } = await db.query(`
    SELECT 
    rentals.*,
    customers.name AS "customerName",
    games.name AS "gameName",
    games."categoryId",
    categories.name AS "categoryName"
  FROM rentals
  JOIN customers ON customers.id = rentals."customerId"
  JOIN games ON games.id = rentals."gameId"
  JOIN categories ON categories.id = games."categoryId"
  ${customerId ? `WHERE customers.id = ${parseInt(customerId)}` : ""}
  ${gameId ? `WHERE games.id = ${parseInt(gameId)}` : ""}
    `);

    const listRentals = rentals.map((rental) => {
      const rentalObject = {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      };
      return rentalObject;
    });
    res.send(listRentals);
  } catch {
    res.sendStatus(500);
  }
}
export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format("YYYY-MM-DD");
  const returnDate = null;
  const delayFee = null;

  try {
    const { rows: pricePerDay } = await db.query(
      `
   SELECT games."pricePerDay"
   FROM games 
   WHERE id = $1
   `,
      [gameId]
    );

    const originalPrice = pricePerDay[0].pricePerDay * daysRented;

    await db.query(
      `
      INSERT INTO 
      rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3 ,$4, $5, $6, $7)
   `,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
export async function returnRental(req, res) {
  const { id } = req.params;
  const returnDate = dayjs().format("YYYY-MM-DD");
  try {
    const { rows: checkRental } = await db.query(
      `
    SELECT * 
    FROM rentals 
    WHERE id = $1`,
      [id]
    );
    if (checkRental.length === 0) {
      return res.senStatus(404);
    }
    if (checkRental[0].returnDate !== null) {
      return res.sendStatus(400);
    }

    const pricePerDay =
      parseInt(checkRental[0].originalPrice) /
      parseInt(checkRental[0].daysRented);

    const rentDate = dayjs(checkRental[0].rentDate);

    const daysDelayed = dayjs().diff(rentDate, "days");
    const delayFee = daysDelayed * pricePerDay;

    await db.query(
      `    
      UPDATE rentals
      SET 
         "returnDate" = $1,
         "delayFee" = $2
      WHERE id = $3
      `,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}
export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const { rows: checkRental } = await db.query(
      `
    SELECT * 
    FROM rentals 
    WHERE id = $1`,
      [id]
    );

    if (checkRental.length === 0) {
      return res.senStatus(404);
    }
    if (checkRental[0].returnDate !== null) {
      return res.sendStatus(400);
    }

    await db.query(
      `
    DELETE 
    FROM rentals 
    WHERE id=$1
    `,
      [id]
    );
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}
