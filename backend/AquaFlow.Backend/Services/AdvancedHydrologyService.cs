public interface IAdvancedHydrologyService
{
    HydrographResult CalculateAdvancedHydrograph(AdvancedHydrologicalInput input);
}

public class AdvancedHydrologyService : IAdvancedHydrologyService
{
    public HydrographResult CalculateAdvancedHydrograph(AdvancedHydrologicalInput input)
    {
        Console.WriteLine($"Processing model: {input.SelectedModel}");
        return input.SelectedModel switch
        {
            RunoffModel.SimpleLinearReservoir => CalculateSimpleLinearReservoir(input),
            RunoffModel.CurveNumberMethod => CalculateCurveNumberMethod(input),
            RunoffModel.LinearReservoirChain => CalculateLinearReservoirChain(input),
            RunoffModel.CombinedModel => CalculateCombinedModel(input),
            _ => CalculateSimpleLinearReservoir(input)
        };
    }

    private HydrographResult CalculateSimpleLinearReservoir(AdvancedHydrologicalInput input)
    {
        var result = new HydrographResult();
        var notes = new List<string>();
        
        // Simple runoff coefficient based on curve number
        double runoffCoef = CalculateRunoffCoefficient(input.CurveNumber, input.AntecedentMoisture);
        
        double area = input.CatchmentAreaKm2;
        double K = input.LinearReservoirConstantK;
        double dt = input.TimeStepHours;
        double storage = input.InitialStorageCubicMeters;
        
        var hydro = new List<HydrographDataPoint>();
        int T = input.DurationHours * 2 + 24;
        
        double totalRainfall = 0;
        double totalRunoff = 0;
        double peakFlow = 0;
        double timeToPeak = 0;
        
        for (int t = 0; t <= T; t++)
        {
            double rainfall = (t < input.DurationHours) ? input.IntensityMmPerHour : 0;
            totalRainfall += rainfall * dt;
            
            // Calculate effective rainfall (runoff)
            double effectiveRainfall = rainfall * runoffCoef;
            totalRunoff += effectiveRainfall * dt;
            
            // Convert to inflow (mm/hr to m³/s)
            // Correct conversion: mm/hr * km² = mm*km²/hr = 1000*m³/hr = m³/3.6s  
            double inflow = effectiveRainfall * area / 3.6;
            
            // Add evapotranspiration losses
            double etLoss = input.EvapotranspirationMmPerHour * area / 3.6;
            inflow = Math.Max(0, inflow - etLoss);
            
            // Linear reservoir routing
            // Convert K from hours to seconds for correct unit consistency
            double outflow = storage / (K * 3600) + input.BaseFlowCubicMetersPerSecond;
            storage += (inflow - outflow) * dt * 3600;
            if (storage < 0) storage = 0;
            
            if (outflow > peakFlow)
            {
                peakFlow = outflow;
                timeToPeak = t;
            }
            
            hydro.Add(new HydrographDataPoint 
            { 
                TimeHours = t, 
                FlowCubicMetersPerSecond = outflow 
            });
        }
        
        result.HydrographPoints = hydro;
        result.ModelSummary = new RunoffModelSummary
        {
            ModelName = "Advanced Linear Reservoir",
            TotalRainfallMm = totalRainfall,
            TotalRunoffMm = totalRunoff,
            RunoffCoefficient = runoffCoef,
            PeakFlowCubicMetersPerSecond = peakFlow,
            TimeToPeakHours = timeToPeak,
            TotalVolumeCubicMeters = totalRunoff * area * 1000,
            ModelSpecificParameters = new Dictionary<string, object>
            {
                ["LinearReservoirConstant"] = K,
                ["CurveNumber"] = input.CurveNumber,
                ["AntecedentMoisture"] = input.AntecedentMoisture.ToString()
            }
        };
        
        notes.Add($"Applied runoff coefficient: {runoffCoef:F3} based on CN={input.CurveNumber}");
        notes.Add($"Antecedent moisture condition: {input.AntecedentMoisture}");
        result.CalculationNotes = notes;
        
        return result;
    }

