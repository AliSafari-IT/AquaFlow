// App.tsx
import React, { useState } from 'react';
import PrecipitationForm from './components/PrecipitationForm';
import HydrographChart from './components/HydrographChart';

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
      setTimeout(() => setHydrographData(data), 100);
    } catch (error) {
      console.error('Error calculating hydrograph:', error);
      alert('Failed to calculate hydrograph. Make sure the backend server is running on http://localhost:5185');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AquaFlow Interactive</h1>
      <PrecipitationForm onCalculate={handleCalculate} />
      {isLoading && <p>Calculating...</p>}
      {hydrographData.length > 0 && (
        <div key={hydrographData.length} style={{ marginTop: 20 }}>
          <HydrographChart data={hydrographData} />
        </div>
      )}
    </div>
  );
}

export default App;
