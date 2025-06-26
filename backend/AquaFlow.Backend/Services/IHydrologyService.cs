public interface IHydrologyService
{
    List<HydrographDataPoint> CalculateHydrograph(PrecipitationInput input);
}