    private HydrographResult CalculateCurveNumberMethod(AdvancedHydrologicalInput input)
    {
        var result = new HydrographResult();
        var notes = new List<string>();
        
        // Adjust curve number for AMC
        int adjustedCN = AdjustCurveNumberForAMC(input.CurveNumber, input.AntecedentMoisture);
        
        // Calculate potential maximum retention
        double S = (25400 / adjustedCN) - 254; // in mm
        
        double area = input.CatchmentAreaKm2;
        double dt = input.TimeStepHours;
        double storage = input.InitialStorageCubicMeters;

        // Apply slope adjustment (steeper slopes = faster response)
        double slopeAdjustment = 1 + (input.WatershedSlopePercent / 100);
        double K = input.LinearReservoirConstantK / slopeAdjustment;
        
        var hydro = new List<HydrographDataPoint>();
        int T = input.DurationHours * 2 + 24;
        
        double cumulativeRainfall = 0;
        double totalRunoff = 0;
        double peakFlow = 0;
        double timeToPeak = 0;
        
        for (int t = 0; t <= T; t++)
        {
            double rainfall = (t < input.DurationHours) ? input.IntensityMmPerHour * dt : 0;
            cumulativeRainfall += rainfall;
            
            // SCS Curve Number runoff calculation
            double runoff = 0;
            if (cumulativeRainfall > 0.2 * S)
            {
                double numerator = Math.Pow(cumulativeRainfall - 0.2 * S, 2);
                double denominator = cumulativeRainfall + 0.8 * S;
                runoff = numerator / denominator;
            }
            
            // Incremental runoff for this time step
            double incrementalRunoff = runoff - totalRunoff;
            totalRunoff = runoff;
            
            // Convert to inflow (mm to m³/s)
            // Correct conversion: mm * km² = mm*km²/hr = 1000*m³/hr = m³/3.6s
            double inflow = incrementalRunoff * area / 3.6;
            
            // Linear reservoir routing
            // Convert K from hours to seconds for correct unit consistency
            double outflow = storage / (K * 3600) + input.BaseFlowCubicMetersPerSecond;
            storage += (inflow - outflow) * dt * 3600;
            if (storage < 0) storage = 0;
            
            if (outflow > peakFlow)
            {
                peakFlow = outflow;
                timeToPeak = t;
            }
            
            hydro.Add(new HydrographDataPoint 
            { 
                TimeHours = t, 
                FlowCubicMetersPerSecond = outflow 
            });
        }
        
        result.HydrographPoints = hydro;
        result.ModelSummary = new RunoffModelSummary
        {
            ModelName = "SCS Curve Number Method",
            TotalRainfallMm = cumulativeRainfall,
            TotalRunoffMm = totalRunoff,
            RunoffCoefficient = totalRunoff / Math.Max(cumulativeRainfall, 0.001),
            PeakFlowCubicMetersPerSecond = peakFlow,
            TimeToPeakHours = timeToPeak,
            TotalVolumeCubicMeters = totalRunoff * area * 1000,
            ModelSpecificParameters = new Dictionary<string, object>
            {
                ["OriginalCurveNumber"] = input.CurveNumber,
                ["AdjustedCurveNumber"] = adjustedCN,
                ["PotentialRetention_mm"] = S,
                ["WatershedSlope_percent"] = input.WatershedSlopePercent,
                ["AntecedentMoisture"] = input.AntecedentMoisture.ToString()
            }
        };
        
        notes.Add($"Original CN: {input.CurveNumber}, Adjusted for {input.AntecedentMoisture}: {adjustedCN}");
        notes.Add($"Potential maximum retention (S): {S:F1} mm");
        notes.Add($"Applied slope adjustment factor: {1 + (input.WatershedSlopePercent / 100):F2}");
        result.CalculationNotes = notes;
        
        return result;
    }

