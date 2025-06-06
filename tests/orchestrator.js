import database from "infra/database.js";
import retry from "async-retry";

async function clearDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchPages, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchPages() {
      const response1 = await fetch("http://localhost:3000/api/v1/status");
      if (response1.status !== 200) {
        throw Error();
      }
      const response2 = await fetch("http://localhost:3000/api/v1/migrations");
      if (response2.status !== 200) {
        throw Error();
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
