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
      <div className="form-header">
        <h2 className="form-title">
          <span className="form-icon">🌧️</span>
          Simple Linear Reservoir Model
        </h2>
        <p className="form-description">
          Configure watershed and precipitation parameters for rainfall-runoff simulation
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="hydrology-form">
        {/* Compact parameter grid */}
        <div className="parameters-grid">
          {/* Precipitation Parameters */}
          <div className="parameter-group precipitation">
            <h3 className="group-title">
              <span className="group-icon">☔</span>
              Precipitation
            </h3>
            <div className="parameter-row">
              <label className="parameter-field">
                <span className="field-label">Rainfall Intensity</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.1"
                    min="0"
                    value={intensity} 
                    onChange={e => setIntensity(+e.target.value)}
                    required
                  />
                  <span className="field-unit">mm/hr</span>
                </div>
              </label>
              
              <label className="parameter-field">
                <span className="field-label">Duration</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    min="1"
                    value={duration} 
                    onChange={e => setDuration(+e.target.value)}
                    required
                  />
                  <span className="field-unit">hours</span>
                </div>
              </label>
            </div>
          </div>

          {/* Watershed Parameters */}
          <div className="parameter-group watershed">
            <h3 className="group-title">
              <span className="group-icon">🏔️</span>
              Watershed
            </h3>
            <div className="parameter-row">
              <label className="parameter-field">
                <span className="field-label">Area</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.1"
                    min="0.1"
                    value={catchmentAreaKm2} 
                    onChange={e => setCatchmentAreaKm2(+e.target.value)}
                    required
                  />
                  <span className="field-unit">km²</span>
                </div>
              </label>
              
              <label className="parameter-field">
                <span className="field-label">Runoff Coeff.</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={runoffCoefficient} 
                    onChange={e => setRunoffCoefficient(+e.target.value)}
                    required
                  />
                  <span className="field-unit">-</span>
                </div>
              </label>
            </div>
          </div>

          {/* Reservoir Parameters */}
          <div className="parameter-group reservoir">
            <h3 className="group-title">
              <span className="group-icon">🏗️</span>
              Reservoir
            </h3>
            <div className="parameter-row">
              <label className="parameter-field">
                <span className="field-label">Constant K</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.1"
                    min="0.1"
                    value={linearReservoirConstantK} 
                    onChange={e => setLinearReservoirConstantK(+e.target.value)}
                    required
                  />
                  <span className="field-unit">hours</span>
                </div>
              </label>
              
              <label className="parameter-field">
                <span className="field-label">Initial Storage</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.1"
                    min="0"
                    value={initialStorageCubicMeters} 
                    onChange={e => setInitialStorageCubicMeters(+e.target.value)}
                  />
                  <span className="field-unit">m³</span>
                </div>
              </label>
            </div>
          </div>

          {/* Simulation Parameters */}
          <div className="parameter-group simulation">
            <h3 className="group-title">
              <span className="group-icon">⚙️</span>
              Simulation
            </h3>
            <div className="parameter-row">
              <label className="parameter-field">
                <span className="field-label">Time Step</span>
                <div className="input-container">
                  <input 
                    className="field-input"
                    type="number" 
                    step="0.1"
                    min="0.1"
                    max="2"
                    value={timeStepHours} 
                    onChange={e => setTimeStepHours(+e.target.value)}
                    required
                  />
                  <span className="field-unit">hours</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            <span className="button-icon">🔄</span>
            Generate Hydrograph
          </button>
        </div>
      </form>
    </div>
  );
}
