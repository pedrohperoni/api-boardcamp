import db from "../database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    const { rows: rentals } = await db.query("SELECT * FROM rentals");
    res.send(rentals);
  } catch {
    res.sendStatus(500);
  }
}
export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format("YYYY-MM-DD");

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
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );
    console.log(originalPrice);
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
export async function returnRental(req, res) {
  console.log("s");
}
export async function deleteRental(req, res) {
  console.log("s");
}