    private HydrographResult CalculateLinearReservoirChain(AdvancedHydrologicalInput input)
    {
        var result = new HydrographResult();
        var notes = new List<string>();
        
        // Calculate runoff using curve number method
        int adjustedCN = AdjustCurveNumberForAMC(input.CurveNumber, input.AntecedentMoisture);
        double S = (25400 / adjustedCN) - 254;
        
        double area = input.CatchmentAreaKm2;
        double K = input.LinearReservoirConstantK / input.NumberOfReservoirs; // Distribute K among reservoirs
        double dt = input.TimeStepHours;
        
        // Initialize storage for each reservoir
        double[] storage = new double[input.NumberOfReservoirs];
        for (int i = 0; i < input.NumberOfReservoirs; i++)
        {
            storage[i] = input.InitialStorageCubicMeters / input.NumberOfReservoirs;
        }
        
        var hydro = new List<HydrographDataPoint>();
        int T = input.DurationHours * 2 + 24;
        
        double cumulativeRainfall = 0;
        double totalRunoff = 0;
        double peakFlow = 0;
        double timeToPeak = 0;
        
        for (int t = 0; t <= T; t++)
        {
            double rainfall = (t < input.DurationHours) ? input.IntensityMmPerHour * dt : 0;
            cumulativeRainfall += rainfall;
            
            // SCS runoff calculation
            double runoff = 0;
            if (cumulativeRainfall > 0.2 * S)
            {
                double numerator = Math.Pow(cumulativeRainfall - 0.2 * S, 2);
                double denominator = cumulativeRainfall + 0.8 * S;
                runoff = numerator / denominator;
            }
            
            double incrementalRunoff = runoff - totalRunoff;
            totalRunoff = runoff;
            
            // Convert to inflow for first reservoir
            // Correct conversion: mm * km² = mm*km²/hr = 1000*m³/hr = m³/3.6s
            double inflow = incrementalRunoff * area / 3.6;
            
            // Route through reservoir chain
            for (int i = 0; i < input.NumberOfReservoirs; i++)
            {
                // Convert K from hours to seconds for correct unit consistency
                double outflow = storage[i] / (K * 3600) + (i == input.NumberOfReservoirs - 1 ? input.BaseFlowCubicMetersPerSecond : 0);
                storage[i] += (inflow - outflow) * dt * 3600;
                if (storage[i] < 0) storage[i] = 0;
                
                inflow = outflow; // Output of this reservoir becomes input to next
            }
            
            double finalOutflow = inflow;
            
            if (finalOutflow > peakFlow)
            {
                peakFlow = finalOutflow;
                timeToPeak = t;
            }
            
            hydro.Add(new HydrographDataPoint 
            { 
                TimeHours = t, 
                FlowCubicMetersPerSecond = finalOutflow 
            });
        }
        
        result.HydrographPoints = hydro;
        result.ModelSummary = new RunoffModelSummary
        {
            ModelName = $"Linear Reservoir Chain ({input.NumberOfReservoirs} reservoirs)",
            TotalRainfallMm = cumulativeRainfall,
            TotalRunoffMm = totalRunoff,
            RunoffCoefficient = totalRunoff / Math.Max(cumulativeRainfall, 0.001),
            PeakFlowCubicMetersPerSecond = peakFlow,
            TimeToPeakHours = timeToPeak,
            TotalVolumeCubicMeters = totalRunoff * area * 1000,
            ModelSpecificParameters = new Dictionary<string, object>
            {
                ["NumberOfReservoirs"] = input.NumberOfReservoirs,
                ["ReservoirConstantPerUnit"] = K,
                ["AdjustedCurveNumber"] = adjustedCN,
                ["PotentialRetention_mm"] = S
            }
        };
        
        notes.Add($"Used {input.NumberOfReservoirs} linear reservoirs in series");
        notes.Add($"Individual reservoir constant K: {K:F2} hours");
        notes.Add($"Creates more realistic, attenuated hydrograph shape");
        result.CalculationNotes = notes;
        
        return result;
    }

