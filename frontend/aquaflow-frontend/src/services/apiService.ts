// Unified API service that works in both development and production
import { buildApiUrl, isDemoMode } from '../config/api';
import { mockApiCall } from './mockApi';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define the structure of hydrograph data points (matching HydrographChart expectations)
export interface HydrographDataPoint {
  timeHours: number;
  flowCubicMetersPerSecond: number;
}

// Define the structure of model summary (matching AdvancedResultsDisplay expectations)
export interface ModelSummary {
  modelName: string;
  totalRainfallMm: number;
  totalRunoffMm: number;
  runoffCoefficient: number;
  peakFlowCubicMetersPerSecond: number;
  timeToPeakHours: number;
  totalVolumeCubicMeters: number;
  modelSpecificParameters: Record<string, any>;
}

// Define the structure of hydrograph result (matching AdvancedResultsDisplay expectations)
export interface HydrographResult {
  hydrographPoints: HydrographDataPoint[];
  modelSummary: ModelSummary;
  calculationNotes: string[];
}

// Define the structure of simple hydrograph response (array of data points)
export type SimpleHydrographResponse = HydrographDataPoint[];

// Define the structure of the models API response
export interface HydrologyModelsResponse {
  models: Array<{
    value: string;
    name: string;
    description: string;
  }>;
  soilTypes?: Array<{
    value: string;
    label: string;
    ks: number;
    psi: number;
    thetaS: number;
  }>;
  curveNumberGuidance?: {
    urban: { low: number; medium: number; high: number; description: string };
    agricultural: { good: number; fair: number; poor: number; description: string };
    forest: { good: number; fair: number; poor: number; description: string };
    pasture: { good: number; fair: number; poor: number; description: string };
  };
}

// Generic API call function
export const apiCall = async <T>(
  endpoint: 'hydrology' | 'hydrologyAdvanced' | 'hydrologyModels',
  data?: any,
  method: 'GET' | 'POST' = 'POST'
): Promise<ApiResponse<T>> => {
  try {
    // Use mock data in demo mode (GitHub Pages)
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Using mock data');
      const mockResult = await mockApiCall(endpoint, data);
      return { success: true, data: mockResult };
    }

    // Use real API in development
    const url = buildApiUrl(endpoint);
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };

  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Specific API functions for each endpoint
export const calculateHydrograph = async (data: any): Promise<ApiResponse<SimpleHydrographResponse>> => {
  return apiCall<SimpleHydrographResponse>('hydrology', data);
};

export const calculateAdvancedHydrograph = async (data: any): Promise<ApiResponse<HydrographResult>> => {
  return apiCall<HydrographResult>('hydrologyAdvanced', data);
};

export const getHydrologyModels = async (): Promise<ApiResponse<HydrologyModelsResponse>> => {
  return apiCall<HydrologyModelsResponse>('hydrologyModels', null, 'GET');
};
