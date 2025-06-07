import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let Status = "Carregando...";

  if (!isLoading && data) {
    let updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    let dbstats = data.dependencies.database;
    Status = (
      <div>
        <p>Versão do banco de dados: {dbstats.postgres_version}</p>
        <p>Número máximo de conexões: {dbstats.max_connections}</p>
        <p>Conexões atuais: {dbstats.used_connections}</p>
        <p>Última atualização: {updatedAtText}</p>
      </div>
    );
  }

  return <div>{Status}</div>;
}
