// components/PrecipitationForm.tsx
import React, { useState } from 'react';

interface HydrologicalParameters {
  intensity: number;
  duration: number;
  catchmentAreaKm2: number;
  runoffCoefficient: number;
  linearReservoirConstantK: number;
  timeStepHours: number;
  initialStorageCubicMeters: number;
}

export default function PrecipitationForm({ onCalculate }: { onCalculate: (params: HydrologicalParameters) => void }) {
  const [intensity, setIntensity] = useState(10);
  const [duration, setDuration] = useState(6);
  const [catchmentAreaKm2, setCatchmentAreaKm2] = useState(10.0);
  const [runoffCoefficient, setRunoffCoefficient] = useState(0.5);
  const [linearReservoirConstantK, setLinearReservoirConstantK] = useState(5.0);
  const [timeStepHours, setTimeStepHours] = useState(1.0);
  const [initialStorageCubicMeters, setInitialStorageCubicMeters] = useState(0.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      intensity,
      duration,
      catchmentAreaKm2,
      runoffCoefficient,
      linearReservoirConstantK,
      timeStepHours,
      initialStorageCubicMeters
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
      <h3>Precipitation Parameters</h3>
      <label>
        Intensity (mm/hr): 
        <input 
          type="number" 
          step="0.1"
          value={intensity} 
          onChange={e => setIntensity(+e.target.value)} 
        />
      </label>
      <label>
        Duration (hr): 
        <input 
          type="number" 
          value={duration} 
          onChange={e => setDuration(+e.target.value)} 
        />
      </label>
      
      <h3>Catchment Parameters</h3>
      <label>
        Catchment Area (km²): 
        <input 
          type="number" 
          step="0.1"
          value={catchmentAreaKm2} 
          onChange={e => setCatchmentAreaKm2(+e.target.value)} 
        />
      </label>
      <label>
        Runoff Coefficient: 
        <input 
          type="number" 
          step="0.01"
          min="0"
          max="1"
          value={runoffCoefficient} 
          onChange={e => setRunoffCoefficient(+e.target.value)} 
        />
      </label>
      <label>
        Linear Reservoir Constant K (hr): 
        <input 
          type="number" 
          step="0.1"
          value={linearReservoirConstantK} 
          onChange={e => setLinearReservoirConstantK(+e.target.value)} 
        />
      </label>
      <label>
        Time Step (hr): 
        <input 
          type="number" 
          step="0.1"
          value={timeStepHours} 
          onChange={e => setTimeStepHours(+e.target.value)} 
        />
      </label>
      <label>
        Initial Storage (m³): 
        <input 
          type="number" 
          step="0.1"
          min="0"
          value={initialStorageCubicMeters} 
          onChange={e => setInitialStorageCubicMeters(+e.target.value)} 
        />
      </label>
      
      <button type="submit">Simulate Hydrograph</button>
    </form>
  );
}
