using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class ProductPricesController : BaseCrudController<ProductPrice>
{
    public ProductPricesController(AppDbContext context) : base(context) { }

    protected override IQueryable<ProductPrice> IncludeRelationships(IQueryable<ProductPrice> query)
    {
        return query.Include(pp => pp.Product);
    }
}