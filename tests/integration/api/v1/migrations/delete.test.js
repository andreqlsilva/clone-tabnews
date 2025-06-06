import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Unauthorized request", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "DELETE",
          },
        );

        // Was the fetch succesful?
        expect(response.status).toBe(405);
      });

      test("For the next few times", async () => {
        // Runaway connections?
        try {
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "PUT",
          });
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "PUT",
          });
          await fetch("http://localhost:3000/api/v1/migrations", {
            method: "PUT",
          });
        } finally {
          const statusBody = await (
            await fetch("http://localhost:3000/api/v1/status")
          ).json();
          expect(statusBody.dependencies.database.used_connections).not.toBe(
            NaN,
          );
          expect(statusBody.dependencies.database.used_connections).toBe(1);
        }
      });
    });
  });
});
