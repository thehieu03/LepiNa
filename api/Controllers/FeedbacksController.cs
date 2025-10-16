using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class FeedbacksController : BaseCrudController<Feedback>
{
    public FeedbacksController(AppDbContext context) : base(context) { }

    protected override IQueryable<Feedback> IncludeRelationships(IQueryable<Feedback> query)
    {
        return query.Include(f => f.Customer)
                   .Include(f => f.Order);
    }
}