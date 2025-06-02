import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

test("Requisições PUT no /api/v1/migrations devem retornar 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });

  // Was the fetch succesful?
  expect(response.status).toBe(405);

  // Runaway connections?
  try {
    const dummy1 = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "PUT",
    });
    const dummy2 = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "PUT",
    });
    const dummy3 = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "PUT",
    });
  } catch (err) {
  } finally {
    const statusBody = await (
      await fetch("http://localhost:3000/api/v1/status")
    ).json();
    expect(statusBody.dependencies.database.used_connections).not.toBe(NaN);
    expect(statusBody.dependencies.database.used_connections).toBe(1);
  }
});
