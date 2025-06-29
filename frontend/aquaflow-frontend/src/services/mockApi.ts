// Mock data for GitHub Pages demo
export interface MockHydrographResult {
  modelName: string;
  hydrographData: Array<{
    time: number;
    flow: number;
  }>;
  peakFlow: number;
  peakTime: number;
  totalVolume: number;
  diagnostics: {
    runoffCoefficient: number;
    infiltrationRate: number;
    evapotranspirationLoss: number;
    baseFlow: number;
    totalInfiltration: number;
    totalRunoff: number;
  };
}

export interface MockModelInfo {
  value: string;
  name: string;
  description: string;
}

export interface MockSoilTypeInfo {
  value: string;
  label: string;
  ks: number;
  psi: number;
  thetaS: number;
}

// Mock hydrological models
export const mockModels: MockModelInfo[] = [
  { value: "AdvancedLinearReservoir", name: "Advanced Linear Reservoir", description: "Enhanced linear reservoir with evapotranspiration" },
  { value: "CurveNumberMethod", name: "SCS Curve Number Method", description: "USDA Soil Conservation Service method" },
  { value: "LinearReservoirChain", name: "Linear Reservoir Chain", description: "Multiple reservoirs in series" },
  { value: "CombinedModel", name: "Combined SCS-UH Model", description: "SCS method with Unit Hydrograph theory" },
  { value: "GreenAmptInfiltration", name: "Green-Ampt Infiltration", description: "Physics-based infiltration model" }
];

// Mock soil types
export const mockSoilTypes: MockSoilTypeInfo[] = [
  { value: "Sand", label: "Sand", ks: 117.8, psi: 49.5, thetaS: 0.437 },
  { value: "LoamySand", label: "Loamy Sand", ks: 29.9, psi: 61.3, thetaS: 0.437 },
  { value: "SandyLoam", label: "Sandy Loam", ks: 10.9, psi: 110.1, thetaS: 0.453 },
  { value: "Loam", label: "Loam", ks: 3.4, psi: 88.9, thetaS: 0.463 },
  { value: "SiltLoam", label: "Silt Loam", ks: 6.5, psi: 166.8, thetaS: 0.501 },
  { value: "SandyClayLoam", label: "Sandy Clay Loam", ks: 1.5, psi: 218.5, thetaS: 0.398 },
  { value: "ClayLoam", label: "Clay Loam", ks: 1.0, psi: 208.8, thetaS: 0.464 },
  { value: "SiltyClayLoam", label: "Silty Clay Loam", ks: 1.0, psi: 273.0, thetaS: 0.471 },
  { value: "SandyClay", label: "Sandy Clay", ks: 0.6, psi: 239.0, thetaS: 0.430 },
  { value: "SiltyClay", label: "Silty Clay", ks: 0.5, psi: 292.2, thetaS: 0.479 },
  { value: "Clay", label: "Clay", ks: 0.3, psi: 316.3, thetaS: 0.475 }
];

