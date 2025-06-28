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
  
  // Green-Ampt Parameters
  saturatedHydraulicConductivity: number;
  suctionHead: number;
  saturatedMoistureContent: number;
  initialMoistureContent: number;
  soilType: string;
}

interface ModelInfo {
  value: string;
  name: string;
  description: string;
}

interface SoilTypeInfo {
  value: string;
  name: string;
  ks: number;
  psi: number;
  thetaS: number;
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
  
  // Green-Ampt parameters
  const [saturatedHydraulicConductivity, setSaturatedHydraulicConductivity] = useState(10.0);
  const [suctionHead, setSuctionHead] = useState(110.0);
  const [saturatedMoistureContent, setSaturatedMoistureContent] = useState(0.45);
  const [initialMoistureContent, setInitialMoistureContent] = useState(0.05);
  const [soilType, setSoilType] = useState('Loam');
  
  // State for model information
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [soilTypes, setSoilTypes] = useState<SoilTypeInfo[]>([]);
  const [curveNumberGuidance, setCurveNumberGuidance] = useState<CurveNumberGuidance | null>(null);
  const [showCNGuidance, setShowCNGuidance] = useState(false);

  useEffect(() => {
    // Fetch available models and guidance
    fetch('http://localhost:5185/api/hydrology/models')
      .then(res => res.json())
      .then(data => {
        setAvailableModels(data.models || []);
        setSoilTypes(data.soilTypes || []);
        setCurveNumberGuidance(data.curveNumberGuidance || null);
      })
      .catch(err => console.error('Failed to fetch model info:', err));
  }, []);

  // Update Green-Ampt parameters when soil type changes
  useEffect(() => {
    const selectedSoilType = soilTypes.find(st => st.value === soilType);
    if (selectedSoilType) {
      setSaturatedHydraulicConductivity(selectedSoilType.ks);
      setSuctionHead(selectedSoilType.psi);
      setSaturatedMoistureContent(selectedSoilType.thetaS);
    }
  }, [soilType, soilTypes]);

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
      baseFlowCubicMetersPerSecond,
      saturatedHydraulicConductivity,
      suctionHead,
      saturatedMoistureContent,
      initialMoistureContent,
      soilType
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
  const usesCurveNumber = selectedModel !== 'SimpleLinearReservoir' && selectedModel !== 'GreenAmptInfiltration';
  const isGreenAmptModel = selectedModel === 'GreenAmptInfiltration';

  return (
    <div className="advanced-hydrology-form-container">
      <div className="form-header">
        <h2 className="form-title">
          <span className="form-icon">⚙️</span>
          Advanced Hydrological Modeling
        </h2>
        <p className="form-description">
          Professional-grade rainfall-runoff modeling with multiple methodologies
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="advanced-hydrology-form">
        {/* Model Selection */}
        <section className="form-section">
          <h3 className="form-section-header">
            <span>🔧</span>
            Model Selection
          </h3>
          <div className="input-group">
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
          <h3 className="form-section-header">
            <span>🌧️</span>
            Precipitation Parameters
          </h3>
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
          <h3 className="form-section-header">
            <span>🏔️</span>
            Watershed Characteristics
          </h3>
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
              <span>📊</span>
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

        {/* Green-Ampt Infiltration Parameters */}
        {isGreenAmptModel && (
          <section className="form-section">
            <h3 className="form-section-header">
              <span>🌱</span>
              Green-Ampt Infiltration Parameters
            </h3>
            
            <div className="input-group">
              <label className="form-label">
                <span>Soil Type</span>
                <select 
                  className="form-select"
                  value={soilType} 
                  onChange={e => setSoilType(e.target.value)}
                >
                  {soilTypes.map(soil => (
                    <option key={soil.value} value={soil.value}>
                      {soil.name}
                    </option>
                  ))}
                </select>
                <small className="field-description">
                  {soilTypes.find(s => s.value === soilType)?.description || 'Select soil type for automatic parameter setting'}
                </small>
              </label>
            </div>

            <div className="input-grid">
              <div className="input-group">
                <label className="form-label">
                  <span>Saturated Hydraulic Conductivity (Ks)</span>
                  <div className="input-with-unit">
                    <input 
                      className="form-input"
                      type="number" 
                      step="0.1"
                      min="0.1"
                      max="200"
                      value={saturatedHydraulicConductivity} 
                      onChange={e => setSaturatedHydraulicConductivity(+e.target.value)}
                    />
                    <span className="input-unit">mm/h</span>
                  </div>
                  <small className="field-description">
                    Saturated hydraulic conductivity of the soil (0.1-200 mm/h)
                  </small>
                </label>
              </div>

              <div className="input-group">
                <label className="form-label">
                  <span>Suction Head (ψ)</span>
                  <div className="input-with-unit">
                    <input 
                      className="form-input"
                      type="number" 
                      step="0.1"
                      min="10"
                      max="400"
                      value={suctionHead} 
                      onChange={e => setSuctionHead(+e.target.value)}
                    />
                    <span className="input-unit">mm</span>
                  </div>
                  <small className="field-description">
                    Suction head at the wetting front (10-400 mm)
                  </small>
                </label>
              </div>

              <div className="input-group">
                <label className="form-label">
                  <span>Saturated Moisture Content (θs)</span>
                  <input 
                    className="form-input"
                    type="number" 
                    step="0.001"
                    min="0.3"
                    max="0.6"
                    value={saturatedMoistureContent} 
                    onChange={e => setSaturatedMoistureContent(+e.target.value)}
                  />
                  <small className="field-description">
                    Saturated moisture content (0.3-0.6)
                  </small>
                </label>
              </div>

              <div className="input-group">
                <label className="form-label">
                  <span>Initial Moisture Content (θi)</span>
                  <input 
                    className="form-input"
                    type="number" 
                    step="0.001"
                    min="0.01"
                    max="0.2"
                    value={initialMoistureContent} 
                    onChange={e => setInitialMoistureContent(+e.target.value)}
                  />
                  <small className="field-description">
                    Initial moisture content (0.01-0.2)
                  </small>
                </label>
              </div>
            </div>

            <div className="info-card">
              <h4>💡 Green-Ampt Model Information</h4>
              <p>
                The Green-Ampt model calculates infiltration rates based on soil physics. 
                Moisture deficit (Δθ = θs - θi) drives the infiltration process.
                {soilType && (
                  <span className="highlight">
                    {' '}Current moisture deficit: {(saturatedMoistureContent - initialMoistureContent).toFixed(3)}
                  </span>
                )}
              </p>
            </div>
          </section>
        )}

        {/* Routing Parameters */}
        <section className="form-section">
          <h3 className="form-section-header">
            <span>🏛️</span>
            Flow Routing Parameters
          </h3>
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
          <h3 className="form-section-header">
            <span>⚡</span>
            Advanced Parameters
          </h3>
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
            <>
              <span>⚙️</span>
              Generate Advanced Hydrograph
            </>
          )}
        </button>
      </form>
    </div>
  );
}
