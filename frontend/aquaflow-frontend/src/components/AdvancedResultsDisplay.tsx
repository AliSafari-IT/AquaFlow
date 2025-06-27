import React from 'react';
import HydrographChart from './HydrographChart';
import './AdvancedResultsDisplay.css';

interface ModelSummary {
  modelName: string;
  totalRainfallMm: number;
  totalRunoffMm: number;
  runoffCoefficient: number;
  peakFlowCubicMetersPerSecond: number;
  timeToPeakHours: number;
  totalVolumeCubicMeters: number;
  modelSpecificParameters: Record<string, any>;
}

interface HydrographResult {
  hydrographPoints: Array<{ timeHours: number; flowCubicMetersPerSecond: number }>;
  modelSummary: ModelSummary;
  calculationNotes: string[];
}

interface AdvancedResultsDisplayProps {
  result: HydrographResult;
}

export default function AdvancedResultsDisplay({ result }: AdvancedResultsDisplayProps) {
  const { hydrographPoints, modelSummary, calculationNotes } = result;

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="advanced-results-container">
      {/* Results Header */}
      <div className="results-header">
        <h2 className="results-title">Simulation Results</h2>
        <div className="model-badge">
          <span className="model-name">{modelSummary.modelName}</span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">🌊</div>
          <div className="metric-content">
            <span className="metric-label">Peak Flow</span>
            <span className="metric-value">{formatNumber(modelSummary.peakFlowCubicMetersPerSecond, 3)}</span>
            <span className="metric-unit">m³/s</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <span className="metric-label">Time to Peak</span>
            <span className="metric-value">{formatNumber(modelSummary.timeToPeakHours, 1)}</span>
            <span className="metric-unit">hours</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💧</div>
          <div className="metric-content">
            <span className="metric-label">Total Runoff</span>
            <span className="metric-value">{formatNumber(modelSummary.totalRunoffMm, 1)}</span>
            <span className="metric-unit">mm</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <span className="metric-label">Runoff Coefficient</span>
            <span className="metric-value">{formatNumber(modelSummary.runoffCoefficient, 3)}</span>
            <span className="metric-unit">-</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌧️</div>
          <div className="metric-content">
            <span className="metric-label">Total Rainfall</span>
            <span className="metric-value">{formatNumber(modelSummary.totalRainfallMm, 1)}</span>
            <span className="metric-unit">mm</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <span className="metric-label">Total Volume</span>
            <span className="metric-value">{formatLargeNumber(modelSummary.totalVolumeCubicMeters)}</span>
            <span className="metric-unit">m³</span>
          </div>
        </div>
      </div>

      {/* Hydrograph Chart */}
      <div className="chart-section">
        <div className="chart-container">
          <h3 className="chart-title">Generated Hydrograph</h3>
          <HydrographChart data={hydrographPoints} />
        </div>
      </div>

      {/* Model-Specific Parameters */}
      <div className="parameters-section">
        <h3 className="section-title">Model Parameters</h3>
        <div className="parameters-grid">
          {Object.entries(modelSummary.modelSpecificParameters).map(([key, value]) => (
            <div key={key} className="parameter-item">
              <span className="parameter-label">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="parameter-value">
                {typeof value === 'number' ? formatNumber(value, 3) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calculation Notes */}
      {calculationNotes.length > 0 && (
        <div className="notes-section">
          <h3 className="section-title">Calculation Notes</h3>
          <div className="notes-container">
            {calculationNotes.map((note, index) => (
              <div key={index} className="note-item">
                <span className="note-indicator">•</span>
                <span className="note-text">{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Information */}
      <div className="educational-section">
        <h3 className="section-title">Understanding Your Results</h3>
        <div className="educational-grid">
          <div className="educational-card">
            <h4>Peak Flow</h4>
            <p>
              The maximum discharge rate during the storm event. This critical value is used for 
              flood management, infrastructure design, and emergency planning.
            </p>
          </div>
          <div className="educational-card">
            <h4>Time to Peak</h4>
            <p>
              The time from the start of rainfall to when peak flow occurs. This depends on 
              watershed characteristics like slope, size, and land use.
            </p>
          </div>
          <div className="educational-card">
            <h4>Runoff Coefficient</h4>
            <p>
              The fraction of rainfall that becomes surface runoff. Values range from near 0 
              (very permeable surfaces) to near 1 (impermeable surfaces like pavement).
            </p>
          </div>
          <div className="educational-card">
            <h4>Model Selection Impact</h4>
            <p>
              Different models capture various physical processes. The SCS method accounts for 
              soil moisture, while reservoir chains model natural flow attenuation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
