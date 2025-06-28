using System.ComponentModel.DataAnnotations;

public class AdvancedHydrologicalInput
{
    // Precipitation Parameters
    [Required]
    [Range(0.1, 1000)]
    public double IntensityMmPerHour { get; set; }
    
    [Required]
    [Range(1, 168)]
    public int DurationHours { get; set; }
    
    // Watershed Physical Parameters
    [Required]
    [Range(0.1, 10000)]
    public double CatchmentAreaKm2 { get; set; }
    
    [Range(0, 45)]
    public double WatershedSlopePercent { get; set; } = 2.0;
    
    [Range(0.1, 1000)]
    public double WatershedLengthKm { get; set; } = 5.0;
    
    // SCS Curve Number Parameters
    [Range(30, 100)]
    public int CurveNumber { get; set; } = 70;
    
    // Antecedent Moisture Condition (AMC)
    public AntecedentMoistureCondition AntecedentMoisture { get; set; } = AntecedentMoistureCondition.Normal;
    
    // Linear Reservoir Parameters
    [Range(0.1, 100)]
    public double LinearReservoirConstantK { get; set; } = 5.0;
    
    [Range(0, 1000)]
    public double InitialStorageCubicMeters { get; set; } = 0.0;
    
    // Reservoir Chain Parameters
    [Range(1, 10)]
    public int NumberOfReservoirs { get; set; } = 3;
    
    // Simulation Parameters
    [Range(0.1, 2)]
    public double TimeStepHours { get; set; } = 1.0;
    
    // Model Selection
    public RunoffModel SelectedModel { get; set; } = RunoffModel.SimpleLinearReservoir;
    
    // Optional: Evapotranspiration (for more advanced modeling)
    [Range(0, 10)]
    public double EvapotranspirationMmPerHour { get; set; } = 0.0;
    
    // Optional: Base flow
    [Range(0, 100)]
    public double BaseFlowCubicMetersPerSecond { get; set; } = 0.0;
    
    // Green-Ampt Parameters
    [Range(0.1, 200)]
    public double SaturatedHydraulicConductivity { get; set; } = 10.0; // Ks (mm/h)
    
    [Range(10, 400)]
    public double SuctionHead { get; set; } = 110.0; // ψ (mm)
    
    [Range(0.3, 0.6)]
    public double SaturatedMoistureContent { get; set; } = 0.45; // θs
    
    [Range(0.01, 0.2)]
    public double InitialMoistureContent { get; set; } = 0.05; // θi
    
    public SoilType SoilType { get; set; } = SoilType.Loam;
}

public enum AntecedentMoistureCondition
{
    Dry = 1,    // AMC I
    Normal = 2, // AMC II
    Wet = 3     // AMC III
}

public enum RunoffModel
{
    SimpleLinearReservoir,
    CurveNumberMethod,
    LinearReservoirChain,
    CombinedModel,
    GreenAmptInfiltration
}

public enum SoilType
{
    Sand,
    LoamySand,
    SandyLoam,
    Loam,
    SiltLoam,
    SandyClayLoam,
    ClayLoam,
    SiltyClayLoam,
    SandyClay,
    SiltyClay,
    Clay
}
