// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrecipitationForm from "./components/PrecipitationForm";
import AdvancedHydrologyForm from "./components/AdvancedHydrologyForm";
import CsvHydrographLoader from "./components/CsvHydrographLoader";
import HydrographChart from "./components/HydrographChart";
import AdvancedResultsDisplay from "./components/AdvancedResultsDisplay";
import TopNavBar from "./components/TopNavBar";
import "./App.css";
import AboutPage from "./components/AboutPage";
import HelpPage from "./components/HelpPage";
import SimpleLinearReservoirModel from "./components/models/SimpleLinearReservoirModel";
import SCSCurveNumberModel from "./components/models/SCSCurveNumberModel";
import GreenAmptInfiltrationModel from "./components/models/GreenAmptInfiltrationModel";
import { calculateHydrograph, calculateAdvancedHydrograph, type HydrographDataPoint, type HydrographResult } from "./services/apiService";
import { isDemoMode } from "./config/api";
import DemoBanner from "./components/DemoBanner";
import HealthPage from "./components/HealthPage";

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
  // Green-Ampt parameters
  saturatedHydraulicConductivity: number;
  suctionHead: number;
  saturatedMoistureContent: number;
  initialMoistureContent: number;
  soilType: string;
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
    case "SimpleLinearReservoir":
      return 0;
    case "CurveNumberMethod":
      return 1;
    case "LinearReservoirChain":
      return 2;
    case "CombinedModel":
      return 3;
    case "GreenAmptInfiltration":
      return 4;
    default:
      return 0; // Default to SimpleLinearReservoir
  }
};

const getSoilTypeEnumValue = (soilTypeString: string): number => {
  switch (soilTypeString) {
    case "Sand":
      return 0;
    case "LoamySand":
      return 1;
    case "SandyLoam":
      return 2;
    case "Loam":
      return 3;
    case "SiltLoam":
      return 4;
    case "SandyClayLoam":
      return 5;
    case "ClayLoam":
      return 6;
    case "SiltyClayLoam":
      return 7;
    case "SandyClay":
      return 8;
    case "SiltyClay":
      return 9;
    case "Clay":
      return 10;
    default:
      return 3; // Default to Loam
  }
};

// Simple Model Page Component
const SimpleModelPage: React.FC<{ csvData: CsvDataPoint[] }> = ({ csvData }) => {
  const [hydrographData, setHydrographData] = useState<HydrographDataPoint[]>([]);
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

      const response = await calculateHydrograph(requestBody);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to calculate hydrograph');
      }

      setHydrographData([]);
      setTimeout(() => {
        if (response.data) {
          setHydrographData(response.data);
        }
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
      const errorMessage = isDemoMode() 
        ? "Failed to calculate hydrograph in demo mode. Please try again."
        : "Failed to calculate hydrograph. Make sure the backend server is running on http://localhost:5185";
      alert(errorMessage);
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
                modelName="Basic Linear Reservoir"
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
  const [advancedResult, setAdvancedResult] = useState<HydrographResult | null>(null);
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
        // Green-Ampt parameters
        SaturatedHydraulicConductivity: params.saturatedHydraulicConductivity,
        SuctionHead: params.suctionHead,
        SaturatedMoistureContent: params.saturatedMoistureContent,
        InitialMoistureContent: params.initialMoistureContent,
        SoilType: getSoilTypeEnumValue(params.soilType),
      };

      console.log('Frontend selected model:', params.selectedModel);
      console.log('Mapped to enum value:', getModelEnumValue(params.selectedModel));
      console.log('Full backend params:', backendParams);

      const response = await calculateAdvancedHydrograph(backendParams);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to calculate advanced hydrograph');
      }

      if (response.data) {
        setAdvancedResult(response.data);
      }
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
      const errorMessage = isDemoMode()
        ? "Failed to calculate advanced hydrograph in demo mode. Please try again."
        : "Failed to calculate advanced hydrograph. Make sure the backend server is running on http://localhost:5185";
      alert(errorMessage);
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
  const [hydrographData, ] = useState<Array<{ timeHours: number; flowCubicMetersPerSecond: number }>>([]);
  const [isLoading, ] = useState(false);

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
            onDataLoaded={onCsvDataLoaded}
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
                modelName="Basic Linear Reservoir"
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
              <Link to="/models/simple-linear-reservoir" className="feature-item-link">
                <div className="feature-item">
                  <h3>🌧️ Simple Model</h3>
                  <p>Basic rainfall-runoff modeling with linear reservoir approach</p>
                  <div className="learn-more">Learn more →</div>
                </div>
              </Link>
              <Link to="/models/scs-curve-number" className="feature-item-link">
                <div className="feature-item">
                  <h3>🏔️ Advanced Models</h3>
                  <p>Comprehensive watershed modeling with multiple algorithms</p>
                  <div className="learn-more">Learn more →</div>
                </div>
              </Link>
              <Link to="/models/green-ampt-infiltration" className="feature-item-link">
                <div className="feature-item">
                  <h3>📊 Infiltration Analysis</h3>
                  <p>Physics-based modeling of soil infiltration processes</p>
                  <div className="learn-more">Learn more →</div>
                </div>
              </Link>
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
 
  return (
    <Router>
      <div className="app">
        <DemoBanner />
        <TopNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simple" element={<SimpleModelPage csvData={csvData} />} />
          <Route path="/advanced" element={<AdvancedModelPage csvData={csvData} />} />
          <Route path="/csv" element={<CsvDataPage csvData={csvData} onCsvDataLoaded={setCsvData} />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/models/simple-linear-reservoir" element={<SimpleLinearReservoirModel />} />
          <Route path="/models/scs-curve-number" element={<SCSCurveNumberModel />} />
          <Route path="/models/green-ampt-infiltration" element={<GreenAmptInfiltrationModel />} />
          <Route path="/health" element={<HealthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
