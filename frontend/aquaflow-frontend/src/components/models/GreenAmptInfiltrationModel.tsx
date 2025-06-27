import React from 'react';
import { Link } from 'react-router-dom';
import './ModelDetailPage.css';

export default function GreenAmptInfiltrationModel() {
  return (
    <div className="model-detail-container">
      <div className="model-header">
        <Link to="/help#documentation" className="back-link">← Back to Documentation</Link>
        <h1 className="model-title">Green-Ampt Infiltration Model</h1>
        <div className="model-badge infiltration">Infiltration Model</div>
      </div>

      <div className="model-content">
        {/* Overview Section */}
        <section className="model-section">
          <h2>📋 Overview</h2>
          <p className="model-description">
            The Green-Ampt infiltration model is a physically-based approach for calculating 
            infiltration rates into soil during rainfall events. Developed by Green and Ampt in 1911, 
            it provides a theoretical framework based on Darcy's law and assumes a sharp wetting front 
            advancing into initially dry soil.
          </p>
          
          <div className="key-features">
            <h3>Key Features:</h3>
            <ul>
              <li>Physics-based infiltration modeling</li>
              <li>Sharp wetting front assumption</li>
              <li>Accounts for soil hydraulic properties</li>
              <li>Suitable for event-based modeling</li>
              <li>Widely used in hydrological models</li>
              <li>Applicable to various soil types</li>
            </ul>
          </div>
        </section>

        {/* Mathematical Formulation */}
        <section className="model-section">
          <h2>🧮 Mathematical Formulation</h2>
          
          <div className="formula-block">
            <h3>Green-Ampt Infiltration Equation:</h3>
            <div className="formula">
              <code>f(t) = Ks &times; [1 + (ψ &times; Δθ) / F(t)]</code>
            </div>
            <p className="formula-description">
              Where f(t) is infiltration rate (mm/h), Ks is saturated hydraulic conductivity (mm/h), 
              ψ is suction head at wetting front (mm), Δθ is moisture deficit, and F(t) is cumulative infiltration (mm).
            </p>
          </div>

          <div className="formula-block">
            <h3>Cumulative Infiltration:</h3>
            <div className="formula">
              <code>F(t) - ψ &times; Δθ &times; ln(1 + F(t)/(ψ &times; Δθ)) = Ks &times; t</code>
            </div>
            <p className="formula-description">
              Implicit equation for cumulative infiltration F(t) as a function of time t.
            </p>
          </div>

          <div className="formula-block">
            <h3>Moisture Deficit:</h3>
            <div className="formula">
              <code>Δθ = θs &minus; θi</code>
            </div>
            <p className="formula-description">
              Where θs is saturated moisture content and θi is initial moisture content.
            </p>
          </div>

          <div className="formula-block">
            <h3>Time to Ponding:</h3>
            <div className="formula">
              <code>tp = (ψ &times; Δθ) / (i &times; (i - Ks))</code>
            </div>
            <p className="formula-description">
              Where tp is time to ponding (h) and i is rainfall intensity (mm/h). Valid when i &gt; Ks.
            </p>
          </div>

          <div className="formula-block">
            <h3>Infiltration Capacity (after ponding):</h3>
            <div className="formula">
              <code>fp = Ks &times; [1 + (ψ &times; Δθ) / Fp]</code>
            </div>
            <p className="formula-description">
              Where fp is infiltration capacity at ponding and Fp is cumulative infiltration at ponding.
            </p>
          </div>
        </section>

        {/* Soil Parameters */}
        <section className="model-section">
          <h2>🌱 Soil Parameters</h2>
          
          <div className="parameter-table">
            <h3>Typical Green-Ampt Parameters by Soil Type:</h3>
            <table>
              <thead>
                <tr>
                  <th>Soil Type</th>
                  <th>Ks (mm/h)</th>
                  <th>ψ (mm)</th>
                  <th>θs</th>
                  <th>θr</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sand</td>
                  <td>117.8</td>
                  <td>49.5</td>
                  <td>0.437</td>
                  <td>0.020</td>
                </tr>
                <tr>
                  <td>Loamy Sand</td>
                  <td>29.9</td>
                  <td>61.3</td>
                  <td>0.437</td>
                  <td>0.035</td>
                </tr>
                <tr>
                  <td>Sandy Loam</td>
                  <td>10.9</td>
                  <td>110.1</td>
                  <td>0.453</td>
                  <td>0.041</td>
                </tr>
                <tr>
                  <td>Loam</td>
                  <td>3.4</td>
                  <td>88.9</td>
                  <td>0.463</td>
                  <td>0.027</td>
                </tr>
                <tr>
                  <td>Silt Loam</td>
                  <td>6.5</td>
                  <td>166.8</td>
                  <td>0.501</td>
                  <td>0.015</td>
                </tr>
                <tr>
                  <td>Sandy Clay Loam</td>
                  <td>1.5</td>
                  <td>218.5</td>
                  <td>0.398</td>
                  <td>0.068</td>
                </tr>
                <tr>
                  <td>Clay Loam</td>
                  <td>1.0</td>
                  <td>208.8</td>
                  <td>0.464</td>
                  <td>0.075</td>
                </tr>
                <tr>
                  <td>Silty Clay Loam</td>
                  <td>1.0</td>
                  <td>273.0</td>
                  <td>0.471</td>
                  <td>0.040</td>
                </tr>
                <tr>
                  <td>Sandy Clay</td>
                  <td>0.6</td>
                  <td>239.0</td>
                  <td>0.430</td>
                  <td>0.109</td>
                </tr>
                <tr>
                  <td>Silty Clay</td>
                  <td>0.5</td>
                  <td>292.2</td>
                  <td>0.479</td>
                  <td>0.056</td>
                </tr>
                <tr>
                  <td>Clay</td>
                  <td>0.3</td>
                  <td>316.3</td>
                  <td>0.475</td>
                  <td>0.090</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="parameter-table">
            <h3>Parameter Definitions:</h3>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Symbol</th>
                  <th>Units</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Saturated Hydraulic Conductivity</td>
                  <td>Ks</td>
                  <td>mm/h</td>
                  <td>Maximum infiltration rate when soil is saturated</td>
                </tr>
                <tr>
                  <td>Suction Head</td>
                  <td>ψ</td>
                  <td>mm</td>
                  <td>Capillary suction at wetting front</td>
                </tr>
                <tr>
                  <td>Saturated Moisture Content</td>
                  <td>θs</td>
                  <td>-</td>
                  <td>Volumetric water content at saturation</td>
                </tr>
                <tr>
                  <td>Residual Moisture Content</td>
                  <td>θr</td>
                  <td>-</td>
                  <td>Minimum volumetric water content</td>
                </tr>
                <tr>
                  <td>Initial Moisture Content</td>
                  <td>θi</td>
                  <td>-</td>
                  <td>Volumetric water content before rainfall</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Model Phases */}
        <section className="model-section">
          <h2>⏱️ Infiltration Phases</h2>
          
          <div className="applications-grid">
            <div className="application-card">
              <h3>🌧️ Phase 1: Pre-Ponding</h3>
              <p>All rainfall infiltrates (i ≤ fp). Infiltration rate equals rainfall intensity.</p>
            </div>
            
            <div className="application-card">
              <h3>💧 Phase 2: Ponding Begins</h3>
              <p>Surface ponding starts when rainfall intensity exceeds infiltration capacity.</p>
            </div>
            
            <div className="application-card">
              <h3>📉 Phase 3: Post-Ponding</h3>
              <p>Infiltration rate decreases with time as wetting front advances deeper.</p>
            </div>
            
            <div className="application-card">
              <h3>🔄 Phase 4: Redistribution</h3>
              <p>After rainfall ends, soil moisture redistributes according to gravity and capillarity.</p>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="model-section">
          <h2>🎯 Applications</h2>
          
          <div className="applications-grid">
            <div className="application-card">
              <h3>🌊 Runoff Modeling</h3>
              <p>Calculating excess rainfall for hydrograph generation</p>
            </div>
            
            <div className="application-card">
              <h3>💧 Irrigation Design</h3>
              <p>Optimizing irrigation schedules and application rates</p>
            </div>
            
            <div className="application-card">
              <h3>🏗️ Stormwater Management</h3>
              <p>Designing infiltration-based BMPs and green infrastructure</p>
            </div>
            
            <div className="application-card">
              <h3>🌱 Agricultural Planning</h3>
              <p>Soil water management and crop water availability</p>
            </div>
          </div>
        </section>

        {/* Advantages and Limitations */}
        <section className="model-section">
          <h2>⚖️ Advantages and Limitations</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div>
              <h3 style={{color: 'var(--success-color)'}}>✅ Advantages:</h3>
              <ul>
                <li>Physically-based approach</li>
                <li>Relatively simple to implement</li>
                <li>Well-established parameter values</li>
                <li>Accounts for soil properties</li>
                <li>Suitable for event modeling</li>
                <li>Widely validated</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{color: 'var(--warning-color)'}}>⚠️ Limitations:</h3>
              <ul>
                <li>Sharp wetting front assumption</li>
                <li>Uniform initial moisture</li>
                <li>Homogeneous soil profile</li>
                <li>No macropore flow</li>
                <li>Requires soil parameter estimation</li>
                <li>May overestimate infiltration in layered soils</li>
              </ul>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="model-section">
          <h2>📚 References</h2>
          
          <div className="references-list">
            <ol>
              <li>
                <strong>Green, W.H. and Ampt, G.A. (1911).</strong> 
                "Studies on Soil Physics, Part I: The Flow of Air and Water Through Soils." 
                <em>Journal of Agricultural Science</em>, 4, 1-24.
              </li>
              <li>
                <strong>Rawls, W.J., Brakensiek, D.L., and Miller, N. (1983).</strong> 
                "Green-Ampt Infiltration Parameters from Soils Data." 
                <em>Journal of Hydraulic Engineering</em>, 109(1), 62-70.
              </li>
              <li>
                <strong>Mein, R.G. and Larson, C.L. (1973).</strong> 
                "Modeling Infiltration During a Steady Rain." 
                <em>Water Resources Research</em>, 9(2), 384-394.
              </li>
              <li>
                <strong>Chow, V.T., Maidment, D.R., and Mays, L.W. (1988).</strong> 
                <em>Applied Hydrology.</em> McGraw-Hill, New York.
              </li>
              <li>
                <strong>Bouwer, H. (1986).</strong> 
                "Intake Rate: Cylinder Infiltrometer." 
                <em>Methods of Soil Analysis, Part 1</em>, ASA-SSSA, Madison, WI.
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
              <li>Soil type: Sandy loam</li>
              <li>Ks = 10.9 mm/h</li>
              <li>ψ = 110.1 mm</li>
              <li>θs = 0.453, θi = 0.15</li>
              <li>Rainfall intensity: 25 mm/h</li>
            </ul>
            
            <h3>Calculation Steps:</h3>
            <div className="calculation-steps">
              <div className="step">
                <strong>Step 1:</strong> Calculate moisture deficit
                <div className="formula">Δθ = θs - θi = 0.453 - 0.15 = 0.303</div>
              </div>
              
              <div className="step">
                <strong>Step 2:</strong> Check if ponding will occur
                <div className="formula">i = 25 mm/h &gt; Ks = 10.9 mm/h ✓ (ponding will occur)</div>
              </div>
              
              <div className="step">
                <strong>Step 3:</strong> Calculate time to ponding
                <div className="formula">tp = (ψ &times; Δθ) / (i &times; (i - Ks)) = (110.1 &times; 0.303) / (25 &times; (25 - 10.9)) = 0.95 h</div>
              </div>
              
              <div className="step">
                <strong>Step 4:</strong> Calculate cumulative infiltration at ponding
                <div className="formula">Fp = i &times; tp = 25 &times; 0.95 = 23.75 mm</div>
              </div>
              
              <div className="step">
                <strong>Step 5:</strong> Calculate infiltration rate after ponding (t = 2h)
                <div className="formula">For F = 35 mm: f = 10.9 &times; [1 + (110.1 &times; 0.303) / 35] = 20.4 mm/h</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
