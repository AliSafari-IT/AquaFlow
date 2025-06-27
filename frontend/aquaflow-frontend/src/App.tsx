// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrecipitationForm from "./components/PrecipitationForm";
import AdvancedHydrologyForm from "./components/AdvancedHydrologyForm";
import CsvHydrographLoader from "./components/CsvHydrographLoader";
import HydrographChart from "./components/HydrographChart";
import AdvancedResultsDisplay from "./components/AdvancedResultsDisplay";
import { ThemeToggle } from "./components/ThemeToggle";
import TopNavBar from "./components/TopNavBar";
import "./App.css";
import AboutPage from "./components/AboutPage";
import HelpPage from "./components/HelpPage";
import SimpleLinearReservoirModel from "./components/models/SimpleLinearReservoirModel";
import SCSCurveNumberModel from "./components/models/SCSCurveNumberModel";
import GreenAmptInfiltrationModel from "./components/models/GreenAmptInfiltrationModel";

interface HydrologicalParameters {
  intensity: number;
  duration: number;
  catchmentAreaKm2: number;
  runoffCoefficient: number;
  linearReservoirConstantK: number;
  timeStepHours: number;
  initialStorageCubicMeters: number;
}

interface AdvancedHydrologicalParameters {
  intensityMmPerHour: number;
  durationHours: number;
  catchmentAreaKm2: number;
  watershedSlopePercent: number;
  watershedLengthKm: number;
  curveNumber: number;
  antecedentMoisture: number;
  linearReservoirConstantK: number;
  initialStorageCubicMeters: number;
  numberOfReservoirs: number;
  timeStepHours: number;
  selectedModel: string;
  evapotranspirationMmPerHour: number;
  baseFlowCubicMetersPerSecond: number;
}

interface CsvDataPoint {
  year: number;
  month: number;
  day: number;
  hour: number;
  timeHours: number;
  flowCubicMetersPerSecond: number;
}

// Helper function to convert model string to enum value
const getModelEnumValue = (modelString: string): number => {
  switch (modelString) {
    case "SCS Curve Number":
      return 0;
    case "Green-Ampt":
      return 1;
    case "Rational Method":
      return 2;
    default:
      return 0;
  }
};

