using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class CampaignsController : BaseCrudController<Campaign>
{
    public CampaignsController(AppDbContext context) : base(context) { }

    protected override IQueryable<Campaign> IncludeRelationships(IQueryable<Campaign> query)
    {
        return query.Include(c => c.Events)
                   .Include(c => c.KpiMeasurements)
                   .Include(c => c.WeeklyTargets);
    }
}
