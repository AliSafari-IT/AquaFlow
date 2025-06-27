public class BasicHydrologyService : IHydrologyService
{
    public List<HydrographDataPoint> CalculateHydrograph(PrecipitationInput input)
    {
        double area = input.CatchmentAreaKm2;
        double runoffCoef = input.RunoffCoefficient;
        double K = input.LinearReservoirConstantK;
        double dt = input.TimeStepHours;
        double storage = input.InitialStorageCubicMeters;
        var hydro = new List<HydrographDataPoint>();
        int T = input.DurationHours * 2 + 24;
        for (int t = 0; t <= T; t++)
        {
            double inflow = (t < input.DurationHours)
                ? input.IntensityMmPerHour * area * runoffCoef / 3.6
                : 0;
            // Convert K from hours to seconds for proper unit consistency
            double KSeconds = K * 3600;
            double outflow = storage / KSeconds;
            // Storage change: (inflow - outflow) in m³/s * dt in hours * 3600 s/hour = change in m³
            storage += (inflow - outflow) * dt * 3600;
            if (storage < 0) storage = 0;
            hydro.Add(new HydrographDataPoint { TimeHours = t, FlowCubicMetersPerSecond = outflow });
        }
        return hydro;
    }
}