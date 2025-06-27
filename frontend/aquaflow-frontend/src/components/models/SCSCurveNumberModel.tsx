import React from 'react';
import { Link } from 'react-router-dom';
import './ModelDetailPage.css';

export default function SCSCurveNumberModel() {
  return (
    <div className="model-detail-container">
      <div className="model-header">
        <Link to="/help#documentation" className="back-link">← Back to Documentation</Link>
        <h1 className="model-title">SCS Curve Number Method</h1>
        <div className="model-badge advanced">Advanced Model</div>
      </div>

      <div className="model-content">
        {/* Overview Section */}
        <section className="model-section">
          <h2>📋 Overview</h2>
          <p className="model-description">
            The SCS Curve Number Method, developed by the USDA Natural Resources Conservation Service 
            (formerly Soil Conservation Service), is one of the most widely used methods for estimating 
            direct runoff from rainfall events. It provides a standardized approach for calculating 
            runoff based on soil type, land use, and antecedent moisture conditions.
          </p>
          
          <div className="key-features">
            <h3>Key Features:</h3>
            <ul>
              <li>Standardized approach used worldwide</li>
              <li>Accounts for soil type and land use</li>
              <li>Considers antecedent moisture conditions</li>
              <li>Extensive tabulated curve numbers available</li>
              <li>Suitable for ungauged watersheds</li>
              <li>Widely accepted by regulatory agencies</li>
            </ul>
          </div>
        </section>

        {/* Mathematical Formulation */}
        <section className="model-section">
          <h2>🧮 Mathematical Formulation</h2>
          
          <div className="formula-block">
            <h3>Direct Runoff Equation:</h3>
            <div className="formula">
              <code>Q = (P - Ia)² / (P - Ia + S)</code>
            </div>
            <p className="formula-description">
              Where Q is direct runoff (mm), P is rainfall (mm), Ia is initial abstraction (mm), 
              and S is potential maximum retention (mm).
            </p>
          </div>

          <div className="formula-block">
            <h3>Initial Abstraction:</h3>
            <div className="formula">
              <code>Ia = 0.2 × S</code>
            </div>
            <p className="formula-description">
              Standard assumption that initial abstraction equals 20% of potential maximum retention.
            </p>
          </div>

          <div className="formula-block">
            <h3>Potential Maximum Retention:</h3>
            <div className="formula">
              <code>S = (25400 / CN) - 254</code>
            </div>
            <p className="formula-description">
              Where CN is the curve number (dimensionless, 30-100).
            </p>
          </div>

          <div className="formula-block">
            <h3>Simplified Runoff Equation:</h3>
            <div className="formula">
              <code>Q = (P - 0.2S)² / (P + 0.8S)</code>
            </div>
            <p className="formula-description">
              Substituting Ia = 0.2S into the main equation. Valid only when P ≥ Ia.
            </p>
          </div>
        </section>

        {/* Curve Number Determination */}
        <section className="model-section">
          <h2>📊 Curve Number Determination</h2>
          
          <div className="parameter-table">
            <h3>Hydrologic Soil Groups:</h3>
            <table>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Description</th>
                  <th>Infiltration Rate</th>
                  <th>Soil Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A</strong></td>
                  <td>Low runoff potential</td>
                  <td>High (&gt;7.6 mm/h)</td>
                  <td>Deep sands, deep loess</td>
                </tr>
                <tr>
                  <td><strong>B</strong></td>
                  <td>Moderately low runoff</td>
                  <td>Moderate (3.8-7.6 mm/h)</td>
                  <td>Shallow loess, sandy loam</td>
                </tr>
                <tr>
                  <td><strong>C</strong></td>
                  <td>Moderately high runoff</td>
                  <td>Low (1.3-3.8 mm/h)</td>
                  <td>Clay loams, shallow sandy loam</td>
                </tr>
                <tr>
                  <td><strong>D</strong></td>
                  <td>High runoff potential</td>
                  <td>Very low (&lt;1.3 mm/h)</td>
                  <td>Clay soils, shallow soils over rock</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="parameter-table">
            <h3>Sample Curve Numbers by Land Use:</h3>
            <table>
              <thead>
                <tr>
                  <th>Land Use</th>
                  <th>Group A</th>
                  <th>Group B</th>
                  <th>Group C</th>
                  <th>Group D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Residential (1/4 acre lots)</td>
                  <td>54</td>
                  <td>70</td>
                  <td>80</td>
                  <td>85</td>
                </tr>
                <tr>
                  <td>Commercial/Business</td>
                  <td>89</td>
                  <td>92</td>
                  <td>94</td>
                  <td>95</td>
                </tr>
                <tr>
                  <td>Industrial</td>
                  <td>81</td>
                  <td>88</td>
                  <td>91</td>
                  <td>93</td>
                </tr>
                <tr>
                  <td>Pasture (good condition)</td>
                  <td>39</td>
                  <td>61</td>
                  <td>74</td>
                  <td>80</td>
                </tr>
                <tr>
                  <td>Woods (good condition)</td>
                  <td>30</td>
                  <td>55</td>
                  <td>70</td>
                  <td>77</td>
                </tr>
                <tr>
                  <td>Paved areas</td>
                  <td>98</td>
                  <td>98</td>
                  <td>98</td>
                  <td>98</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Antecedent Moisture Conditions */}
        <section className="model-section">
          <h2>💧 Antecedent Moisture Conditions</h2>
          
          <div className="parameter-table">
            <table>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Description</th>
                  <th>5-day Antecedent Rainfall</th>
                  <th>CN Adjustment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>AMC I</strong></td>
                  <td>Dry conditions</td>
                  <td>&lt; 13 mm (dormant) / &lt; 36 mm (growing)</td>
                  <td>CN(I) = CN(II) / (2.3 - 0.013×CN(II))</td>
                </tr>
                <tr>
                  <td><strong>AMC II</strong></td>
                  <td>Average conditions</td>
                  <td>13-53 mm (dormant) / 36-53 mm (growing)</td>
                  <td>Use tabulated CN values</td>
                </tr>
                <tr>
                  <td><strong>AMC III</strong></td>
                  <td>Wet conditions</td>
                  <td>&gt; 53 mm</td>
                  <td>CN(III) = CN(II) / (0.43 + 0.0057×CN(II))</td>
                </tr>
              </tbody>
            </table>
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
                  <th>Range</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Curve Number</td>
                  <td>CN</td>
                  <td>-</td>
                  <td>30-100</td>
                  <td>Runoff potential index</td>
                </tr>
                <tr>
                  <td>Rainfall</td>
                  <td>P</td>
                  <td>mm</td>
                  <td>0-500</td>
                  <td>Total storm rainfall</td>
                </tr>
                <tr>
                  <td>Antecedent Moisture</td>
                  <td>AMC</td>
                  <td>-</td>
                  <td>I, II, III</td>
                  <td>Soil moisture condition</td>
                </tr>
                <tr>
                  <td>Catchment Area</td>
                  <td>A</td>
                  <td>km²</td>
                  <td>0.1-10000</td>
                  <td>Watershed drainage area</td>
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
              <h3>🏗️ Engineering Design</h3>
              <p>Storm water management, culvert sizing, detention pond design</p>
            </div>
            
            <div className="application-card">
              <h3>🌊 Flood Studies</h3>
              <p>Peak discharge estimation, flood mapping, risk assessment</p>
            </div>
            
            <div className="application-card">
              <h3>🏞️ Land Use Planning</h3>
              <p>Impact assessment of development on runoff patterns</p>
            </div>
            
            <div className="application-card">
              <h3>📋 Regulatory Compliance</h3>
              <p>FEMA studies, municipal drainage design standards</p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="model-section">
          <h2>⚠️ Limitations</h2>
          
          <div className="limitations-list">
            <ul>
              <li><strong>Single Storm Events:</strong> Designed for individual rainfall events, not continuous simulation</li>
              <li><strong>Uniform Rainfall:</strong> Assumes spatially uniform precipitation</li>
              <li><strong>Empirical Method:</strong> Based on statistical analysis, may not capture all physical processes</li>
              <li><strong>Small Watersheds:</strong> Most accurate for catchments &lt; 25 km²</li>
              <li><strong>CN Selection:</strong> Subjective determination of appropriate curve numbers</li>
              <li><strong>Initial Abstraction:</strong> 0.2S assumption may not be universally applicable</li>
              <li><strong>No Routing:</strong> Doesn't account for channel routing or timing</li>
            </ul>
          </div>
        </section>

        {/* References */}
        <section className="model-section">
          <h2>📚 References</h2>
          
          <div className="references-list">
            <ol>
              <li>
                <strong>USDA-NRCS (2004).</strong> 
                <em>National Engineering Handbook, Part 630 Hydrology.</em> 
                Natural Resources Conservation Service, Washington, DC.
              </li>
              <li>
                <strong>Ponce, V.M. and Hawkins, R.H. (1996).</strong> 
                "Runoff Curve Number: Has It Reached Maturity?" 
                <em>Journal of Hydrologic Engineering</em>, 1(1), 11-19.
              </li>
              <li>
                <strong>Hawkins, R.H., Ward, T.J., Woodward, D.E., and Van Mullem, J.A. (2009).</strong> 
                <em>Curve Number Hydrology: State of the Practice.</em> 
                ASCE Press, Reston, VA.
              </li>
              <li>
                <strong>Mockus, V. (1972).</strong> 
                "Estimation of Direct Runoff from Storm Rainfall." 
                <em>National Engineering Handbook, Section 4</em>, SCS, USDA.
              </li>
              <li>
                <strong>Woodward, D.E., Hawkins, R.H., Jiang, R., et al. (2003).</strong> 
                "Runoff Curve Number Method: Examination of the Initial Abstraction Ratio." 
                <em>World Water & Environmental Resources Congress</em>, ASCE.
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
              <li>Watershed: 2 km² residential area (1/4 acre lots)</li>
              <li>Soil: Group B (sandy loam)</li>
              <li>Rainfall: 75 mm storm event</li>
              <li>Antecedent conditions: AMC II (average)</li>
            </ul>
            
            <h3>Calculation Steps:</h3>
            <div className="calculation-steps">
              <div className="step">
                <strong>Step 1:</strong> Determine Curve Number
                <div className="formula">CN = 70 (from table for residential/Group B)</div>
              </div>
              
              <div className="step">
                <strong>Step 2:</strong> Calculate potential maximum retention
                <div className="formula">S = (25400 / 70) - 254 = 108.6 mm</div>
              </div>
              
              <div className="step">
                <strong>Step 3:</strong> Calculate initial abstraction
                <div className="formula">Ia = 0.2 × 108.6 = 21.7 mm</div>
              </div>
              
              <div className="step">
                <strong>Step 4:</strong> Check if P &gt; Ia
                <div className="formula">75 mm &gt; 21.7 mm ✓ (runoff will occur)</div>
              </div>
              
              <div className="step">
                <strong>Step 5:</strong> Calculate direct runoff
                <div className="formula">Q = (75 - 21.7)² / (75 + 0.8 × 108.6) = 18.4 mm</div>
              </div>
              
              <div className="step">
                <strong>Step 6:</strong> Convert to volume
                <div className="formula">Volume = 18.4 mm × 2 km² = 36,800 m³</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
