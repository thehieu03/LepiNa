using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class KpiMeasurementsController : BaseCrudController<KpiMeasurement>
{
    public KpiMeasurementsController(AppDbContext context) : base(context) { }

    protected override IQueryable<KpiMeasurement> IncludeRelationships(IQueryable<KpiMeasurement> query)
    {
        return query.Include(km => km.Campaign)
                   .Include(km => km.Kpi);
    }
}