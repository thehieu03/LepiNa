using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class IngredientsController : BaseCrudController<Ingredient>
{
    public IngredientsController(AppDbContext context) : base(context) { }

    protected override IQueryable<Ingredient> IncludeRelationships(IQueryable<Ingredient> query)
    {
        return query.Include(i => i.ProductIngredients);
    }
}