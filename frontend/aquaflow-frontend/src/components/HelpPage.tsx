import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import './HelpPage.css';

const HelpPage: React.FC = () => {
  const location = useLocation();

  // Smooth scroll to anchor on mount/update
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  return (
    <div className="help-page">
      <div className="help-container">
        <header className="help-header">
          <h1>Help & User Guide</h1>
          <p className="help-subtitle">Your quick reference for getting the most out of AquaFlow Interactive.</p>
        </header>

        {/* Documentation Section */}
        <section id="documentation" className="help-section">
          <h2>📚 Model Documentation</h2>
          
          <div className="models-grid">
            {/* Simple Linear Reservoir Model Card */}
            <Link to="/models/simple-linear-reservoir" className="model-card-link">
              <div className="model-card">
                <div className="model-card-header">
                  <h3>Simple Linear Reservoir Model</h3>
                  <span className="model-badge simple">Simple</span>
                </div>
                <div className="model-content">
                  <p className="model-description">
                    A basic rainfall-runoff model representing the watershed as a single linear reservoir.
                  </p>
                  <div className="model-details">
                    <div className="model-detail">
                      <strong>🔍 Best for:</strong> Education, quick estimates, conceptual basins
                    </div>
                    <div className="model-detail">
                      <strong>📊 Key Parameters:</strong> Rainfall, duration, area, runoff coefficient, reservoir constant
                    </div>
                  </div>
                  <div className="learn-more">
                    Learn more about this model →
                  </div>
                </div>
              </div>
            </Link>

            {/* SCS Curve Number Model Card */}
            <Link to="/models/scs-curve-number" className="model-card-link">
              <div className="model-card">
                <div className="model-card-header">
                  <h3>SCS Curve Number</h3>
                  <span className="model-badge advanced">Advanced</span>
                </div>
                <div className="model-content">
                  <p className="model-description">
                    Industry-standard method for estimating direct runoff from rainfall using soil and land use data.
                  </p>
                  <div className="model-details">
                    <div className="model-detail">
                      <strong>🔍 Best for:</strong> Engineering design, regulatory compliance, flood studies
                    </div>
                    <div className="model-detail">
                      <strong>📊 Key Parameters:</strong> Curve number, rainfall, soil group, land use, AMC
                    </div>
                  </div>
                  <div className="learn-more">
                    Learn more about this model →
                  </div>
                </div>
              </div>
            </Link>

            {/* Green-Ampt Infiltration Model Card */}
            <Link to="/models/green-ampt-infiltration" className="model-card-link">
              <div className="model-card">
                <div className="model-card-header">
                  <h3>Green-Ampt Infiltration</h3>
                  <span className="model-badge infiltration">Infiltration</span>
                </div>
                <div className="model-content">
                  <p className="model-description">
                    Physics-based model for calculating infiltration rates into soil during rainfall events.
                  </p>
                  <div className="model-details">
                    <div className="model-detail">
                      <strong>🔍 Best for:</strong> Research, detailed infiltration analysis, soil studies
                    </div>
                    <div className="model-detail">
                      <strong>📊 Key Parameters:</strong> Ks, ψ, θs, θi, rainfall intensity
                    </div>
                  </div>
                  <div className="learn-more">
                    Learn more about this model →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section id="guide" className="help-section">
          <h2>🚀 Quick Start Guide</h2>
          <div className="help-card">
            <h3>Getting Started</h3>
            <ol>
              <li>Select a model from the navigation menu or the cards above</li>
              <li>Enter your parameters in the input form</li>
              <li>Click "Calculate" to see the results</li>
              <li>Toggle between different views and compare with observed data</li>
            </ol>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="help-section">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I choose the right model?</h3>
              <p>
                Start with the Simple Linear Reservoir for basic understanding, then try SCS Curve Number 
                for more realistic results. Use Green-Ampt for detailed infiltration analysis.
              </p>
            </div>
            <div className="faq-item">
              <h3>What units should I use?</h3>
              <p>
                All models use metric units: millimeters for rainfall, hours for time, and square kilometers 
                for area. The results are in cubic meters per second (m³/s).
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I compare with observed data?</h3>
              <p>
                Yes! Use the CSV upload feature to compare model results with your observed hydrograph data.
              </p>
            </div>
            <div className="faq-item">
              <h3>Where can I find model documentation?</h3>
              <p>
                Click on any model card above to view detailed documentation, including mathematical 
                formulations, parameters, and example calculations.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="help-section">
          <h2>📧 Need More Help?</h2>
          <div className="help-card">
            <p>
              If you have questions or need assistance, please contact our support team at 
              <a href="mailto:support@aquaflow.app">support@aquaflow.app</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
