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

    // GET: api/orderitems/order/{orderId}
    [HttpGet("order/{orderId}")]
    public async Task<ActionResult<IEnumerable<OrderItem>>> GetByOrder(int orderId)
    {
        var query = IncludeRelationships(_dbSet).Where(oi => oi.OrderId == orderId);
        return await query.ToListAsync();
    }
}