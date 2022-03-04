import db from "../database.js";

export async function postCategories(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      res.sendStatus(409);
    }

    const checkDuplicate = await db.query(
      `
         SELECT * 
         FROM categories 
         WHERE name=$1
       `,
      [name]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(409).send("Categoria já existe");
    }

    await db.query(
      `
      INSERT INTO 
      categories (name) 
      VALUES ($1)
      `,
      [name]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await db.query("SELECT * FROM categories");
    res.send(categories);
  } catch {
    res.sendStatus(500);
  }
}
