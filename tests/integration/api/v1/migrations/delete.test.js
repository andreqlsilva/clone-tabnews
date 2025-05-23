import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(cleanDatabase);

test("Outras requisições no /api/v1/migrations devem retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method:'DELETE',
  });

  // Was the fetch succesful?
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