// Simple Model Page Component
const SimpleModelPage: React.FC<{ csvData: CsvDataPoint[] }> = ({ csvData }) => {
  const [hydrographData, setHydrographData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async (params: HydrologicalParameters) => {
    setIsLoading(true);
    try {
      const requestBody = {
        intensityMmPerHour: params.intensity,
        durationHours: params.duration,
        catchmentAreaKm2: params.catchmentAreaKm2,
        runoffCoefficient: params.runoffCoefficient,
        linearReservoirConstantK: params.linearReservoirConstantK,
        timeStepHours: params.timeStepHours,
        initialStorageCubicMeters: params.initialStorageCubicMeters,
      };

      const res = await fetch("http://localhost:5185/api/hydrology/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setHydrographData([]);
      setTimeout(() => {
        setHydrographData(data);
        setTimeout(() => {
          const chartSection = document.getElementById("chart-section");
          if (chartSection) {
            chartSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }, 200);
      }, 100);
    } catch (error) {
      console.error("Error calculating hydrograph:", error);
      alert(
        "Failed to calculate hydrograph. Make sure the backend server is running on http://localhost:5185"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Simple Hydrological Model</h1>
        <p className="app-description">
          Basic rainfall-runoff modeling with linear reservoir approach
        </p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <PrecipitationForm onCalculate={handleCalculate} />
        </div>

        {isLoading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p className="loading-text">Calculating hydrograph...</p>
          </div>
        )}

        {hydrographData.length > 0 && (
          <div
            className="chart-section"
            id="chart-section"
            key={hydrographData.length}
          >
            <div className="chart-container">
              <h2 className="chart-title">Generated Hydrograph</h2>
              <HydrographChart
                data={hydrographData}
                csvData={csvData}
                showObservations={csvData.length > 0}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Advanced Model Page Component
const AdvancedModelPage: React.FC<{ csvData: CsvDataPoint[] }> = ({ csvData }) => {
  const [advancedResult, setAdvancedResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showObservations, setShowObservations] = useState(false);

  // Auto-enable observations if CSV data is available
  React.useEffect(() => {
    if (csvData && csvData.length > 0) {
      setShowObservations(true);
    }
  }, [csvData]);

  const handleAdvancedCalculate = async (
    params: AdvancedHydrologicalParameters
  ) => {
    setIsLoading(true);
    try {
      const backendParams = {
        IntensityMmPerHour: params.intensityMmPerHour,
        DurationHours: params.durationHours,
        CatchmentAreaKm2: params.catchmentAreaKm2,
        WatershedSlopePercent: params.watershedSlopePercent,
        WatershedLengthKm: params.watershedLengthKm,
        CurveNumber: params.curveNumber,
        AntecedentMoisture: params.antecedentMoisture,
        LinearReservoirConstantK: params.linearReservoirConstantK,
        InitialStorageCubicMeters: params.initialStorageCubicMeters,
        NumberOfReservoirs: params.numberOfReservoirs,
        TimeStepHours: params.timeStepHours,
        SelectedModel: getModelEnumValue(params.selectedModel),
        EvapotranspirationMmPerHour: params.evapotranspirationMmPerHour,
        BaseFlowCubicMetersPerSecond: params.baseFlowCubicMetersPerSecond,
      };

      const res = await fetch(
        "http://localhost:5185/api/hydrology/calculate-advanced",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendParams),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAdvancedResult(data);
      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 200);
    } catch (error) {
      console.error("Error calculating advanced hydrograph:", error);
      alert(
        "Failed to calculate advanced hydrograph. Make sure the backend server is running on http://localhost:5185"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Advanced Hydrological Models</h1>
        <p className="app-description">
          Comprehensive watershed modeling with multiple algorithms
        </p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <AdvancedHydrologyForm
            onCalculate={handleAdvancedCalculate}
            isLoading={isLoading}
          />
        </div>

        {isLoading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p className="loading-text">Running advanced hydrological simulation...</p>
          </div>
        )}

        {advancedResult && (
          <div
            className="results-section"
            id="results-section"
            key={JSON.stringify(advancedResult)}
          >
            <AdvancedResultsDisplay 
              result={advancedResult} 
              csvData={csvData}
              showObservations={showObservations}
              onToggleObservations={setShowObservations}
            />
          </div>
        )}
      </main>
    </div>
  );
};

// CSV Data Page Component
const CsvDataPage: React.FC<{ 
  csvData: CsvDataPoint[], 
  onCsvDataLoaded: (data: CsvDataPoint[]) => void 
}> = ({ csvData, onCsvDataLoaded }) => {
  const [hydrographData, setHydrographData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvDataLoaded = (data: CsvDataPoint[]) => {
    const chartData = data.map((point) => ({
      timeHours: point.timeHours,
      flowCubicMetersPerSecond: point.flowCubicMetersPerSecond,
    }));

    onCsvDataLoaded(data); // Update App-level state
    setHydrographData(chartData);

    setTimeout(() => {
      const chartSection = document.getElementById("chart-section");
      if (chartSection) {
        chartSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 200);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CSV Data Analysis</h1>
        <p className="app-description">
          Load and visualize hydrograph data from CSV files
        </p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <CsvHydrographLoader
            onDataLoaded={handleCsvDataLoaded}
            isLoading={isLoading}
          />
        </div>

        {isLoading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p className="loading-text">Processing CSV data...</p>
          </div>
        )}

        {hydrographData.length > 0 && (
          <div
            className="chart-section"
            id="chart-section"
            key={`csv-${hydrographData.length}`}
          >
            <div className="chart-container">
              <h2 className="chart-title">Loaded Hydrograph from CSV</h2>
              <div className="csv-data-info">
                <div className="summary-stats">
                  <span className="summary-item">
                    <strong>Total Points:</strong> {csvData.length}
                  </span>
                  <span className="summary-item">
                    <strong>Duration:</strong>{" "}
                    {Math.round(Math.max(...csvData.map((d) => d.timeHours)))}{" "}
                    hours
                  </span>
                  <span className="summary-item">
                    <strong>Peak Flow:</strong>{" "}
                    {Math.max(
                      ...csvData.map((d) => d.flowCubicMetersPerSecond)
                    ).toFixed(2)}{" "}
                    m³/s
                  </span>
                </div>
              </div>
              <HydrographChart
                data={hydrographData}
                csvData={csvData}
                showObservations={csvData.length > 0}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Home/Landing Page Component
const HomePage: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">AquaFlow Interactive</h1>
        <p className="app-description">
          Advanced hydrological modeling and simulation platform
        </p>
      </header>

      <main className="app-main">
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome to AquaFlow</h2>
            <p>
              Choose your modeling approach from the navigation menu above to get started
              with hydrological simulations.
            </p>
            <div className="feature-grid">
              <div className="feature-item">
                <h3>🌧️ Simple Model</h3>
                <p>Basic rainfall-runoff modeling with linear reservoir approach</p>
              </div>
              <div className="feature-item">
                <h3>🏔️ Advanced Models</h3>
                <p>Comprehensive watershed modeling with multiple algorithms</p>
              </div>
              <div className="feature-item">
                <h3>📊 CSV Analysis</h3>
                <p>Load and visualize hydrograph data from CSV files</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App with Router
function App() {
  const [csvData, setCsvData] = useState<CsvDataPoint[]>([]);

  const handleCsvDataLoaded = (data: CsvDataPoint[]) => {
    setCsvData(data);
  };

  return (
    <Router>
      <div className="app">
        <TopNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simple" element={<SimpleModelPage csvData={csvData} />} />
          <Route path="/advanced" element={<AdvancedModelPage csvData={csvData} />} />
          <Route
            path="/csv"
            element={
              <CsvDataPage
                csvData={csvData}
                onCsvDataLoaded={(data) => setCsvData(data)}
              />
            }
          />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/models/simple-linear-reservoir" element={<SimpleLinearReservoirModel />} />
          <Route path="/models/scs-curve-number" element={<SCSCurveNumberModel />} />
          <Route path="/models/green-ampt-infiltration" element={<GreenAmptInfiltrationModel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
