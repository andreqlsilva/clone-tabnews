import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    describe("Retrieving current system status", () => {
      test("For the first time", async () => {
        const response = await fetch("http://localhost:3000/api/v1/status");

        // Was the fetch succesful?
        expect(response.status).toBe(200);

        // Are all parameters defined?
        const responseBody = await response.json();
        //console.log(responseBody);

        // Is updated_at a date?
        const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

        // Does updated_at match the ISO date format?
        expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

        // Is postgres_version a valid version number?
        const versionRegex = /([1-9](\d*))+/;
        expect(
          versionRegex.test(
            responseBody.dependencies.database.postgres_version,
          ),
        ).toBe(true);

        // Is max_connections a positive integer?
        expect(responseBody.dependencies.database.max_connections).not.toBe(
          NaN,
        );
        expect(responseBody.dependencies.database.max_connections > 0).toBe(
          true,
        );

        // Is used_connections equal to 1?
        // (Could be triggered by other types of requests)
        expect(responseBody.dependencies.database.used_connections).not.toBe(
          NaN,
        );
        expect(responseBody.dependencies.database.used_connections).toBe(1);
      });

      test("For the next few times", async () => {
        await fetch("http://localhost:3000/api/v1/status");
        await fetch("http://localhost:3000/api/v1/status");
        await fetch("http://localhost:3000/api/v1/status");
        const statusBody = await (
          await fetch("http://localhost:3000/api/v1/status")
        ).json();
        expect(statusBody.dependencies.database.used_connections).not.toBe(NaN);
        expect(statusBody.dependencies.database.used_connections).toBe(1);
      });
    });
  });
});
