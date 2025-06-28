import React from 'react';
import { isDemoMode } from '../config/api';
import '../styles/demo-banner.css';

const DemoBanner: React.FC = () => {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <div className="demo-banner">
      <span className="demo-banner-icon">🎭</span>
      <span className="demo-banner-text">
        Demo Mode: Using simulated data for GitHub Pages deployment. 
        For full functionality with real backend, run locally.
      </span>
    </div>
  );
};

export default DemoBanner;
