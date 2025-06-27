// components/HydrographChart.tsx
import { Line } from 'react-chartjs-2';
import React from 'react';

interface HydrographDataPoint {
  timeHours: number;
  flowCubicMetersPerSecond: number;
}

interface CSVDataPoint {
  year: number;
  month: number;
  day: number;
  hour: number;
  flowCubicMetersPerSecond: number;
  timeHours: number;
}

interface HydrographChartProps {
  data: HydrographDataPoint[];
  csvData?: CSVDataPoint[];
  showObservations?: boolean;
}

interface ComparisonStats {
  peakModeledFlow: number;
  peakObservedFlow: number;
  peakPercentError: number;
  meanModeledFlow: number;
  meanObservedFlow: number;
  meanPercentError: number;
  rmse: number;
  nashSutcliffe: number;
  correlationCoefficient: number;
}

// Helper function to calculate comparison statistics
function calculateComparisonStats(modeledData: HydrographDataPoint[], observedData: CSVDataPoint[]): ComparisonStats {
  if (!modeledData.length || !observedData.length) {
    return {
      peakModeledFlow: 0,
      peakObservedFlow: 0,
      peakPercentError: 0,
      meanModeledFlow: 0,
      meanObservedFlow: 0,
      meanPercentError: 0,
      rmse: 0,
      nashSutcliffe: 0,
      correlationCoefficient: 0,
    };
  }

  // Get the minimum length to compare
  const minLength = Math.min(modeledData.length, observedData.length);
  const modeledFlows = modeledData.slice(0, minLength).map(d => d.flowCubicMetersPerSecond);
  const observedFlows = observedData.slice(0, minLength).map(d => d.flowCubicMetersPerSecond);

  // Peak flows
  const peakModeledFlow = Math.max(...modeledFlows);
  const peakObservedFlow = Math.max(...observedFlows);
  const peakPercentError = Math.abs((peakModeledFlow - peakObservedFlow) / peakObservedFlow) * 100;

  // Mean flows
  const meanModeledFlow = modeledFlows.reduce((sum, val) => sum + val, 0) / modeledFlows.length;
  const meanObservedFlow = observedFlows.reduce((sum, val) => sum + val, 0) / observedFlows.length;
  const meanPercentError = Math.abs((meanModeledFlow - meanObservedFlow) / meanObservedFlow) * 100;

  // RMSE (Root Mean Square Error)
  const squaredErrors = modeledFlows.map((modeled, i) => Math.pow(modeled - observedFlows[i], 2));
  const rmse = Math.sqrt(squaredErrors.reduce((sum, val) => sum + val, 0) / squaredErrors.length);

  // Nash-Sutcliffe Efficiency
  const observedMean = meanObservedFlow;
  const numerator = squaredErrors.reduce((sum, val) => sum + val, 0);
  const denominator = observedFlows.reduce((sum, val) => sum + Math.pow(val - observedMean, 2), 0);
  const nashSutcliffe = 1 - (numerator / denominator);

  // Correlation Coefficient
  const modeledMean = meanModeledFlow;
  let numeratorCorr = 0;
  let denominatorModeled = 0;
  let denominatorObserved = 0;
  
  for (let i = 0; i < minLength; i++) {
    const modeledDiff = modeledFlows[i] - modeledMean;
    const observedDiff = observedFlows[i] - observedMean;
    numeratorCorr += modeledDiff * observedDiff;
    denominatorModeled += modeledDiff * modeledDiff;
    denominatorObserved += observedDiff * observedDiff;
  }
  
  const correlationCoefficient = numeratorCorr / Math.sqrt(denominatorModeled * denominatorObserved);

  return {
    peakModeledFlow,
    peakObservedFlow,
    peakPercentError,
    meanModeledFlow,
    meanObservedFlow,
    meanPercentError,
    rmse,
    nashSutcliffe,
    correlationCoefficient: isNaN(correlationCoefficient) ? 0 : correlationCoefficient,
  };
}

