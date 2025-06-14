import { Client } from "pg";
import { ServiceError } from "infra/errors.js";

async function query(queryObject) {
  let client;
  let result = null;
  try {
    client = await getNewClient();
    result = await client.query(queryObject);
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com Banco, ou na query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
  return result;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
