import { useState, useEffect } from "react";
import ErrorMessage from "./Components/ErrorMessage";
import ServerCard from "./Components/ServerCard";

function Servers() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = "https://api.csbay.org/servers";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setServers(json);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-base-100 bg-opacity-50 z-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-4 text-lg">Loading data...</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col justify-center mt-4">
        <h1 className="text-2xl font-bold">Servers that using snipebot</h1>
        <div>Server count: {servers.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {servers.map((server, index) => (
          <ServerCard key={index} server={server} />
        ))}
      </div>
    </>
  );
}

export default Servers;
