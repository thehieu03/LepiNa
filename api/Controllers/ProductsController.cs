using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using System.ComponentModel.DataAnnotations;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ProductsController(AppDbContext context) { _context = context; }

    // Override: return trimmed entity to avoid cycles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var list = await _context.Products
            .Include(p => p.ProductPrice)
            .Select(p => new
            {
                id = p.Id,
                name = p.Name,
                description = p.Description,
                origin = p.Origin,
                status = p.Status,
                price_vnd = p.ProductPrice != null && p.ProductPrice.IsActive ? (int?)p.ProductPrice.PriceVnd : null,
                currency = p.ProductPrice != null && p.ProductPrice.IsActive ? p.ProductPrice.Currency : null
            })
            .ToListAsync();
        return Ok(list);
    }

    // POST: api/products
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
    {
        if (dto == null)
        {
            return BadRequest(new { detail = "Payload is required" });
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            ModelState.AddModelError(nameof(dto.Name), "name is required");
        }
        if (dto.PriceVnd == null || dto.PriceVnd <= 0)
        {
            ModelState.AddModelError("price_vnd", "price_vnd/priceVnd must be > 0");
        }
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        byte[]? imageBytes = null;
        try
        {
            imageBytes = ParseBase64OrNull(dto.ImageData);
        }
        catch (ArgumentException)
        {
            return BadRequest(new { detail = "imageData không phải base64 hợp lệ" });
        }

		// Use a transaction to ensure Product and its ProductPrice are created atomically
		await using var tx = await _context.Database.BeginTransactionAsync();

		var product = new Product
		{
			Name = dto.Name!.Trim(),
			Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description!.Trim(),
			Origin = string.IsNullOrWhiteSpace(dto.Origin) ? null : dto.Origin!.Trim(),
			ImageMimeType = string.IsNullOrWhiteSpace(dto.ImageMimeType) ? null : dto.ImageMimeType!.Trim(),
			ImageData = imageBytes,
			CreatedAt = DateTime.UtcNow,
			UpdatedAt = DateTime.UtcNow
		};

		// Only set Status if provided and valid; otherwise let DB default
		if (!string.IsNullOrWhiteSpace(dto.Status))
		{
			var normalized = NormalizeProductStatus(dto.Status);
			if (normalized != null)
			{
				product.Status = normalized;
			}
			// if invalid label is provided, ignore here to allow DB default
		}

		_context.Products.Add(product);
		try
		{
			// Save Product first to get its Id persisted
			await _context.SaveChangesAsync();

			// handle price via ProductPrice (active) referencing the newly created ProductId
			var activePrice = new ProductPrice
			{
				ProductId = product.Id,
				PriceVnd = (int)Math.Round(dto.PriceVnd!.Value, MidpointRounding.AwayFromZero),
				Currency = "VND",
				EffectiveFrom = DateOnly.FromDateTime(DateTime.UtcNow.Date),
				EffectiveTo = null,
				IsActive = true
			};
			_context.ProductPrices.Add(activePrice);

			await _context.SaveChangesAsync();
			await tx.CommitAsync();
		}
		catch (DbUpdateException ex)
		{
			return MapDbUpdateError(ex, "product");
		}
        catch (Exception ex)
        {
            return StatusCode(500, new { detail = "Lỗi không xác định", error = ex.GetBaseException().Message });
        }

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ShapeProductResponse(product));
    }

    // PUT: api/products/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
    {
        var product = await _context.Products.Include(p => p.ProductPrice).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound();
        }

        if (dto == null)
        {
            return BadRequest(new { detail = "Payload is required" });
        }

        if (dto.PriceVnd.HasValue && dto.PriceVnd.Value <= 0)
        {
            ModelState.AddModelError("price_vnd", "price_vnd/priceVnd must be > 0");
        }
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (dto.Name != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { detail = "name is required" });
            }
            product.Name = dto.Name.Trim();
        }
        if (dto.Description != null)
        {
            product.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        }
        if (dto.Origin != null)
        {
            product.Origin = string.IsNullOrWhiteSpace(dto.Origin) ? null : dto.Origin.Trim();
        }
		if (dto.Status != null)
        {
			var normalized = NormalizeProductStatus(dto.Status);
			if (string.IsNullOrWhiteSpace(dto.Status) || normalized == null)
			{
				return BadRequest(new { detail = "status is invalid" });
			}
			product.Status = normalized;
        }

        if (dto.ImageData != null)
        {
            try
            {
                product.ImageData = ParseBase64OrNull(dto.ImageData);
            }
            catch (ArgumentException)
            {
                return BadRequest(new { detail = "imageData không phải base64 hợp lệ" });
            }
        }
        if (dto.ImageMimeType != null)
        {
            product.ImageMimeType = string.IsNullOrWhiteSpace(dto.ImageMimeType) ? null : dto.ImageMimeType.Trim();
        }

        if (dto.PriceVnd.HasValue)
        {
            // ensure an active ProductPrice exists and update its value
            var currentActive = await _context.ProductPrices.FirstOrDefaultAsync(pp => pp.ProductId == product.Id && pp.IsActive);
            if (currentActive == null)
            {
                currentActive = new ProductPrice
                {
                    ProductId = product.Id,
                    Currency = "VND",
                    EffectiveFrom = DateOnly.FromDateTime(DateTime.UtcNow.Date),
                    IsActive = true
                };
                _context.ProductPrices.Add(currentActive);
            }
            currentActive.PriceVnd = (int)Math.Round(dto.PriceVnd.Value, MidpointRounding.AwayFromZero);
        }

        product.UpdatedAt = DateTime.UtcNow;

		try
		{
            await _context.SaveChangesAsync();
        }
		catch (DbUpdateException ex)
		{
			return MapDbUpdateError(ex, "product");
		}
        catch (Exception ex)
        {
            return StatusCode(500, new { detail = "Lỗi không xác định", error = ex.GetBaseException().Message });
        }

        return Ok(ShapeProductResponse(product));
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _context.Products.Include(p => p.ProductPrice).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(ShapeProductResponse(product));
    }

    // GET: api/products/with-active-price
    [HttpGet("with-active-price")]
    public async Task<ActionResult<IEnumerable<VwProductsWithActivePrice>>> GetWithActivePrice()
    {
        return await _context.VwProductsWithActivePrices.ToListAsync();
    }

    private static byte[]? ParseBase64OrNull(string? base64)
    {
        if (string.IsNullOrWhiteSpace(base64)) return null;
        try
        {
            return Convert.FromBase64String(base64);
        }
        catch
        {
            throw new ArgumentException("Invalid base64");
        }
    }

		private object ShapeProductResponse(Product product)
    {
        var activePrice = _context.ProductPrices.FirstOrDefault(pp => pp.ProductId == product.Id && pp.IsActive);
        var priceVnd = activePrice?.PriceVnd;
        return new
        {
            id = product.Id,
            name = product.Name,
            description = product.Description,
            origin = product.Origin,
            status = product.Status,
            price_vnd = priceVnd,
            imageMimeType = product.ImageMimeType,
            imageData = product.ImageData == null ? null : Convert.ToBase64String(product.ImageData)
        };
    }

		private static string? NormalizeProductStatus(string? raw)
		{
			if (string.IsNullOrWhiteSpace(raw)) return null;
			var value = raw.Trim();
			// Accept known English codes directly (must match DB CHECK constraint)
			switch (value)
			{
				case "Testing":
				case "Draft":
				case "Launched":
					return value;
			}
			// Map common Vietnamese labels to DB codes
			var lowered = value.ToLowerInvariant();
			if (lowered is "thử nghiệm" or "thu nghiem" or "testing") return "Testing";
			if (lowered is "nháp" or "nhap" or "draft") return "Draft";
			if (lowered is "hoạt động" or "hoat dong" or "launched") return "Launched";
			return null;
		}

		private IActionResult MapDbUpdateError(DbUpdateException ex, string entityName)
		{
			var message = ex.GetBaseException().Message;
			// CHECK constraint on status column -> return friendly 400
			if (message.Contains("CHECK", StringComparison.OrdinalIgnoreCase) && message.Contains("status", StringComparison.OrdinalIgnoreCase))
			{
				return BadRequest(new
				{
					detail = $"Không lưu được {entityName}",
					reason = "Giá trị 'status' không hợp lệ. Cho phép: Draft, Testing, Launched",
					error = message
				});
			}
			// generic fallback
			return BadRequest(new { detail = $"Không lưu được {entityName}", error = message });
		}
}
