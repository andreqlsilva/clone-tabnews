import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

test("POST no /api/v1/migrations deve retornar 201 ou 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations",{
    method:'POST',
  });
 
  // Was the fetch succesful?
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

//  console.log(response1Body);

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations",{
    method:'POST',
  });
 
  // Was the fetch succesful?
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

//  console.log(response2Body);

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);

  // Runaway connections?
  const dummy1 = await fetch("http://localhost:3000/api/v1/migrations",{method:'POST'});
  const dummy2 = await fetch("http://localhost:3000/api/v1/migrations",{method:'POST'});
  const dummy3 = await fetch("http://localhost:3000/api/v1/migrations",{method:'POST'});
  const statusBody = await (await fetch("http://localhost:3000/api/v1/status")).json();
  expect(statusBody.dependencies.database.used_connections).not.toBe(NaN);
  expect(statusBody.dependencies.database.used_connections).toBe(1);
});

