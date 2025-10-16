using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VwProductsWithActivePricesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VwProductsWithActivePricesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/VwProductsWithActivePrices
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VwProductsWithActivePrice>>> GetVwProductsWithActivePrices()
    {
        return await _context.VwProductsWithActivePrices.ToListAsync();
    }

    // GET: api/VwProductsWithActivePrices/5
    [HttpGet("{id}")]
    public async Task<ActionResult<VwProductsWithActivePrice>> GetVwProductsWithActivePrice(int id)
    {
        var vwProductsWithActivePrice = await _context.VwProductsWithActivePrices
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vwProductsWithActivePrice == null)
        {
            return NotFound();
        }

        return vwProductsWithActivePrice;
    }

    // Note: View tables are typically read-only, so we don't implement POST, PUT, DELETE
    // If you need to modify the underlying data, use the ProductsController and ProductPricesController
}
