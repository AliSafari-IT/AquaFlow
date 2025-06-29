import React, { useState, useRef } from 'react';
import './CsvHydrographLoader.css';

interface CsvDataPoint {
  year: number;
  month: number;
  day: number;
  hour: number;
  flowCubicMetersPerSecond: number;
  timeHours: number; // For chart compatibility
}

interface CsvHydrographLoaderProps {
  onDataLoaded: (data: CsvDataPoint[]) => void;
  isLoading?: boolean;
}

export default function CsvHydrographLoader({ onDataLoaded, isLoading = false }: CsvHydrographLoaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CsvDataPoint[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseDateTime = (year: number, month: number, day: number, hour: number): Date => {
    return new Date(year, month - 1, day, hour); // month is 0-indexed in JS Date
  };

  const parseCsvFile = (file: File) => {
    setParseError(null);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least a header and one data row');
        }

        // Skip header line and parse data
        const dataPoints: CsvDataPoint[] = [];
        const startTime = new Date();
        let firstDateTime: Date | null = null;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const columns = line.split(',').map(col => col.trim());
          
          if (columns.length < 5) {
            throw new Error(`Line ${i + 1}: Expected 5 columns (YYYY,MM,DD,HH,Q), found ${columns.length}`);
          }

          const year = parseInt(columns[0]);
          const month = parseInt(columns[1]);
          const day = parseInt(columns[2]);
          const hour = parseInt(columns[3]);
          const flow = parseFloat(columns[4]);

          // Validate data
          if (isNaN(year) || year < 1900 || year > 2100) {
            throw new Error(`Line ${i + 1}: Invalid year ${columns[0]}`);
          }
          if (isNaN(month) || month < 1 || month > 12) {
            throw new Error(`Line ${i + 1}: Invalid month ${columns[1]}`);
          }
          if (isNaN(day) || day < 1 || day > 31) {
            throw new Error(`Line ${i + 1}: Invalid day ${columns[2]}`);
          }
          if (isNaN(hour) || hour < 0 || hour > 23) {
            throw new Error(`Line ${i + 1}: Invalid hour ${columns[3]}`);
          }
          if (isNaN(flow) || flow < 0) {
            throw new Error(`Line ${i + 1}: Invalid flow rate ${columns[4]}`);
          }

          const dateTime = parseDateTime(year, month, day, hour);
          if (!firstDateTime) {
            firstDateTime = dateTime;
          }

          // Calculate hours from start
          const timeHours = (dateTime.getTime() - firstDateTime.getTime()) / (1000 * 60 * 60);

          dataPoints.push({
            year,
            month,
            day,
            hour,
            flowCubicMetersPerSecond: flow,
            timeHours
          });
        }

        if (dataPoints.length === 0) {
          throw new Error('No valid data points found in CSV file');
        }

        // Sort by time to ensure proper order
        dataPoints.sort((a, b) => a.timeHours - b.timeHours);

        setPreviewData(dataPoints.slice(0, 10)); // Show first 10 rows as preview
        onDataLoaded(dataPoints);
        
      } catch (error) {
        setParseError(error instanceof Error ? error.message : 'Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        parseCsvFile(file);
      } else {
        setParseError('Please upload a CSV file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      parseCsvFile(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearData = () => {
    setPreviewData([]);
    setParseError(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="csv-hydrograph-loader">
      <div className="loader-header">
        <h2 className="loader-title">Load Hydrograph from CSV</h2>
        <p className="loader-subtitle">
          Upload a CSV file with time series flow data (YYYY,MM,DD,HH,Q)
        </p>
      </div>

      {/* File Upload Area */}
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${fileName ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="file-input"
        />
        
        <div className="upload-content">
          <div className="upload-icon">📊</div>
          {fileName ? (
            <div className="file-info">
              <div className="file-name">{fileName}</div>
              <div className="file-status">
                {parseError ? '❌ Error in file' : '✅ File loaded successfully'}
              </div>
            </div>
          ) : (
            <div className="upload-text">
              <div className="upload-primary">Drop CSV file here or click to browse</div>
              <div className="upload-secondary">Supports CSV files with format: YYYY,MM,DD,HH,Q(m³/s)</div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {parseError && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{parseError}</div>
        </div>
      )}

      {/* CSV Format Instructions */}
      <div className="format-instructions">
        <h3 className="instructions-title">CSV Format Requirements</h3>
        <div className="instructions-content">
          <div className="format-example">
            <div className="example-header">Example CSV format:</div>
            <pre className="example-code">
{`YYYY,MM,DD,HH,Q
2023,01,15,00,12.5
2023,01,15,01,11.8
2023,01,15,02,10.2
2023,01,15,03,15.7`}
            </pre>
          </div>
          
          <div className="format-rules">
            <h4>Column Definitions:</h4>
            <ul>
              <li><strong>YYYY:</strong> Year (1900-2100)</li>
              <li><strong>MM:</strong> Month (01-12)</li>
              <li><strong>DD:</strong> Day (01-31)</li>
              <li><strong>HH:</strong> Hour (00-23)</li>
              <li><strong>Q:</strong> Flow rate in m³/s (≥ 0)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      {previewData.length > 0 && (
        <div className="data-preview">
          <div className="preview-header">
            <h3 className="preview-title">Data Preview (First 10 rows)</h3>
            <button className="clear-button" onClick={clearData}>
              Clear Data
            </button>
          </div>
          
          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Flow (m³/s)</th>
                  <th>Hours from Start</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((point, index) => (
                  <tr key={index}>
                    <td>{`${point.year}-${String(point.month).padStart(2, '0')}-${String(point.day).padStart(2, '0')}`}</td>
                    <td>{`${String(point.hour).padStart(2, '0')}:00`}</td>
                    <td>{point.flowCubicMetersPerSecond.toFixed(2)}</td>
                    <td>{point.timeHours.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="data-summary">
            Total data points loaded: <strong>{previewData.length}</strong>
            {previewData.length === 10 && <span> (showing first 10)</span>}
          </div>
        </div>
      )}
    </div>
  );
}
