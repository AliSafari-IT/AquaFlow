import React, { useEffect, useState } from "react";
import "../styles/HealthPage.css";

interface HealthStatus {
  status: string;
  timestamp: string;
}

const HealthPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("https://localhost:7079/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("Backend not reachable");
        return res.json();
      })
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  return (
    <div className="health-page-container">
      <h2>Backend Health Check</h2>
      {loading && <p>Checking backend health...</p>}
      {error && (
        <div className="health-error">
          <span role="img" aria-label="error">❌</span> Backend not healthy: {error}
        </div>
      )}
      {health && (
        <div className="health-success">
          <span role="img" aria-label="success">✅</span> Backend is <strong>{health.status}</strong>
          <div className="health-timestamp">Checked at: {new Date(health.timestamp).toLocaleString()}</div>
        </div>
      )}
      <button className="health-refresh" onClick={() => window.location.reload()}>↻ Refresh</button>
    </div>
  );
};

export default HealthPage;
