using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class WeeklyTargetsController : BaseCrudController<WeeklyTarget>
{
    public WeeklyTargetsController(AppDbContext context) : base(context) { }

    protected override IQueryable<WeeklyTarget> IncludeRelationships(IQueryable<WeeklyTarget> query)
    {
        return query.Include(wt => wt.Campaign);
    }
}