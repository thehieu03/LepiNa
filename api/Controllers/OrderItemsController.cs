using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class OrderItemsController : BaseCrudController<OrderItem>
{
    public OrderItemsController(AppDbContext context) : base(context) { }

    protected override IQueryable<OrderItem> IncludeRelationships(IQueryable<OrderItem> query)
    {
        return query.Include(oi => oi.Order)
                   .Include(oi => oi.Product);
    }
}