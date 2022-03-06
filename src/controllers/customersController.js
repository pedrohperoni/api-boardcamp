import db from "../database.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf !== undefined) {
      const { rows: filteredCustomers } = await db.query(
        `
         SELECT * 
         FROM customers 
         WHERE cpf LIKE $1
         `,
        [`${cpf}%`]
      );
      res.send(filteredCustomers);
    } else {
      const { rows: customers } = await db.query(
         `
         SELECT * 
         FROM customers
         `);
      res.send(customers);
    }
  } catch {
    res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;

  try {
    const { rows: selectedCustomer } = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id=$1
     `,
      [id]
    );
    selectedCustomer.length === 0
      ? res.sendStatus(404)
      : res.send(selectedCustomer);
  } catch {
    res.sendStatus(500);
  }
}

export async function registerCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rows: checkDuplicate } = await db.query(
      `
      SELECT *
      FROM customers
      WHERE (cpf = $1)
      `,
      [cpf]
    );

    if (checkDuplicate.length > 0) {
      return res.status(500).send("Usuario já cadastrado");
    }

    await db.query(
      `
       INSERT INTO
       customers (name, phone, cpf, birthday)
       VALUES ($1, $2, $3, $4)
         `,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}

export async function editCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const { rows: checkDuplicate } = await db.query(
    `
    SELECT *
    FROM customers
    WHERE (cpf = $1)
    `,
    [cpf]
  );

  if (checkDuplicate.length > 0) {
    return res.status(500).send("CPF já cadastrado");
  }

  try {
    await db.query(
      `
      UPDATE customers 
      SET name = $1,
          phone = $2,
          cpf = $3,
          birthday = $4
      WHERE id = $5
      `,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}
