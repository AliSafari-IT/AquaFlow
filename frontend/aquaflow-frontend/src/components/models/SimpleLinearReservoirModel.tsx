import React from 'react';
import { Link } from 'react-router-dom';
import './ModelDetailPage.css';

export default function SimpleLinearReservoirModel() {
  return (
    <div className="model-detail-container">
      <div className="model-header">
        <Link to="/help#documentation" className="back-link">← Back to Documentation</Link>
        <h1 className="model-title">Simple Linear Reservoir Model</h1>
        <div className="model-badge simple">Simple Model</div>
      </div>

      <div className="model-content">
        {/* Overview Section */}
        <section className="model-section">
          <h2>📋 Overview</h2>
          <p className="model-description">
            The Simple Linear Reservoir Model is a conceptual hydrological model that represents a watershed 
            as a single linear reservoir. It's widely used for educational purposes and quick rainfall-runoff 
            estimates due to its simplicity and minimal parameter requirements.
          </p>
          
          <div className="key-features">
            <h3>Key Features:</h3>
            <ul>
              <li>Single linear reservoir representation</li>
              <li>Constant runoff coefficient</li>
              <li>Linear storage-discharge relationship</li>
              <li>Minimal parameter requirements</li>
              <li>Fast computation</li>
            </ul>
          </div>
        </section>

        {/* Mathematical Formulation */}
        <section className="model-section">
          <h2>🧮 Mathematical Formulation</h2>
          
          <div className="formula-block">
            <h3>Storage Equation:</h3>
            <div className="formula">
              <code>dS/dt = I(t) - Q(t)</code>
            </div>
            <p className="formula-description">
              Where S is storage, I(t) is inflow, and Q(t) is outflow at time t.
            </p>
          </div>

          <div className="formula-block">
            <h3>Linear Storage-Discharge Relationship:</h3>
            <div className="formula">
              <code>Q(t) = S(t) / K</code>
            </div>
            <p className="formula-description">
              Where K is the linear reservoir constant (hours).
            </p>
          </div>

          <div className="formula-block">
            <h3>Effective Rainfall:</h3>
            <div className="formula">
              <code>I(t) = C × P(t) × A / 3.6</code>
            </div>
            <p className="formula-description">
              Where C is runoff coefficient, P(t) is precipitation intensity (mm/h), 
              A is catchment area (km²), and 3.6 is unit conversion factor.
            </p>
          </div>

          <div className="formula-block">
            <h3>Analytical Solution:</h3>
            <div className="formula">
              <code>Q(t) = (I₀ × K) × (1 - e^(-t/K)) + Q₀ × e^(-t/K)</code>
            </div>
            <p className="formula-description">
              For constant rainfall intensity I₀ and initial discharge Q₀.
            </p>
          </div>
        </section>

        {/* Parameters */}
        <section className="model-section">
          <h2>⚙️ Parameters</h2>
          
          <div className="parameter-table">
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Symbol</th>
                  <th>Units</th>
                  <th>Typical Range</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rainfall Intensity</td>
                  <td>P</td>
                  <td>mm/h</td>
                  <td>1-100</td>
                  <td>Constant precipitation rate</td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>D</td>
                  <td>hours</td>
                  <td>1-48</td>
                  <td>Rainfall event duration</td>
                </tr>
                <tr>
                  <td>Catchment Area</td>
                  <td>A</td>
                  <td>km²</td>
                  <td>0.1-10000</td>
                  <td>Watershed drainage area</td>
                </tr>
                <tr>
                  <td>Runoff Coefficient</td>
                  <td>C</td>
                  <td>-</td>
                  <td>0.1-0.9</td>
                  <td>Fraction of rainfall becoming runoff</td>
                </tr>
                <tr>
                  <td>Reservoir Constant</td>
                  <td>K</td>
                  <td>hours</td>
                  <td>1-24</td>
                  <td>Linear reservoir time constant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Applications */}
        <section className="model-section">
          <h2>🎯 Applications</h2>
          
          <div className="applications-grid">
            <div className="application-card">
              <h3>🎓 Educational</h3>
              <p>Teaching basic rainfall-runoff concepts and hydrograph analysis</p>
            </div>
            
            <div className="application-card">
              <h3>📊 Preliminary Design</h3>
              <p>Quick estimates for small urban catchments and storm drainage</p>
            </div>
            
            <div className="application-card">
              <h3>🔍 Conceptual Studies</h3>
              <p>Understanding watershed response characteristics</p>
            </div>
            
            <div className="application-card">
              <h3>⚡ Real-time Applications</h3>
              <p>Fast flood forecasting for simple catchments</p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="model-section">
          <h2>⚠️ Limitations</h2>
          
          <div className="limitations-list">
            <ul>
              <li><strong>Oversimplified:</strong> Single reservoir cannot capture complex watershed processes</li>
              <li><strong>Constant Parameters:</strong> Runoff coefficient and K assumed constant</li>
              <li><strong>No Spatial Variability:</strong> Uniform rainfall and catchment properties</li>
              <li><strong>Linear Response:</strong> May not represent nonlinear watershed behavior</li>
              <li><strong>No Base Flow:</strong> Doesn't account for groundwater contribution</li>
              <li><strong>Limited Accuracy:</strong> Best for small, homogeneous catchments</li>
            </ul>
          </div>
        </section>

        {/* References */}
        <section className="model-section">
          <h2>📚 References</h2>
          
          <div className="references-list">
            <ol>
              <li>
                <strong>Chow, V.T., Maidment, D.R., and Mays, L.W. (1988).</strong> 
                <em>Applied Hydrology.</em> McGraw-Hill, New York.
              </li>
              <li>
                <strong>Dingman, S.L. (2015).</strong> 
                <em>Physical Hydrology, 3rd Edition.</em> Waveland Press.
              </li>
              <li>
                <strong>Brutsaert, W. (2005).</strong> 
                <em>Hydrology: An Introduction.</em> Cambridge University Press.
              </li>
              <li>
                <strong>Singh, V.P. (1988).</strong> 
                <em>Hydrologic Systems: Rainfall-Runoff Modeling, Volume 1.</em> Prentice Hall.
              </li>
              <li>
                <strong>Dooge, J.C.I. (1973).</strong> 
                "Linear Theory of Hydrologic Systems." <em>Technical Bulletin No. 1468</em>, 
                Agricultural Research Service, USDA.
              </li>
            </ol>
          </div>
        </section>

        {/* Example Calculation */}
        <section className="model-section">
          <h2>💡 Example Calculation</h2>
          
          <div className="example-block">
            <h3>Given Parameters:</h3>
            <ul>
              <li>Rainfall intensity: 20 mm/h</li>
              <li>Duration: 6 hours</li>
              <li>Catchment area: 5 km²</li>
              <li>Runoff coefficient: 0.6</li>
              <li>Reservoir constant: 3 hours</li>
            </ul>
            
            <h3>Calculation Steps:</h3>
            <div className="calculation-steps">
              <div className="step">
                <strong>Step 1:</strong> Calculate effective rainfall rate
                <div className="formula">I = C × P × A / 3.6 = 0.6 × 20 × 5 / 3.6 = 16.67 m³/s</div>
              </div>
              
              <div className="step">
                <strong>Step 2:</strong> Calculate peak discharge (at end of rainfall)
                <div className="formula">Q_peak = I × (1 - e^(-D/K)) = 16.67 × (1 - e^(-6/3)) = 14.52 m³/s</div>
              </div>
              
              <div className="step">
                <strong>Step 3:</strong> Calculate recession after rainfall ends
                <div className="formula">Q(t) = Q_peak × e^(-(t-D)/K)</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
