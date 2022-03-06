import db from "../database.js";

export async function rentalValidationMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  if (daysRented <= 0) {
    res.sendStatus(400);
    return;
  }

  try {
    const { rows: gameExists } = await db.query(
      `
    SELECT * 
    FROM games
    WHERE id = $1
    `,
      [gameId]
    );

    const { rows: customerExists } = await db.query(
      `
    SELECT * 
    FROM customers
    WHERE id = $1
    `,
      [customerId]
    );

    const { rows: checkStock } = await db.query(
      `
    SELECT *
    FROM rentals
    WHERE "gameId" = $1
    AND "returnDate" is null
    `,
      [gameId]
    );

    if (
      gameExists.length === 0 ||
      customerExists.length === 0 ||
      gameExists[0].stockTotal - checkStock.length === 0
    ) {
      return res.sendStatus(400);
    }
    next();
  } catch {
    res.sendStatus(400);
  }
}