// Generate realistic hydrograph data - returns array for simple model, object for advanced
const generateHydrograph = (
  intensity: number,
  duration: number,
  catchmentArea: number,
  modelType: number = 0,
  isAdvanced: boolean = false
): any => {
  const timeStep = 0.5; // hours
  const totalTime = duration + 12; // extend beyond storm duration
  const dataPoints: Array<{ timeHours: number; flowCubicMetersPerSecond: number }> = [];
  
  // Model-specific parameters
  const modelParams = {
    0: { peakMultiplier: 1.0, recession: 0.85, lag: 2 }, // Advanced Linear
    1: { peakMultiplier: 0.8, recession: 0.90, lag: 1.5 }, // SCS
    2: { peakMultiplier: 0.7, recession: 0.92, lag: 3 }, // Reservoir Chain
    3: { peakMultiplier: 0.9, recession: 0.88, lag: 2.5 }, // SCS-UH
    4: { peakMultiplier: 0.6, recession: 0.94, lag: 1 } // Green-Ampt
  };
  
  const params = modelParams[modelType as keyof typeof modelParams] || modelParams[0];
  
  // Calculate base parameters
  const runoffCoeff = 0.3 + (intensity / 100) * 0.4; // 0.3 to 0.7 based on intensity
  const peakFlow = (intensity * catchmentArea * runoffCoeff * params.peakMultiplier) / 3.6;
  const peakTime = duration * 0.6 + params.lag;
  
  // Generate hydrograph shape
  for (let t = 0; t <= totalTime; t += timeStep) {
    let flow = 0;
    
    if (t <= duration) {
      // Rising limb during storm
      const progress = t / peakTime;
      flow = peakFlow * Math.pow(progress, 1.5) * (1 - Math.exp(-progress * 2));
    } else {
      // Recession limb after storm
      const recessionTime = t - duration;
      flow = peakFlow * Math.pow(params.recession, recessionTime / timeStep);
    }
    
    // Add some realistic noise
    flow *= (0.95 + Math.random() * 0.1);
    
    // Add base flow
    flow += 0.5;
    
    dataPoints.push({ timeHours: t, flowCubicMetersPerSecond: Math.max(0, flow) });
  }
  
  // For simple model, return just the array
  if (!isAdvanced) {
    return dataPoints;
  }
  
  // For advanced model, return the full HydrographResult structure
  const totalVolume = dataPoints.reduce((sum, point) => sum + point.flowCubicMetersPerSecond * timeStep * 3600, 0);
  const totalRunoff = totalVolume * 0.7;
  const totalInfiltration = intensity * catchmentArea * duration * 1000 - totalRunoff;
  const actualPeakFlow = Math.max(...dataPoints.map(p => p.flowCubicMetersPerSecond));
  const actualPeakTime = dataPoints.find(p => p.flowCubicMetersPerSecond === actualPeakFlow)?.timeHours || 0;
  
  return {
    hydrographPoints: dataPoints,
    modelSummary: {
      modelName: mockModels[modelType]?.name || "Unknown Model",
      totalRainfallMm: intensity * duration,
      totalRunoffMm: (totalRunoff / (catchmentArea * 1000)) * 1000, // Convert to mm
      runoffCoefficient: runoffCoeff,
      peakFlowCubicMetersPerSecond: actualPeakFlow,
      timeToPeakHours: actualPeakTime,
      totalVolumeCubicMeters: totalVolume,
      modelSpecificParameters: {
        intensity,
        duration,
        catchmentArea,
        modelType
      }
    },
    calculationNotes: [
      `Model: ${mockModels[modelType]?.name || "Unknown Model"}`,
      `Peak flow: ${actualPeakFlow.toFixed(2)} m³/s at ${actualPeakTime.toFixed(1)} hours`,
      `Total volume: ${(totalVolume / 1000).toFixed(1)} thousand m³`,
      `Runoff coefficient: ${(runoffCoeff * 100).toFixed(1)}%`
    ]
  };
};

// Mock API functions
export const mockApiCall = async (endpoint: string, data: any): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  if (endpoint.includes('models')) {
    return { 
      models: mockModels,
      soilTypes: mockSoilTypes,
      curveNumberGuidance: {
        urban: { low: 32, medium: 72, high: 92, description: "Urban areas based on density" },
        agricultural: { good: 67, fair: 77, poor: 83, description: "Row crops with different management" },
        forest: { good: 30, fair: 55, poor: 70, description: "Forest with different conditions" },
        pasture: { good: 39, fair: 61, poor: 74, description: "Pasture with different conditions" }
      }
    };
  }
  
  if (endpoint.includes('calculate-advanced')) {
    return generateHydrograph(
      data.intensityMmPerHour,
      data.durationHours,
      data.catchmentAreaKm2,
      data.selectedModel,
      true // isAdvanced = true
    );
  }
  
  if (endpoint.includes('calculate')) {
    return generateHydrograph(
      data.intensity,
      data.duration,
      data.catchmentAreaKm2,
      0,
      false // isAdvanced = false
    );
  }
  
  throw new Error('Unknown endpoint');
};
