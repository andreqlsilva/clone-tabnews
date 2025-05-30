import migrationRunner from 'node-pg-migrate';
import { join } from "node:path"
import database from "infra/database.js"

export default async function migrations(request, response) {
  const allowedMethods = ["GET","POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defMigOpt = {
    dbClient: dbClient,
      dryRun: true,
      dir: join("infra","migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      verbose: "true",
    }; 
    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner(defMigOpt);
      return response.status(200).json(pendingMigrations);
    }

    else if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defMigOpt,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      else return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    throw error;
  } finally {
    await dbClient.end();
  }
}

