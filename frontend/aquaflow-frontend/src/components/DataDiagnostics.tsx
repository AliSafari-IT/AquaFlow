import React from 'react';

interface DataDiagnosticsProps {
  modeledData?: Array<{ timeHours: number; flowCubicMetersPerSecond: number }>;
  csvData?: Array<{
    year: number;
    month: number;
    day: number;
    hour: number;
    flowCubicMetersPerSecond: number;
    timeHours: number;
  }>;
}

export default function DataDiagnostics({ modeledData, csvData }: DataDiagnosticsProps) {
  const analyzeData = (data: any[], label: string) => {
    if (!data || data.length === 0) return null;

    const flows = data.map(d => d.flowCubicMetersPerSecond);
    const times = data.map(d => d.timeHours);
    
    const minFlow = Math.min(...flows);
    const maxFlow = Math.max(...flows);
    const avgFlow = flows.reduce((a, b) => a + b, 0) / flows.length;
    
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const duration = maxTime - minTime;
    
    return {
      label,
      count: data.length,
      flow: { min: minFlow, max: maxFlow, avg: avgFlow },
      time: { min: minTime, max: maxTime, duration },
      firstPoint: data[0],
      lastPoint: data[data.length - 1],
      flows: flows.slice(0, 5), // First 5 flow values for debugging
      times: times.slice(0, 5)  // First 5 time values for debugging
    };
  };

  const modeledStats = modeledData ? analyzeData(modeledData, 'Modeled') : null;
  const csvStats = csvData ? analyzeData(csvData, 'CSV Observed') : null;

  return (
    <div style={{ 
      background: 'var(--card-background, #f5f5f5)', 
      padding: '20px', 
      margin: '20px 0', 
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      border: '1px solid var(--border-color, #e5e7eb)',
      color: 'var(--text-color, #374151)'
    }}>
      <h3 style={{ color: 'var(--text-color, #374151)', margin: '0 0 15px 0' }}>🔍 Data Diagnostics</h3>
      
      {modeledStats && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: 'var(--primary-color, #059669)', margin: '0 0 10px 0' }}>📊 Modeled Data Analysis:</h4>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Data points: {modeledStats.count}</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Flow range: {modeledStats.flow.min.toFixed(2)} - {modeledStats.flow.max.toFixed(2)} m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Average flow: {modeledStats.flow.avg.toFixed(2)} m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Time range: {modeledStats.time.min.toFixed(2)} - {modeledStats.time.max.toFixed(2)} hours</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Duration: {modeledStats.time.duration.toFixed(2)} hours</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First point: t={modeledStats.firstPoint.timeHours}h, Q={modeledStats.firstPoint.flowCubicMetersPerSecond}m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Last point: t={modeledStats.lastPoint.timeHours}h, Q={modeledStats.lastPoint.flowCubicMetersPerSecond}m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First 5 flows: [{modeledStats.flows.map(f => f.toFixed(2)).join(', ')}]</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First 5 times: [{modeledStats.times.map(t => t.toFixed(2)).join(', ')}]</p>
        </div>
      )}
      
      {csvStats && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: 'var(--primary-color, #059669)', margin: '0 0 10px 0' }}>📈 CSV Observed Data Analysis:</h4>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Data points: {csvStats.count}</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Flow range: {csvStats.flow.min.toFixed(2)} - {csvStats.flow.max.toFixed(2)} m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Average flow: {csvStats.flow.avg.toFixed(2)} m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Time range: {csvStats.time.min.toFixed(2)} - {csvStats.time.max.toFixed(2)} hours</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Duration: {csvStats.time.duration.toFixed(2)} hours ({(csvStats.time.duration/24).toFixed(1)} days)</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First point: {csvStats.firstPoint.year}-{csvStats.firstPoint.month}-{csvStats.firstPoint.day} {csvStats.firstPoint.hour}:00, Q={csvStats.firstPoint.flowCubicMetersPerSecond}m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Last point: {csvStats.lastPoint.year}-{csvStats.lastPoint.month}-{csvStats.lastPoint.day} {csvStats.lastPoint.hour}:00, Q={csvStats.lastPoint.flowCubicMetersPerSecond}m³/s</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First 5 flows: [{csvStats.flows.map(f => f.toFixed(2)).join(', ')}]</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• First 5 times: [{csvStats.times.map(t => t.toFixed(2)).join(', ')}]</p>
        </div>
      )}
      
      {modeledStats && csvStats && (
        <div style={{ backgroundColor: 'var(--card-hover-background, #e8f4f8)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color, #e5e7eb)' }}>
          <h4 style={{ color: 'var(--text-color, #374151)', margin: '0 0 10px 0' }}>🔄 Comparison Analysis:</h4>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Time scale difference: {(csvStats.time.duration / modeledStats.time.duration).toFixed(1)}x</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Flow scale difference: {(csvStats.flow.max / modeledStats.flow.max).toFixed(6)}x</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• CSV duration: {(csvStats.time.duration/24).toFixed(1)} days vs Model duration: {(modeledStats.time.duration/24).toFixed(1)} days</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Peak flow ratio (CSV/Model): {(csvStats.flow.max / modeledStats.flow.max).toFixed(6)}</p>
          <p style={{ color: 'var(--text-color, #374151)', margin: '4px 0' }}>• Mean flow ratio (CSV/Model): {(csvStats.flow.avg / modeledStats.flow.avg).toFixed(6)}</p>
          
          {csvStats.time.duration > modeledStats.time.duration * 5 && (
            <p style={{ color: 'var(--error-color, #dc2626)', fontWeight: 'bold', margin: '4px 0' }}>
              ⚠️ WARNING: CSV data spans {(csvStats.time.duration/modeledStats.time.duration).toFixed(1)}x longer than model!
              The model peak may appear as a tiny spike in the overall timeline.
            </p>
          )}
          {csvStats.flow.max < modeledStats.flow.max * 0.1 && (
            <p style={{ color: 'var(--warning-color, #f59e0b)', fontWeight: 'bold', margin: '4px 0' }}>
              ⚠️ WARNING: CSV peak flows are much smaller than model predictions.
              Check if units are consistent (both should be m³/s).
            </p>
          )}
          {modeledStats.flow.max > 1000000 && (
            <p style={{ color: 'var(--error-color, #dc2626)', fontWeight: 'bold', margin: '4px 0' }}>
              🚨 CRITICAL: Model flows exceed 1 million m³/s - this is unrealistic!
              Check model parameters and backend calculations.
            </p>
          )}
          {modeledStats.flow.max > csvStats.flow.max * 1000 && (
            <p style={{ color: 'var(--error-color, #dc2626)', fontWeight: 'bold', margin: '4px 0' }}>
              🚨 CRITICAL: Model flows are 1000x+ larger than observations!
              Likely unit conversion error or parameter scaling issue.
            </p>
          )}
        </div>
      )}
      
      {modeledStats && !csvStats && modeledStats.flow.max > 1000000 && (
        <div style={{ backgroundColor: 'var(--error-background, #fef2f2)', padding: '10px', borderRadius: '4px', border: '1px solid var(--error-color, #dc2626)' }}>
          <p style={{ color: 'var(--error-color, #dc2626)', fontWeight: 'bold', margin: '4px 0' }}>
            🚨 CRITICAL: Model flows exceed 1 million m³/s - this is unrealistic!
            Check model parameters and backend calculations.
          </p>
        </div>
      )}
    </div>
  );
}
