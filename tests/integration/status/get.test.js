import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /status", () => {
  describe("Anonymous user", () => {
    describe("Retrieving current system status", () => {
      test("For the first time", async () => {
        const response = await fetch("http://localhost:3000/status");

        // Was the fetch succesful?
        expect(response.status).toBe(200);

        // Is the response non-empty HTML?
        const responseHTML = await response.text();
        expect(responseHTML).toBeTruthy();
      });
      test("For the next few times", async () => {
        await fetch("http://localhost:3000/status");
        await fetch("http://localhost:3000/status");
        await fetch("http://localhost:3000/status");
        const response = await fetch("http://localhost:3000/status");

        // Was the fetch succesful?
        expect(response.status).toBe(200);

        // Is the response non-empty HTML?
        const responseHTML = await response.text();
        expect(responseHTML).toBeTruthy();
      });
    });
  });
});
