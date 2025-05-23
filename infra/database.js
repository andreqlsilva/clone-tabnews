import { Client } from "pg";
 
async function query(queryObject) {
  let client;
  let result = null;
  try {
    client = await getNewClient();
    result = await client.query(queryObject);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
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

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
