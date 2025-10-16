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

    // GET: api/orders/{id}/detail
    [HttpGet("{id}/detail")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
        {
            return NotFound();
        }

        var items = order.OrderItems
            .OrderBy(oi => oi.Id)
            .Select(oi => new
            {
                productId = oi.ProductId,
                productName = oi.Product?.Name,
                quantity = oi.Quantity,
                unitPriceVnd = oi.UnitPriceVnd,
                lineTotalVnd = oi.LineTotalVnd ?? (oi.Quantity * oi.UnitPriceVnd)
            })
            .ToList();

        return Ok(new
        {
            id = order.Id,
            orderDate = order.OrderDate,
            channel = order.Channel,
            status = order.Status,
            totalAmountVnd = order.TotalAmountVnd,
            customer = new
            {
                id = order.CustomerId,
                name = order.Customer?.Name,
                phone = order.Customer?.Phone,
                address = order.Customer?.Address,
                email = order.Customer?.Email
            },
            paymentMethod = (string?)null, // not stored currently
            notes = (string?)null, // not stored currently
            items
        });
    }
    // GET: api/orders/customer/{customerId}
    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetByCustomer(int customerId)
    {
        var query = IncludeRelationships(_dbSet).Where(o => o.CustomerId == customerId);
        return await query.ToListAsync();
    }

    // DTOs for checkout flow
    public sealed class CheckoutItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int UnitPrice { get; set; }
    }

    public sealed class CheckoutRequestDto
    {
        public string? CustomerName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public string? PaymentMethod { get; set; }
        public List<CheckoutItemDto> Items { get; set; } = new();
    }

    // POST: api/orders/checkout
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto dto)
    {
        if (dto == null)
        {
            return BadRequest(new { detail = "Payload is required" });
        }
        if (dto.Items == null || dto.Items.Count == 0)
        {
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                { "items", new[]{ "At least one item is required" } }
            }));
        }
        foreach (var (item, index) in dto.Items.Select((it, i) => (it, i)))
        {
            if (item.ProductId <= 0)
            {
                ModelState.AddModelError($"items[{index}].productId", "productId must be > 0");
            }
            if (item.Quantity <= 0)
            {
                ModelState.AddModelError($"items[{index}].quantity", "quantity must be > 0");
            }
            if (item.UnitPrice <= 0)
            {
                ModelState.AddModelError($"items[{index}].unitPrice", "unitPrice must be > 0");
            }
        }
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var total = dto.Items.Sum(i => i.Quantity * i.UnitPrice);

        await using var tx = await _context.Database.BeginTransactionAsync();

        var customer = new Customer
        {
            Name = string.IsNullOrWhiteSpace(dto.CustomerName) ? "Guest" : dto.CustomerName!.Trim(),
            Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email!.Trim(),
            Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone!.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address!.Trim()
        };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var order = new Order
        {
            CustomerId = customer.Id,
            Channel = "Website",
            Status = "Pending",
            OrderDate = DateTime.UtcNow,
            TotalAmountVnd = total
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var it in dto.Items)
        {
            var oi = new OrderItem
            {
                OrderId = order.Id,
                ProductId = it.ProductId,
                Quantity = it.Quantity,
                UnitPriceVnd = it.UnitPrice
            };
            _context.OrderItems.Add(oi);
        }

        await _context.SaveChangesAsync();
        await tx.CommitAsync();

        return CreatedAtAction(nameof(GetByCustomer), new { customerId = customer.Id }, new
        {
            orderId = order.Id,
            customerId = customer.Id,
            totalAmountVnd = order.TotalAmountVnd,
            status = order.Status
        });
    }

    // POST: api/orders/{id}/approve
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        if (!string.Equals(order.Status, "Pending", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { detail = "Chỉ có thể duyệt đơn ở trạng thái Pending" });
        }
        order.Status = "Confirmed";
        await _context.SaveChangesAsync();
        return Ok(new { id = order.Id, status = order.Status });
    }

    // POST: api/orders/{id}/cancel
    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        if (!string.Equals(order.Status, "Pending", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { detail = "Chỉ có thể hủy đơn ở trạng thái Pending" });
        }
        order.Status = "Canceled";
        await _context.SaveChangesAsync();
        return Ok(new { id = order.Id, status = order.Status });
    }

    // PATCH: api/orders/{id}/status - for frontend compatibility
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
        {
            return BadRequest(new { detail = "Status is required" });
        }

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();

        var newStatus = dto.Status.Trim();
        var allowedStatuses = new[] { "Pending", "Confirmed", "Paid", "Shipping", "Completed", "Canceled" };
        
        if (!allowedStatuses.Contains(newStatus, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new { 
                detail = "Invalid status", 
                allowedValues = allowedStatuses 
            });
        }

        // Business logic: only allow certain transitions
        if (string.Equals(order.Status, "Pending", StringComparison.OrdinalIgnoreCase))
        {
            if (newStatus.Equals("Confirmed", StringComparison.OrdinalIgnoreCase) || 
                newStatus.Equals("Canceled", StringComparison.OrdinalIgnoreCase))
            {
                order.Status = newStatus;
            }
            else
            {
                return BadRequest(new { detail = "Chỉ có thể chuyển từ Pending sang Confirmed hoặc Canceled" });
            }
        }
        else if (string.Equals(order.Status, "Confirmed", StringComparison.OrdinalIgnoreCase))
        {
            if (newStatus.Equals("Paid", StringComparison.OrdinalIgnoreCase))
            {
                order.Status = newStatus;
            }
            else
            {
                return BadRequest(new { detail = "Chỉ có thể chuyển từ Confirmed sang Paid" });
            }
        }
        else if (string.Equals(order.Status, "Paid", StringComparison.OrdinalIgnoreCase))
        {
            if (newStatus.Equals("Shipping", StringComparison.OrdinalIgnoreCase))
            {
                order.Status = newStatus;
            }
            else
            {
                return BadRequest(new { detail = "Chỉ có thể chuyển từ Paid sang Shipping" });
            }
        }
        else if (string.Equals(order.Status, "Shipping", StringComparison.OrdinalIgnoreCase))
        {
            if (newStatus.Equals("Completed", StringComparison.OrdinalIgnoreCase))
            {
                order.Status = newStatus;
            }
            else
            {
                return BadRequest(new { detail = "Chỉ có thể chuyển từ Shipping sang Completed" });
            }
        }
        else
        {
            return BadRequest(new { detail = $"Không thể thay đổi trạng thái từ {order.Status}" });
        }

        await _context.SaveChangesAsync();
        return Ok(new { id = order.Id, status = order.Status });
    }

    public sealed class UpdateStatusDto
    {
        public string Status { get; set; } = null!;
    }
}
