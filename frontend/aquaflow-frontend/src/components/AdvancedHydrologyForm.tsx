import React, { useState, useEffect } from 'react';
import './AdvancedHydrologyForm.css';

interface AdvancedHydrologicalParameters {
  // Precipitation Parameters
  intensityMmPerHour: number;
  durationHours: number;
  
  // Watershed Physical Parameters
  catchmentAreaKm2: number;
  watershedSlopePercent: number;
  watershedLengthKm: number;
  
  // SCS Curve Number Parameters
  curveNumber: number;
  antecedentMoisture: number; // 1=Dry, 2=Normal, 3=Wet
  
  // Linear Reservoir Parameters
  linearReservoirConstantK: number;
  initialStorageCubicMeters: number;
  numberOfReservoirs: number;
  
  // Simulation Parameters
  timeStepHours: number;
  selectedModel: string;
  
  // Advanced Parameters
  evapotranspirationMmPerHour: number;
  baseFlowCubicMetersPerSecond: number;
}

interface ModelInfo {
  value: string;
  name: string;
  description: string;
}

interface CurveNumberGuidance {
  urban: { low: number; medium: number; high: number; description: string };
  agricultural: { good: number; fair: number; poor: number; description: string };
  forest: { good: number; fair: number; poor: number; description: string };
  pasture: { good: number; fair: number; poor: number; description: string };
}

interface AdvancedHydrologyFormProps {
  onCalculate: (params: AdvancedHydrologicalParameters) => void;
  isLoading?: boolean;
}

