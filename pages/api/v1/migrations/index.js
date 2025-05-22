import migrationRunner from 'node-pg-migrate';
import { join } from "node:path"
import database from "infra/database.js"

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defMigOpt = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra","migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: "true",
  };
  if (request.method !== 'POST') {
    const pendingMigrations = await migrationRunner(defMigOpt);
    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  else {
    const migratedMigrations = await migrationRunner({
      ...defMigOpt,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    else return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}

