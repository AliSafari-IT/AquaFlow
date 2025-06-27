import React from 'react';
import HydrographChart from './HydrographChart';
import DataDiagnostics from './DataDiagnostics';
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
  csvData?: Array<{
    year: number;
    month: number;
    day: number;
    hour: number;
    flowCubicMetersPerSecond: number;
    timeHours: number;
  }>;
  showObservations?: boolean;
  onToggleObservations?: (show: boolean) => void;
}

export default function AdvancedResultsDisplay({ result, csvData, showObservations = false, onToggleObservations }: AdvancedResultsDisplayProps) {
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

  // Helper function to calculate comparison statistics
  const calculateComparisonStats = (modeledData: Array<{ timeHours: number; flowCubicMetersPerSecond: number }>, observedData: Array<{
    year: number;
    month: number;
    day: number;
    hour: number;
    flowCubicMetersPerSecond: number;
    timeHours: number;
  }>) => {
    if (!modeledData || !observedData || modeledData.length === 0 || observedData.length === 0) {
      return null;
    }

    const modeledPeak = Math.max(...modeledData.map(d => d.flowCubicMetersPerSecond));
    const observedPeak = Math.max(...observedData.map(d => d.flowCubicMetersPerSecond));
    
    const peakDifference = modeledPeak - observedPeak;
    const peakPercentError = ((Math.abs(peakDifference) / observedPeak) * 100);
    
    return {
      modeledPeak,
      observedPeak,
      peakDifference,
      peakPercentError,
      peakOverprediction: peakDifference > 0
    };
  };

  const comparisonStats = showObservations && csvData ? 
    calculateComparisonStats(hydrographPoints, csvData) : null;

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
          <div className="chart-header">
            <h3 className="chart-title">
              {showObservations && csvData ? 'Model vs Observations Comparison' : 'Modeled Hydrograph'}
            </h3>
            {csvData && csvData.length > 0 && onToggleObservations && (
              <div className="observation-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={showObservations}
                    onChange={(e) => onToggleObservations(e.target.checked)}
                  />
                  Show Observed Data
                </label>
              </div>
            )}
          </div>
          
          {/* Debug diagnostics - remove this after troubleshooting */}
          <DataDiagnostics 
            modeledData={hydrographPoints} 
            csvData={csvData} 
          />
          
          <HydrographChart 
            data={hydrographPoints} 
            csvData={csvData} 
            showObservations={showObservations && csvData && csvData.length > 0}
          />
        </div>
      </div>

      {/* Comparison Statistics */}
      {comparisonStats && showObservations && (
        <div className="comparison-stats-section">
          <div className="comparison-stats-container">
            <h3 className="comparison-title">📊 Model vs Observations Analysis</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🔬</div>
                <div className="stat-content">
                  <span className="stat-label">Modeled Peak</span>
                  <span className="stat-value">{comparisonStats.modeledPeak.toFixed(2)} m³/s</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <span className="stat-label">Observed Peak</span>
                  <span className="stat-value">{comparisonStats.observedPeak.toFixed(2)} m³/s</span>
                </div>
              </div>
              <div className={`stat-card ${comparisonStats.peakOverprediction ? 'overprediction' : 'underprediction'}`}>
                <div className="stat-icon">{comparisonStats.peakOverprediction ? '⬆️' : '⬇️'}</div>
                <div className="stat-content">
                  <span className="stat-label">Peak Difference</span>
                  <span className="stat-value">
                    {comparisonStats.peakOverprediction ? '+' : ''}{comparisonStats.peakDifference.toFixed(2)} m³/s
                  </span>
                </div>
              </div>
              <div className={`stat-card ${comparisonStats.peakPercentError < 20 ? 'good-fit' : comparisonStats.peakPercentError < 50 ? 'fair-fit' : 'poor-fit'}`}>
                <div className="stat-icon">{comparisonStats.peakPercentError < 20 ? '✅' : comparisonStats.peakPercentError < 50 ? '⚠️' : '❌'}</div>
                <div className="stat-content">
                  <span className="stat-label">Percent Error</span>
                  <span className="stat-value">{comparisonStats.peakPercentError.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="performance-indicator">
              <p>
                <strong>Model Performance:</strong> 
                {comparisonStats.peakPercentError < 20 ? 
                  ' Excellent agreement - The selected model parameters closely reproduce the observed hydrograph!' :
                  comparisonStats.peakPercentError < 50 ?
                  ' Good agreement - The model captures the general behavior with some deviation. Consider parameter calibration.' :
                  ' Poor agreement - Significant differences suggest the need for parameter adjustment or alternative model selection.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Data Diagnostics - Debugging Component */}
      <div className="data-diagnostics-section">
        <h3 className="section-title">Data Diagnostics</h3>
        <DataDiagnostics modeledData={hydrographPoints} csvData={csvData} />
      </div>
    </div>
  );
}
