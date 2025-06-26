// components/PrecipitationForm.tsx
import React, { useState } from 'react';
import './PrecipitationForm.css';

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
    <div className="hydrology-form-container">
      <h2 className="form-title">Hydrological Parameters</h2>
      
      <form onSubmit={handleSubmit} className="hydrology-form">
        {/* Precipitation Section */}
        <section>
          <h3 className="form-section-header">Precipitation Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Rainfall Intensity</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0"
                  value={intensity} 
                  onChange={e => setIntensity(+e.target.value)}
                  required
                />
                <span className="input-unit">mm/hr</span>
              </div>
            </label>
            
            <label className="form-label">
              <span>Storm Duration</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  min="1"
                  value={duration} 
                  onChange={e => setDuration(+e.target.value)}
                  required
                />
                <span className="input-unit">hours</span>
              </div>
            </label>
          </div>
        </section>

        {/* Catchment Section */}
        <section>
          <h3 className="form-section-header">Catchment Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Catchment Area</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={catchmentAreaKm2} 
                  onChange={e => setCatchmentAreaKm2(+e.target.value)}
                  required
                />
                <span className="input-unit">km²</span>
              </div>
            </label>
            
            <label className="form-label">
              <span>Runoff Coefficient</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.01"
                  min="0"
                  max="1"
                  value={runoffCoefficient} 
                  onChange={e => setRunoffCoefficient(+e.target.value)}
                  required
                />
                <span className="input-unit">-</span>
              </div>
            </label>
            
            <label className="form-label">
              <span>Reservoir Constant K</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={linearReservoirConstantK} 
                  onChange={e => setLinearReservoirConstantK(+e.target.value)}
                  required
                />
                <span className="input-unit">hours</span>
              </div>
            </label>
            
            <label className="form-label">
              <span>Initial Storage</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0"
                  value={initialStorageCubicMeters} 
                  onChange={e => setInitialStorageCubicMeters(+e.target.value)}
                />
                <span className="input-unit">m³</span>
              </div>
            </label>
          </div>
        </section>

        {/* Simulation Section */}
        <section>
          <h3 className="form-section-header">Simulation Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Time Step</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0.1"
                  max="2"
                  value={timeStepHours} 
                  onChange={e => setTimeStepHours(+e.target.value)}
                  required
                />
                <span className="input-unit">hours</span>
              </div>
            </label>
          </div>
        </section>
        
        <button type="submit" className="submit-button">
          Generate Hydrograph
        </button>
      </form>
    </div>
  );
}
