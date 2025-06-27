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
        => Ok(_advancedSvc.CalculateAdvancedHydrograph(input));

    [HttpGet("models")]
    public ActionResult<object> GetAvailableModels()
    {
        return Ok(new
        {
            Models = new[]
            {
                new { Value = "SimpleLinearReservoir", Name = "Simple Linear Reservoir", Description = "Basic linear reservoir routing with runoff coefficient" },
                new { Value = "CurveNumberMethod", Name = "SCS Curve Number Method", Description = "USDA SCS Curve Number method for runoff calculation" },
                new { Value = "LinearReservoirChain", Name = "Linear Reservoir Chain", Description = "Multiple linear reservoirs in series for realistic routing" },
                new { Value = "CombinedModel", Name = "Combined SCS-UH Model", Description = "Advanced model combining SCS method with unit hydrograph theory" }
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
            }
        });
    }
}