    private HydrographResult CalculateCombinedModel(AdvancedHydrologicalInput input)
    {
        var result = new HydrographResult();
        var notes = new List<string>();
        
        // This combines curve number method with reservoir chain and additional parameters
        int adjustedCN = AdjustCurveNumberForAMC(input.CurveNumber, input.AntecedentMoisture);
        double S = (25400 / adjustedCN) - 254;
        
        // Calculate time of concentration based on watershed characteristics
        double tc = CalculateTimeOfConcentration(input.WatershedLengthKm, input.WatershedSlopePercent);
        
        double area = input.CatchmentAreaKm2;
        double K = Math.Max(input.LinearReservoirConstantK, tc); // K should be related to tc
        double dt = input.TimeStepHours;
        
        // Use 3 reservoirs by default for combined model
        int numReservoirs = 3;
        double[] storage = new double[numReservoirs];
        for (int i = 0; i < numReservoirs; i++)
        {
            storage[i] = input.InitialStorageCubicMeters / numReservoirs;
        }
        
        var hydro = new List<HydrographDataPoint>();
        int T = input.DurationHours * 2 + 48; // Extended simulation time
        
        double cumulativeRainfall = 0;
        double totalRunoff = 0;
        double peakFlow = 0;
        double timeToPeak = 0;
        
        for (int t = 0; t <= T; t++)
        {
            double rainfall = (t < input.DurationHours) ? input.IntensityMmPerHour * dt : 0;
            cumulativeRainfall += rainfall;
            
            // Enhanced SCS runoff with initial abstraction
            double runoff = 0;
            double Ia = 0.2 * S; // Initial abstraction
            if (cumulativeRainfall > Ia)
            {
                double numerator = Math.Pow(cumulativeRainfall - Ia, 2);
                double denominator = cumulativeRainfall - Ia + S;
                runoff = numerator / denominator;
            }
            
            double incrementalRunoff = runoff - totalRunoff;
            totalRunoff = runoff;
            
            // Convert to inflow with unit hydrograph effects
            // Correct conversion: mm * km² = mm*km²/hr = 1000*m³/hr = m³/3.6s
            double inflow = incrementalRunoff * area / 3.6;
            
            // Apply evapotranspiration losses
            double etLoss = input.EvapotranspirationMmPerHour * area / 3.6;
            inflow = Math.Max(0, inflow - etLoss);
            
            // Route through reservoir chain with variable K
            double currentK = K / numReservoirs;
            for (int i = 0; i < numReservoirs; i++)
            {
                // Convert K from hours to seconds for correct unit consistency
                double outflow = storage[i] / (currentK * 3600);
                storage[i] += (inflow - outflow) * dt * 3600;
                if (storage[i] < 0) storage[i] = 0;
                
                inflow = outflow;
            }
            
            // Add base flow
            double finalOutflow = inflow + input.BaseFlowCubicMetersPerSecond;
            
            if (finalOutflow > peakFlow)
            {
                peakFlow = finalOutflow;
                timeToPeak = t;
            }
            
            hydro.Add(new HydrographDataPoint 
            { 
                TimeHours = t, 
                FlowCubicMetersPerSecond = finalOutflow 
            });
        }
        
        result.HydrographPoints = hydro;
        result.ModelSummary = new RunoffModelSummary
        {
            ModelName = "Combined SCS-UH Model",
            TotalRainfallMm = cumulativeRainfall,
            TotalRunoffMm = totalRunoff,
            RunoffCoefficient = totalRunoff / Math.Max(cumulativeRainfall, 0.001),
            PeakFlowCubicMetersPerSecond = peakFlow,
            TimeToPeakHours = timeToPeak,
            TotalVolumeCubicMeters = totalRunoff * area * 1000,
            ModelSpecificParameters = new Dictionary<string, object>
            {
                ["TimeOfConcentration_hours"] = tc,
                ["AdjustedCurveNumber"] = adjustedCN,
                ["InitialAbstraction_mm"] = 0.2 * S,
                ["PotentialRetention_mm"] = S,
                ["NumberOfReservoirs"] = numReservoirs,
                ["BaseFlow_m3s"] = input.BaseFlowCubicMetersPerSecond,
                ["ET_Rate_mmhr"] = input.EvapotranspirationMmPerHour
            }
        };
        
        notes.Add($"Calculated time of concentration: {tc:F2} hours");
        notes.Add($"Applied enhanced SCS method with initial abstraction: {0.2 * S:F1} mm");
        notes.Add($"Included evapotranspiration losses: {input.EvapotranspirationMmPerHour} mm/hr");
        notes.Add($"Base flow component: {input.BaseFlowCubicMetersPerSecond} m³/s");
        result.CalculationNotes = notes;
        
        return result;
    }

    private double CalculateRunoffCoefficient(int curveNumber, AntecedentMoistureCondition amc)
    {
        // Simple approximation - in reality this would be more complex
        double baseCoeff = (curveNumber - 30) / 70.0; // Scale from 0 to 1
        
        return amc switch
        {
            AntecedentMoistureCondition.Dry => baseCoeff * 0.7,
            AntecedentMoistureCondition.Normal => baseCoeff,
            AntecedentMoistureCondition.Wet => Math.Min(1.0, baseCoeff * 1.3),
            _ => baseCoeff
        };
    }

    private int AdjustCurveNumberForAMC(int baseCN, AntecedentMoistureCondition amc)
    {
        return amc switch
        {
            AntecedentMoistureCondition.Dry => (int)(baseCN * 0.85),
            AntecedentMoistureCondition.Normal => baseCN,
            AntecedentMoistureCondition.Wet => Math.Min(100, (int)(baseCN * 1.15)),
            _ => baseCN
        };
    }

    private double CalculateTimeOfConcentration(double lengthKm, double slopePercent)
    {
        // Kirpich formula (simplified)
        double L = lengthKm * 1000; // Convert to meters
        double S = slopePercent / 100; // Convert to decimal
        
        // tc in minutes, convert to hours
        double tc = 0.0195 * Math.Pow(L, 0.77) * Math.Pow(S, -0.385) / 60;
        
        return Math.Max(0.5, tc); // Minimum 0.5 hours
    }
}
