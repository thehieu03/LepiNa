using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class KpiDefinitionsController : BaseCrudController<KpiDefinition>
{
    public KpiDefinitionsController(AppDbContext context) : base(context) { }
}