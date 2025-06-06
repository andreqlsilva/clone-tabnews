import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Retrieving pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch("http://localhost:3000/api/v1/migrations");

        // Was the fetch succesful?
        expect(response.status).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);

        // Runaway connections?
      });
      test("For the next few times", async () => {
        await fetch("http://localhost:3000/api/v1/migrations");
        await fetch("http://localhost:3000/api/v1/migrations");
        await fetch("http://localhost:3000/api/v1/migrations");
        const statusBody = await (
          await fetch("http://localhost:3000/api/v1/status")
        ).json();
        expect(statusBody.dependencies.database.used_connections).not.toBe(NaN);
        expect(statusBody.dependencies.database.used_connections).toBe(1);
      });
    });
  });
});
