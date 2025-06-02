import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

test("GET no /api/v1/migrations deve retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  // Was the fetch succesful?
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  // Runaway connections?
  await fetch("http://localhost:3000/api/v1/migrations");
  await fetch("http://localhost:3000/api/v1/migrations");
  await fetch("http://localhost:3000/api/v1/migrations");
  const statusBody = await (
    await fetch("http://localhost:3000/api/v1/status")
  ).json();
  expect(statusBody.dependencies.database.used_connections).not.toBe(NaN);
  expect(statusBody.dependencies.database.used_connections).toBe(1);
});