export default function HydrographChart({ data, csvData, showObservations = false }: HydrographChartProps) {
  const csvChartData = showObservations && csvData ? csvData : null;

  // Calculate comparison statistics if both datasets are available
  const comparisonStats = (showObservations && data && csvData) ? 
    calculateComparisonStats(data, csvData) : null;

  // Create datasets array
  const datasets = [];

  // Always add the generated hydrograph if we have data
  if (data && data.length > 0) {
    datasets.push({
      label: 'Modeled Hydrograph',
      data: data.map(d => d.flowCubicMetersPerSecond),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      borderWidth: 2,
    });
  }

  // Add CSV observations if available and requested
  if (csvChartData && showObservations) {
    datasets.push({
      label: 'Observed Data (CSV)',
      data: csvChartData.map(d => d.flowCubicMetersPerSecond),
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      // @ts-ignore - borderDash is valid Chart.js property
      borderDash: [8, 4], // Dashed line for observations
    } as any);
  }

  // Create labels - prioritize showing time-based labels
  let chartLabels: string[] = [];
  if (showObservations && csvChartData) {
    // For comparison, use CSV time labels but align with data points
    const maxDataPoints = Math.max(data?.length || 0, csvChartData.length);
    chartLabels = Array.from({ length: maxDataPoints }, (_, i) => {
      if (i < csvChartData.length) {
        const d = csvChartData[i];
        const date = new Date(d.year, d.month - 1, d.day, d.hour);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (data && i < data.length) {
        return `${data[i].timeHours}h`;
      }
      return `Point ${i + 1}`;
    });
  } else if (data && data.length > 0) {
    chartLabels = data.map(d => `${d.timeHours}h`);
  } else if (csvChartData) {
    chartLabels = csvChartData.map(d => {
      const date = new Date(d.year, d.month - 1, d.day, d.hour);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: datasets
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: showObservations && csvData ? 
          'Hydrograph Comparison - Modeled vs Observed Flow' : 
          'Hydrograph - Flow Rate Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return `Time: ${context[0].label}`;
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} m³/s`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: showObservations && csvData ? 'Time' : 'Time (hours)',
          font: {
            weight: 'bold' as const,
          }
        },
        ticks: {
          maxTicksLimit: 12,
          autoSkip: true,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Flow Rate (m³/s)',
          font: {
            weight: 'bold' as const,
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  return (
    <div className="hydrograph-chart-container">
      <Line data={chartData} options={options} />
      
      {/* Comparison Statistics */}
      {comparisonStats && showObservations && (
        <div className="comparison-stats" style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: 'var(--card-background)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: 'var(--text-color)',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Model Performance Statistics
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Peak Flow Comparison */}
            <div className="stat-item">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Peak Flow Comparison
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Modeled: {comparisonStats.peakModeledFlow.toFixed(2)} m³/s
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Observed: {comparisonStats.peakObservedFlow.toFixed(2)} m³/s
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: comparisonStats.peakPercentError < 20 ? '#22c55e' : 
                       comparisonStats.peakPercentError < 50 ? '#f59e0b' : '#ef4444',
                fontWeight: '500'
              }}>
                Error: {comparisonStats.peakPercentError.toFixed(1)}%
              </div>
            </div>

            {/* Mean Flow Comparison */}
            <div className="stat-item">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Mean Flow Comparison
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Modeled: {comparisonStats.meanModeledFlow.toFixed(2)} m³/s
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Observed: {comparisonStats.meanObservedFlow.toFixed(2)} m³/s
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: comparisonStats.meanPercentError < 20 ? '#22c55e' : 
                       comparisonStats.meanPercentError < 50 ? '#f59e0b' : '#ef4444',
                fontWeight: '500'
              }}>
                Error: {comparisonStats.meanPercentError.toFixed(1)}%
              </div>
            </div>

            {/* Statistical Metrics */}
            <div className="stat-item">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Statistical Metrics
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                RMSE: {comparisonStats.rmse.toFixed(3)} m³/s
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Nash-Sutcliffe: {comparisonStats.nashSutcliffe.toFixed(3)}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>
                Correlation: {comparisonStats.correlationCoefficient.toFixed(3)}
              </div>
            </div>

            {/* Performance Assessment */}
            <div className="stat-item">
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Overall Assessment
              </div>
              <div style={{ 
                fontSize: '1rem', 
                color: comparisonStats.nashSutcliffe > 0.75 ? '#22c55e' : 
                       comparisonStats.nashSutcliffe > 0.5 ? '#f59e0b' : '#ef4444',
                fontWeight: '600',
                lineHeight: '1.4'
              }}>
                {comparisonStats.nashSutcliffe > 0.75 ? 
                  'Excellent Model Performance' :
                  comparisonStats.nashSutcliffe > 0.5 ?
                  'Good Model Performance' :
                  comparisonStats.nashSutcliffe > 0.2 ?
                  'Satisfactory Performance' :
                  'Poor Model Performance'
                }
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)',
                marginTop: '4px',
                lineHeight: '1.3'
              }}>
                {comparisonStats.nashSutcliffe > 0.75 ? 
                  'Model closely reproduces observed data' :
                  comparisonStats.nashSutcliffe > 0.5 ?
                  'Model captures general behavior well' :
                  comparisonStats.nashSutcliffe > 0.2 ?
                  'Model shows reasonable agreement' :
                  'Consider parameter adjustment'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
