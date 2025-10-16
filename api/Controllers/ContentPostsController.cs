using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class ContentPostsController : BaseCrudController<ContentPost>
{
    public ContentPostsController(AppDbContext context) : base(context) { }

    protected override IQueryable<ContentPost> IncludeRelationships(IQueryable<ContentPost> query)
    {
        return query.Include(cp => cp.Channel);
    }
}