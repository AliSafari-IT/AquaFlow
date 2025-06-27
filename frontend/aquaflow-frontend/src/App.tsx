// App.tsx
import React, { useState } from 'react';
import PrecipitationForm from './components/PrecipitationForm';
import AdvancedHydrologyForm from './components/AdvancedHydrologyForm';
import CsvHydrographLoader from './components/CsvHydrographLoader';
import HydrographChart from './components/HydrographChart';
import AdvancedResultsDisplay from './components/AdvancedResultsDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

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
  flowCubicMetersPerSecond: number;
  timeHours: number;
}

// Helper function to convert model string to enum value
const getModelEnumValue = (modelString: string): number => {
  switch (modelString) {
    case 'SimpleLinearReservoir': return 0;
    case 'CurveNumberMethod': return 1;
    case 'LinearReservoirChain': return 2;
    case 'CombinedModel': return 3;
    default: return 0; // Default to SimpleLinearReservoir
  }
};

function App() {
  const [hydrographData, setHydrographData] = useState<any[]>([]);
  const [advancedResult, setAdvancedResult] = useState<any>(null);
  const [csvData, setCsvData] = useState<CsvDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'simple' | 'advanced' | 'csv'>('simple');
  
  const handleCalculate = async (params: HydrologicalParameters) => {
    setIsLoading(true);
    setAdvancedResult(null); // Clear advanced results
    try {
      const requestBody = {
        intensityMmPerHour: params.intensity,
        durationHours: params.duration,
        catchmentAreaKm2: params.catchmentAreaKm2,
        runoffCoefficient: params.runoffCoefficient,
        linearReservoirConstantK: params.linearReservoirConstantK,
        timeStepHours: params.timeStepHours,
        initialStorageCubicMeters: params.initialStorageCubicMeters
      };
      
      const res = await fetch('http://localhost:5185/api/hydrology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      // Clear previous data first to help with chart rerendering
      setHydrographData([]);
      setTimeout(() => {
        setHydrographData(data);
        // Scroll to chart section after data is loaded
        setTimeout(() => {
          const chartSection = document.getElementById('chart-section');
          if (chartSection) {
            chartSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 200); // Small delay to ensure chart is rendered
      }, 100);
    } catch (error) {
      console.error('Error calculating hydrograph:', error);
      alert('Failed to calculate hydrograph. Make sure the backend server is running on http://localhost:5185');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedCalculate = async (params: AdvancedHydrologicalParameters) => {
    setIsLoading(true);
    setHydrographData([]); // Clear simple results
    try {
      // Convert camelCase to PascalCase for C# backend
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
        BaseFlowCubicMetersPerSecond: params.baseFlowCubicMetersPerSecond
      };
      
      const res = await fetch('http://localhost:5185/api/hydrology/calculate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendParams),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setTimeout(() => {
        setAdvancedResult(data);
        // Scroll to results section
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 200);
      }, 100);
    } catch (error) {
      console.error('Error calculating advanced hydrograph:', error);
      alert('Failed to calculate advanced hydrograph. Make sure the backend server is running on http://localhost:5185');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvDataLoaded = (data: CsvDataPoint[]) => {
    // Clear other results
    setHydrographData([]);
    setAdvancedResult(null);
    
    // Convert CSV data to chart format
    const chartData = data.map(point => ({
      timeHours: point.timeHours,
      flowCubicMetersPerSecond: point.flowCubicMetersPerSecond
    }));
    
    setCsvData(data);
    setHydrographData(chartData);
    
    // Scroll to chart section after data is loaded
    setTimeout(() => {
      const chartSection = document.getElementById('chart-section');
      if (chartSection) {
        chartSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 200);
  };

  return (
    <div className="app">
      <ThemeToggle />
      
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">AquaFlow Interactive</h1>
          <p className="app-description">
            Advanced hydrological modeling and simulation platform
          </p>
          
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button 
              className={`mode-button ${activeMode === 'simple' ? 'active' : ''}`}
              onClick={() => {
                setActiveMode('simple');
                setHydrographData([]);
                setAdvancedResult(null);
                setCsvData([]);
              }}
            >
              Simple Model
            </button>
            <button 
              className={`mode-button ${activeMode === 'advanced' ? 'active' : ''}`}
              onClick={() => {
                setActiveMode('advanced');
                setHydrographData([]);
                setAdvancedResult(null);
                setCsvData([]);
              }}
            >
              Advanced Models
            </button>
            <button 
              className={`mode-button ${activeMode === 'csv' ? 'active' : ''}`}
              onClick={() => {
                setActiveMode('csv');
                setHydrographData([]);
                setAdvancedResult(null);
                setCsvData([]);
              }}
            >
              Load CSV Data
            </button>
          </div>
        </header>

        <main className="app-main">
          <div className="form-section">
            {activeMode === 'simple' ? (
              <PrecipitationForm onCalculate={handleCalculate} />
            ) : activeMode === 'advanced' ? (
              <AdvancedHydrologyForm onCalculate={handleAdvancedCalculate} isLoading={isLoading} />
            ) : (
              <CsvHydrographLoader onDataLoaded={handleCsvDataLoaded} isLoading={isLoading} />
            )}
          </div>
          
          {isLoading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                {activeMode === 'simple' 
                  ? 'Calculating hydrograph...' 
                  : activeMode === 'advanced'
                  ? 'Running advanced hydrological simulation...'
                  : 'Processing CSV data...'
                }
              </p>
            </div>
          )}
          
          {/* Simple Model Results */}
          {hydrographData.length > 0 && activeMode === 'simple' && (
            <div className="chart-section" id="chart-section" key={hydrographData.length}>
              <div className="chart-container">
                <h2 className="chart-title">Generated Hydrograph</h2>
                <HydrographChart data={hydrographData} />
              </div>
            </div>
          )}
          
          {/* CSV Data Results */}
          {hydrographData.length > 0 && activeMode === 'csv' && (
            <div className="chart-section" id="chart-section" key={`csv-${hydrographData.length}`}>
              <div className="chart-container">
                <h2 className="chart-title">Loaded Hydrograph from CSV</h2>
                <div className="csv-data-info">
                  <div className="data-summary">
                    <span className="summary-item">
                      <strong>Total Points:</strong> {csvData.length}
                    </span>
                    <span className="summary-item">
                      <strong>Duration:</strong> {Math.round(Math.max(...csvData.map(d => d.timeHours)))} hours
                    </span>
                    <span className="summary-item">
                      <strong>Peak Flow:</strong> {Math.max(...csvData.map(d => d.flowCubicMetersPerSecond)).toFixed(2)} m³/s
                    </span>
                  </div>
                </div>
                <HydrographChart data={hydrographData} />
              </div>
            </div>
          )}
          
          {/* Advanced Model Results */}
          {advancedResult && activeMode === 'advanced' && (
            <div className="results-section" id="results-section" key={JSON.stringify(advancedResult)}>
              <AdvancedResultsDisplay result={advancedResult} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
