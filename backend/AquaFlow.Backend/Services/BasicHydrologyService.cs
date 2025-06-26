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
            double outflow = storage / K;
            storage += (inflow - outflow) * dt * 3600;
            if (storage < 0) storage = 0;
            hydro.Add(new HydrographDataPoint { TimeHours = t, FlowCubicMetersPerSecond = outflow });
        }
        return hydro;
    }
}