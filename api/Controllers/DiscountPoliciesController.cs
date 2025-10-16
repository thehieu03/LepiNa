using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class DiscountPoliciesController : BaseCrudController<DiscountPolicy>
{
    public DiscountPoliciesController(AppDbContext context) : base(context) { }

    protected override IQueryable<DiscountPolicy> IncludeRelationships(IQueryable<DiscountPolicy> query)
    {
        return query.Include(dp => dp.Orders);
    }
}
