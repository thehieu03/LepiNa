using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class EventsController : BaseCrudController<Event>
{
    public EventsController(AppDbContext context) : base(context) { }

    protected override IQueryable<Event> IncludeRelationships(IQueryable<Event> query)
    {
        return query.Include(e => e.Campaign);
    }
}