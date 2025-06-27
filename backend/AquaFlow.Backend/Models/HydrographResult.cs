public class HydrographResult
{
    public List<HydrographDataPoint> HydrographPoints { get; set; } = new();
    public RunoffModelSummary ModelSummary { get; set; } = new();
    public List<string> CalculationNotes { get; set; } = new();
}

public class RunoffModelSummary
{
    public string ModelName { get; set; } = string.Empty;
    public double TotalRainfallMm { get; set; }
    public double TotalRunoffMm { get; set; }
    public double RunoffCoefficient { get; set; }
    public double PeakFlowCubicMetersPerSecond { get; set; }
    public double TimeToPeakHours { get; set; }
    public double TotalVolumeCubicMeters { get; set; }
    public Dictionary<string, object> ModelSpecificParameters { get; set; } = new();
}