export default function AdvancedHydrologyForm({ onCalculate, isLoading = false }: AdvancedHydrologyFormProps) {
  // State for form parameters
  const [intensity, setIntensity] = useState(10);
  const [duration, setDuration] = useState(6);
  const [catchmentAreaKm2, setCatchmentAreaKm2] = useState(10.0);
  const [watershedSlopePercent, setWatershedSlopePercent] = useState(2.0);
  const [watershedLengthKm, setWatershedLengthKm] = useState(5.0);
  const [curveNumber, setCurveNumber] = useState(70);
  const [antecedentMoisture, setAntecedentMoisture] = useState(2);
  const [linearReservoirConstantK, setLinearReservoirConstantK] = useState(5.0);
  const [initialStorageCubicMeters, setInitialStorageCubicMeters] = useState(0.0);
  const [numberOfReservoirs, setNumberOfReservoirs] = useState(3);
  const [timeStepHours, setTimeStepHours] = useState(1.0);
  const [selectedModel, setSelectedModel] = useState('CurveNumberMethod');
  const [evapotranspirationMmPerHour, setEvapotranspirationMmPerHour] = useState(0.0);
  const [baseFlowCubicMetersPerSecond, setBaseFlowCubicMetersPerSecond] = useState(0.0);
  
  // State for model information
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [curveNumberGuidance, setCurveNumberGuidance] = useState<CurveNumberGuidance | null>(null);
  const [showCNGuidance, setShowCNGuidance] = useState(false);

  useEffect(() => {
    // Fetch available models and guidance
    fetch('http://localhost:5185/api/hydrology/models')
      .then(res => res.json())
      .then(data => {
        setAvailableModels(data.models || []);
        setCurveNumberGuidance(data.curveNumberGuidance || null);
      })
      .catch(err => console.error('Failed to fetch model info:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      intensityMmPerHour: intensity,
      durationHours: duration,
      catchmentAreaKm2,
      watershedSlopePercent,
      watershedLengthKm,
      curveNumber,
      antecedentMoisture,
      linearReservoirConstantK,
      initialStorageCubicMeters,
      numberOfReservoirs,
      timeStepHours,
      selectedModel,
      evapotranspirationMmPerHour,
      baseFlowCubicMetersPerSecond
    });
  };

  const getAMCDescription = (value: number) => {
    switch (value) {
      case 1: return 'Dry - Soils are dry but not to wilting point';
      case 2: return 'Normal - Average conditions for annual floods';
      case 3: return 'Wet - Heavy rainfall or low temperatures within 5 days';
      default: return '';
    }
  };

  const isReservoirChainModel = selectedModel === 'LinearReservoirChain' || selectedModel === 'CombinedModel';
  const usesCurveNumber = selectedModel !== 'SimpleLinearReservoir';

  return (
    <div className="advanced-hydrology-form-container">
      <div className="form-header">
        <h2 className="form-title">Advanced Hydrological Modeling</h2>
        <p className="form-subtitle">
          Professional-grade rainfall-runoff modeling with multiple methodologies
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="advanced-hydrology-form">
        {/* Model Selection */}
        <section className="form-section">
          <h3 className="form-section-header">Model Selection</h3>
          <div className="model-selection">
            <label className="form-label">
              <span>Runoff Model</span>
              <select 
                className="form-select"
                value={selectedModel} 
                onChange={e => setSelectedModel(e.target.value)}
              >
                {availableModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.name}
                  </option>
                ))}
              </select>
              <small className="field-description">
                {availableModels.find(m => m.value === selectedModel)?.description}
              </small>
            </label>
          </div>
        </section>

        {/* Precipitation Parameters */}
        <section className="form-section">
          <h3 className="form-section-header">Precipitation Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Rainfall Intensity</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0.1"
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
                  max="168"
                  value={duration} 
                  onChange={e => setDuration(+e.target.value)}
                  required
                />
                <span className="input-unit">hours</span>
              </div>
            </label>
          </div>
        </section>

        {/* Watershed Parameters */}
        <section className="form-section">
          <h3 className="form-section-header">Watershed Characteristics</h3>
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
              <span>Average Watershed Slope</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0"
                  max="45"
                  value={watershedSlopePercent} 
                  onChange={e => setWatershedSlopePercent(+e.target.value)}
                />
                <span className="input-unit">%</span>
              </div>
              <small className="field-description">
                Affects time of concentration and peak flow timing
              </small>
            </label>
            
            <label className="form-label">
              <span>Watershed Length</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={watershedLengthKm} 
                  onChange={e => setWatershedLengthKm(+e.target.value)}
                />
                <span className="input-unit">km</span>
              </div>
              <small className="field-description">
                Longest flow path from watershed divide to outlet
              </small>
            </label>
          </div>
        </section>

        {/* SCS Curve Number Parameters */}
        {usesCurveNumber && (
          <section className="form-section">
            <h3 className="form-section-header">
              SCS Curve Number Parameters
              <button 
                type="button" 
                className="info-button"
                onClick={() => setShowCNGuidance(!showCNGuidance)}
                title="Show curve number guidance"
              >
                ℹ️
              </button>
            </h3>
            
            {showCNGuidance && curveNumberGuidance && (
              <div className="curve-number-guidance">
                <h4>Curve Number Guidance</h4>
                <div className="guidance-grid">
                  <div className="guidance-item">
                    <strong>Urban Areas:</strong>
                    <ul>
                      <li>Low density: {curveNumberGuidance.urban.low}</li>
                      <li>Medium density: {curveNumberGuidance.urban.medium}</li>
                      <li>High density: {curveNumberGuidance.urban.high}</li>
                    </ul>
                  </div>
                  <div className="guidance-item">
                    <strong>Agricultural:</strong>
                    <ul>
                      <li>Good condition: {curveNumberGuidance.agricultural.good}</li>
                      <li>Fair condition: {curveNumberGuidance.agricultural.fair}</li>
                      <li>Poor condition: {curveNumberGuidance.agricultural.poor}</li>
                    </ul>
                  </div>
                  <div className="guidance-item">
                    <strong>Forest:</strong>
                    <ul>
                      <li>Good condition: {curveNumberGuidance.forest.good}</li>
                      <li>Fair condition: {curveNumberGuidance.forest.fair}</li>
                      <li>Poor condition: {curveNumberGuidance.forest.poor}</li>
                    </ul>
                  </div>
                  <div className="guidance-item">
                    <strong>Pasture:</strong>
                    <ul>
                      <li>Good condition: {curveNumberGuidance.pasture.good}</li>
                      <li>Fair condition: {curveNumberGuidance.pasture.fair}</li>
                      <li>Poor condition: {curveNumberGuidance.pasture.poor}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="input-group">
              <label className="form-label">
                <span>Curve Number (CN)</span>
                <div className="input-with-unit">
                  <input 
                    className="form-input"
                    type="number" 
                    min="30"
                    max="100"
                    value={curveNumber} 
                    onChange={e => setCurveNumber(+e.target.value)}
                    required={usesCurveNumber}
                  />
                  <span className="input-unit">-</span>
                </div>
                <small className="field-description">
                  USDA SCS curve number for AMC II conditions (30-100)
                </small>
              </label>
              
              <label className="form-label">
                <span>Antecedent Moisture Condition</span>
                <select 
                  className="form-select"
                  value={antecedentMoisture} 
                  onChange={e => setAntecedentMoisture(+e.target.value)}
                >
                  <option value={1}>AMC I - Dry</option>
                  <option value={2}>AMC II - Normal</option>
                  <option value={3}>AMC III - Wet</option>
                </select>
                <small className="field-description">
                  {getAMCDescription(antecedentMoisture)}
                </small>
              </label>
            </div>
          </section>
        )}

        {/* Routing Parameters */}
        <section className="form-section">
          <h3 className="form-section-header">Flow Routing Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Linear Reservoir Constant K</span>
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
              <small className="field-description">
                Storage coefficient - higher values create more attenuation
              </small>
            </label>
            
            {isReservoirChainModel && (
              <label className="form-label">
                <span>Number of Reservoirs</span>
                <div className="input-with-unit">
                  <input 
                    className="form-input"
                    type="number" 
                    min="1"
                    max="10"
                    value={numberOfReservoirs} 
                    onChange={e => setNumberOfReservoirs(+e.target.value)}
                  />
                  <span className="input-unit">-</span>
                </div>
                <small className="field-description">
                  More reservoirs create smoother, more realistic hydrographs
                </small>
              </label>
            )}
            
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
              <small className="field-description">
                Initial water storage in the watershed system
              </small>
            </label>
          </div>
        </section>

        {/* Advanced Parameters */}
        <section className="form-section">
          <h3 className="form-section-header">Advanced Parameters</h3>
          <div className="input-group">
            <label className="form-label">
              <span>Evapotranspiration Rate</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0"
                  max="10"
                  value={evapotranspirationMmPerHour} 
                  onChange={e => setEvapotranspirationMmPerHour(+e.target.value)}
                />
                <span className="input-unit">mm/hr</span>
              </div>
              <small className="field-description">
                Continuous water loss through evaporation and transpiration
              </small>
            </label>
            
            <label className="form-label">
              <span>Base Flow</span>
              <div className="input-with-unit">
                <input 
                  className="form-input"
                  type="number" 
                  step="0.1"
                  min="0"
                  value={baseFlowCubicMetersPerSecond} 
                  onChange={e => setBaseFlowCubicMetersPerSecond(+e.target.value)}
                />
                <span className="input-unit">m³/s</span>
              </div>
              <small className="field-description">
                Constant groundwater contribution to streamflow
              </small>
            </label>
            
            <label className="form-label">
              <span>Simulation Time Step</span>
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
              <small className="field-description">
                Computational time step - smaller values increase accuracy
              </small>
            </label>
          </div>
        </section>
        
        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Calculating Advanced Model...
            </>
          ) : (
            'Generate Advanced Hydrograph'
          )}
        </button>
      </form>
    </div>
  );
}
