import configureRouter from "infra/controller.js";
import migrator from "models/migrator.js";

export default configureRouter({
  get: getHandler,
  post: postHandler,
});

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  }
  response.status(200).json(migratedMigrations);
}
