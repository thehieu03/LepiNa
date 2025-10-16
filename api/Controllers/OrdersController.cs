using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class OrdersController : BaseCrudController<Order>
{
    public OrdersController(AppDbContext context) : base(context) { }

    protected override IQueryable<Order> IncludeRelationships(IQueryable<Order> query)
    {
        return query.Include(o => o.Customer)
                   .Include(o => o.DiscountPolicy)
                   .Include(o => o.OrderItems)
                   .Include(o => o.Feedbacks);
    }
}
