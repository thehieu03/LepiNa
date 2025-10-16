using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class CustomersController : BaseCrudController<Customer>
{
    public CustomersController(AppDbContext context) : base(context) { }

    protected override IQueryable<Customer> IncludeRelationships(IQueryable<Customer> query)
    {
        return query.Include(c => c.Orders)
                   .Include(c => c.Feedbacks);
    }
}
