using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HydrologyController : ControllerBase
{
    private readonly IHydrologyService _svc;
    public HydrologyController(IHydrologyService svc) { _svc = svc; }

    [HttpPost("calculate")]
    public ActionResult<List<HydrographDataPoint>> Calculate([FromBody] PrecipitationInput input)
        => Ok(_svc.CalculateHydrograph(input));
}