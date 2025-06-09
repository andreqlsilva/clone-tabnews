import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import configureRouter from "infra/controllers.js";

export default configureRouter({
  get: getHandler,
  post: postHandler,
});

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
  verbose: "true",
};

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient: dbClient,
  });
  response.status(200).json(pendingMigrations);
  await dbClient.end();
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient: dbClient,
    dryRun: false,
  });
  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  } else {
    response.status(200).json(migratedMigrations);
  }
  await dbClient.end();
}
