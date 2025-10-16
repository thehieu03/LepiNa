using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class MarketingChannelsController : BaseCrudController<MarketingChannel>
{
    public MarketingChannelsController(AppDbContext context) : base(context) { }

    protected override IQueryable<MarketingChannel> IncludeRelationships(IQueryable<MarketingChannel> query)
    {
        return query.Include(mc => mc.ContentPosts);
    }
}
