public class PrecipitationInput
{
    public double IntensityMmPerHour { get; set; }
    public int DurationHours { get; set; }
    public double CatchmentAreaKm2 { get; set; } = 10.0;
    public double RunoffCoefficient { get; set; } = 0.5;
    public double LinearReservoirConstantK { get; set; } = 5.0;
    public double TimeStepHours { get; set; } = 1.0;
    public double InitialStorageCubicMeters { get; set; } = 0.0;
}