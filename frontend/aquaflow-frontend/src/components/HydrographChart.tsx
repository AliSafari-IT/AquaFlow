// components/HydrographChart.tsx
import { Line, getElementAtEvent, getDatasetAtEvent } from 'react-chartjs-2';
import React, { useRef, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';

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
  modelName?: string;
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

export default function HydrographChart({ data, csvData, showObservations = false, modelName }: HydrographChartProps) {
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
          `Hydrograph Comparison - Modeled vs Observed Flow${modelName ? ` (${modelName})` : ''}` : 
          `Hydrograph - Flow Rate Over Time${modelName ? ` (${modelName})` : ''}`,
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

  // Chart reference for downloading
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to download chart as PNG
  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement('a');
      link.download = 'hydrograph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
    setShowDropdown(false);
  };

  // Function to download hydrograph data as CSV
  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    // Create CSV content
    const headers = ['Time (hours)', 'Flow (m³/s)'];
    const csvContent = [
      headers.join(','),
      ...data.map(point => 
        `${point.timeHours},${point.flowCubicMetersPerSecond.toFixed(4)}`
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hydrograph_data.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setShowDropdown(false);
  };

  return (
    <div className="hydrograph-chart-container" style={{ position: 'relative' }}>
      {/* Add CSS for dropdown animation */}
      <style>
        {`
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      
      {/* Download Button with Dropdown */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end'
      }}>
        {/* Model Name Badge */}
        {modelName && (
          <div style={{
            background: 'var(--card-background, #fff)',
            color: 'var(--primary-color, #059669)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '500',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1))',
          }}>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '4px', verticalAlign: 'middle' }}
            >
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4"/>
              <path d="M20 16V7a2 2 0 0 0-2-2H9"/>
              <path d="M22 22l-5-10-5 10"/>
              <path d="M14 18h.01"/>
            </svg>
            {modelName}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {/* Main Download Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: showDropdown 
                ? 'var(--button-hover-bg, #374151)' 
                : 'var(--button-bg, #1f2937)',
              color: 'var(--button-text, #f9fafb)',
              border: '1px solid var(--button-border, #4b5563)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: showDropdown 
                ? '0 8px 25px var(--shadow-color, rgba(0, 0, 0, 0.3)), 0 0 0 1px var(--button-border, #4b5563)' 
                : '0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.25)), 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.15))',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              minWidth: '110px',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              if (!showDropdown) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-color, rgba(0, 0, 0, 0.35)), 0 4px 12px var(--shadow-color, rgba(0, 0, 0, 0.2))';
                e.currentTarget.style.background = 'var(--button-hover-bg, #374151)';
                e.currentTarget.style.borderColor = 'var(--button-border-hover, #6b7280)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showDropdown) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.25)), 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.15))';
                e.currentTarget.style.background = 'var(--button-bg, #1f2937)';
                e.currentTarget.style.borderColor = 'var(--button-border, #4b5563)';
              }
            }}
            title="Download options"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download</span>
            </div>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              style={{ 
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.7
              }}
            >
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              background: 'var(--dropdown-bg, #fff)',
              border: '1px solid var(--dropdown-border, #e5e7eb)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px var(--shadow-color, rgba(0, 0, 0, 0.1)), 0 8px 16px var(--shadow-color, rgba(0, 0, 0, 0.08)), 0 0 0 1px var(--dropdown-border, #e5e7eb)',
              overflow: 'hidden',
              minWidth: '160px',
              zIndex: 20,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              animation: 'dropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {/* PNG Option */}
              <button
                onClick={downloadChart}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-color, #374151)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderBottom: '1px solid var(--border-color, #e5e7eb)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg, #f3f4f6)';
                  e.currentTarget.style.color = 'var(--primary-color, #059669)';
                  e.currentTarget.style.paddingLeft = '20px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-color, #374151)';
                  e.currentTarget.style.paddingLeft = '16px';
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: 'var(--icon-bg, #f0f9ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
                <div>
                  <div style={{ lineHeight: '1.2' }}>Download PNG</div>
                  <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '1px' }}>Chart as image</div>
                </div>
              </button>

              {/* CSV Option */}
              <button
                onClick={downloadCSV}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-color, #374151)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg, #f3f4f6)';
                  e.currentTarget.style.color = 'var(--primary-color, #059669)';
                  e.currentTarget.style.paddingLeft = '20px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-color, #374151)';
                  e.currentTarget.style.paddingLeft = '16px';
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: 'var(--icon-bg, #f0f9ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div>
                  <div style={{ lineHeight: '1.2' }}>Download CSV</div>
                  <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '1px' }}>Raw data export</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 15,
            }}
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
      
      <Line ref={chartRef} data={chartData} options={options} />
      
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
