using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HydrologyController : ControllerBase
{
    private readonly IHydrologyService _svc;
    private readonly IAdvancedHydrologyService _advancedSvc;
    
    public HydrologyController(IHydrologyService svc, IAdvancedHydrologyService advancedSvc) 
    { 
        _svc = svc; 
        _advancedSvc = advancedSvc;
    }

    [HttpPost("calculate")]
    public ActionResult<List<HydrographDataPoint>> Calculate([FromBody] PrecipitationInput input)
        => Ok(_svc.CalculateHydrograph(input));

    [HttpPost("calculate-advanced")]
    public ActionResult<HydrographResult> CalculateAdvanced([FromBody] AdvancedHydrologicalInput input)
    {
        // Debug: Log the received model
        Console.WriteLine($"Received model: {input.SelectedModel}");
        return Ok(_advancedSvc.CalculateAdvancedHydrograph(input));
    }

    [HttpGet("models")]
    public ActionResult<object> GetAvailableModels()
    {
        return Ok(new
        {
            Models = new[]
            {
                new { Value = "SimpleLinearReservoir", Name = "Advanced Linear Reservoir", Description = "Basic linear reservoir routing with runoff coefficient" },
                new { Value = "CurveNumberMethod", Name = "SCS Curve Number Method", Description = "USDA SCS Curve Number method for runoff calculation" },
                new { Value = "LinearReservoirChain", Name = "Linear Reservoir Chain", Description = "Multiple linear reservoirs in series for realistic routing" },
                new { Value = "CombinedModel", Name = "Combined SCS-UH Model", Description = "Advanced model combining SCS method with unit hydrograph theory" },
                new { Value = "GreenAmptInfiltration", Name = "Green-Ampt Infiltration", Description = "Physics-based infiltration model with sharp wetting front assumption" }
            },
            AntecedentConditions = new[]
            {
                new { Value = 1, Name = "Dry (AMC I)", Description = "Soils are dry but not to wilting point" },
                new { Value = 2, Name = "Normal (AMC II)", Description = "Average conditions for annual floods" },
                new { Value = 3, Name = "Wet (AMC III)", Description = "Heavy rainfall or light rainfall with low temperatures occurred within 5 days" }
            },
            CurveNumberGuidance = new
            {
                Urban = new { Low = 30, Medium = 50, High = 70, Description = "Urban areas with varying imperviousness" },
                Agricultural = new { Good = 40, Fair = 60, Poor = 80, Description = "Agricultural land with different management" },
                Forest = new { Good = 30, Fair = 50, Poor = 70, Description = "Forested areas with different conditions" },
                Pasture = new { Good = 35, Fair = 58, Poor = 78, Description = "Pasture/grassland with different conditions" }
            },
            SoilTypes = new[]
            {
                new { Value = "Sand", Name = "Sand", Ks = 117.8, Psi = 49.5, ThetaS = 0.437, Description = "Coarse sandy soil, high infiltration rate" },
                new { Value = "LoamySand", Name = "Loamy Sand", Ks = 29.9, Psi = 61.3, ThetaS = 0.437, Description = "Sandy soil with some fine particles" },
                new { Value = "SandyLoam", Name = "Sandy Loam", Ks = 10.9, Psi = 110.1, ThetaS = 0.453, Description = "Well-balanced soil with good drainage" },
                new { Value = "Loam", Name = "Loam", Ks = 3.4, Psi = 88.9, ThetaS = 0.463, Description = "Ideal agricultural soil, balanced texture" },
                new { Value = "SiltLoam", Name = "Silt Loam", Ks = 6.5, Psi = 166.8, ThetaS = 0.501, Description = "Fine-textured soil, good water retention" },
                new { Value = "SandyClayLoam", Name = "Sandy Clay Loam", Ks = 1.5, Psi = 218.5, ThetaS = 0.398, Description = "Mixed texture with moderate infiltration" },
                new { Value = "ClayLoam", Name = "Clay Loam", Ks = 1.0, Psi = 208.8, ThetaS = 0.464, Description = "Clay-rich soil with good structure" },
                new { Value = "SiltyClayLoam", Name = "Silty Clay Loam", Ks = 1.0, Psi = 273.0, ThetaS = 0.471, Description = "Fine-textured soil, high water retention" },
                new { Value = "SandyClay", Name = "Sandy Clay", Ks = 0.6, Psi = 239.0, ThetaS = 0.430, Description = "Clay-rich with sand component" },
                new { Value = "SiltyClay", Name = "Silty Clay", Ks = 0.5, Psi = 292.2, ThetaS = 0.479, Description = "Very fine-textured, low infiltration" },
                new { Value = "Clay", Name = "Clay", Ks = 0.3, Psi = 316.3, ThetaS = 0.475, Description = "Heavy clay soil, very low infiltration rate" }
            }
        });
    }
}