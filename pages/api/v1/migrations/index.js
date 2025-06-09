import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onNoMatch: (request, response) => {
    const publicErrorObject = new MethodNotAllowedError();
    console.log("\nErro por uso de método não permitido.");
    //    console.log(publicErrorObject.stack);
    response.status(publicErrorObject.statusCode).json(publicErrorObject);
  },

  onError: (error, request, response) => {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\nErro dentro do catch do next-connect:");
    //    console.log(publicErrorObject.stack);
    response.status(publicErrorObject.statusCode).json(publicErrorObject);
  },
});

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  const pendingMigrations = await migrationRunner({
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: "true",
  });
  response.status(200).json(pendingMigrations);
  await dbClient.end();
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  const migratedMigrations = await migrationRunner({
    dbClient: dbClient,
    dryRun: false,
    dir: resolve("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: "true",
  });
  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  } else {
    response.status(200).json(migratedMigrations);
  }
  await dbClient.end();
}
