import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `
        SELECT 
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });
    if (result.rows.length > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: `
        SELECT 
          username
        FROM
          users
        WHERE
          username = $1
        ;`,
      values: [username],
    });
    if (result.rows.length > 0) {
      throw new ValidationError({
        message: "O nome de usuário informado já está sendo utilizado.",
        action: "Utilize outro nome de usuário para realizar o cadastro.",
      });
    }
  }

  return newUser;
}

async function runInsertQuery(userInputValues) {
  const result = await database.query({
    text: `
      INSERT INTO 
        users (username, email, password)
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });
  return result.rows[0];
}

const user = {
  create,
};

export default user;
