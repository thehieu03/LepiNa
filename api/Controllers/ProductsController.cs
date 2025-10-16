using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;
using System.ComponentModel.DataAnnotations;

namespace api.Controllers;

[Route("api/[controller]")]
public class ProductsController : BaseCrudController<Product>
{
    public ProductsController(AppDbContext context) : base(context) { }

    // Override: return trimmed entity to avoid cycles
    public override async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var list = await _context.Products
            .Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Origin = p.Origin,
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();
        return list;
    }

    // PUT: api/products/{id}
    // Accepts Product-shaped payload and only updates allowed fields per requirements
    [HttpPut("{id}")]
    public override async Task<IActionResult> Update(int id, Product payload)
    {
        if (payload == null)
        {
            return BadRequest(new { error = "Payload is required" });
        }

        if (string.IsNullOrWhiteSpace(payload.Name))
        {
            ModelState.AddModelError(nameof(payload.Name), "Name is required");
        }
        if (string.IsNullOrWhiteSpace(payload.Status))
        {
            ModelState.AddModelError(nameof(payload.Status), "Status is required");
        }
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        product.Name = payload.Name;
        product.Description = payload.Description;
        product.Origin = payload.Origin;
        product.Status = payload.Status;

        // Only update image when both are provided
        if (payload.ImageData != null && !string.IsNullOrWhiteSpace(payload.ImageMimeType))
        {
            product.ImageData = payload.ImageData;
            product.ImageMimeType = payload.ImageMimeType;
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(product);
    }

    protected override IQueryable<Product> IncludeRelationships(IQueryable<Product> query)
    {
        return query.Include(p => p.ProductPrice)
                   .Include(p => p.ProductIngredients)
                   .Include(p => p.OrderItems);
    }

    // Use base GetById which returns the entity without heavy navigation graph

    // GET: api/products/with-active-price
    [HttpGet("with-active-price")]
    public async Task<ActionResult<IEnumerable<VwProductsWithActivePrice>>> GetWithActivePrice()
    {
        return await _context.VwProductsWithActivePrices.ToListAsync();
    }
}
