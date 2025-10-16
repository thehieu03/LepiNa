using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class ProductsController : BaseCrudController<Product>
{
    public ProductsController(AppDbContext context) : base(context) { }

    // Override để thêm custom logic nếu cần
    public override async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        return await IncludeRelationships(_dbSet).ToListAsync();
    }

    protected override IQueryable<Product> IncludeRelationships(IQueryable<Product> query)
    {
        return query.Include(p => p.ProductPrice)
                   .Include(p => p.ProductIngredients)
                   .Include(p => p.OrderItems);
    }
}
