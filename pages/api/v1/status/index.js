import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const postgresVersion = await database.query("SHOW server_version;");
  const maxConnections = await database.query("SHOW max_connections;");
  const usedConnections = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity;",
  );
  response.status(200).json({
    updated_at: updatedAt,
    postgres_version: postgresVersion.rows[0].server_version,
    max_connections: parseInt(maxConnections.rows[0].max_connections),
    used_connections: usedConnections.rows[0].count,
  });
}

export default status;
