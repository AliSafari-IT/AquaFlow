// App.tsx
import React, { useState } from 'react';
import PrecipitationForm from './components/PrecipitationForm';
import HydrographChart from './components/HydrographChart';
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

function App() {
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

  return (
    <div className="app">
      <ThemeToggle />
      
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">AquaFlow Interactive</h1>
          <p className="app-description">
            Advanced hydrological modeling and simulation platform
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
            <div className="chart-section" id="chart-section" key={hydrographData.length}>
              <div className="chart-container">
                <h2 className="chart-title">Generated Hydrograph</h2>
                <HydrographChart data={hydrographData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
