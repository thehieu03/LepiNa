using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class ProductIngredientsController : BaseCompositeKeyController<ProductIngredient>
{
    public ProductIngredientsController(AppDbContext context) : base(context) { }

    // GET: api/ProductIngredients/5/3 (ProductId/IngredientId)
    [HttpGet("{productId}/{ingredientId}")]
    public async Task<ActionResult<ProductIngredient>> GetByCompositeKey(int productId, int ingredientId)
    {
        var productIngredient = await IncludeRelationships(_dbSet)
            .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.IngredientId == ingredientId);

        if (productIngredient == null)
        {
            return NotFound();
        }

        return productIngredient;
    }

    protected override async Task<ProductIngredient?> GetById(string keys)
    {
        var keyValues = keys.Split('/');
        if (keyValues.Length != 2 || !int.TryParse(keyValues[0], out int productId) || !int.TryParse(keyValues[1], out int ingredientId))
        {
            return null;
        }

        return await IncludeRelationships(_dbSet)
            .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.IngredientId == ingredientId);
    }

    protected override Dictionary<string, object> GetCompositeKey(ProductIngredient entity)
    {
        return new Dictionary<string, object>
        {
            { "productId", entity.ProductId },
            { "ingredientId", entity.IngredientId }
        };
    }

    protected override async Task<ProductIngredient?> FindEntityByKeys(string keys)
    {
        var keyValues = keys.Split('/');
        if (keyValues.Length != 2 || !int.TryParse(keyValues[0], out int productId) || !int.TryParse(keyValues[1], out int ingredientId))
        {
            return null;
        }

        return await _dbSet.FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.IngredientId == ingredientId);
    }

    protected override bool EntityExists(string keys)
    {
        var keyValues = keys.Split('/');
        if (keyValues.Length != 2 || !int.TryParse(keyValues[0], out int productId) || !int.TryParse(keyValues[1], out int ingredientId))
        {
            return false;
        }

        return _dbSet.Any(pi => pi.ProductId == productId && pi.IngredientId == ingredientId);
    }

    protected override bool AreKeysEqual(string[] routeKeys, Dictionary<string, object> entityKeys)
    {
        if (routeKeys.Length != 2)
            return false;

        return routeKeys[0] == entityKeys["productId"].ToString() &&
               routeKeys[1] == entityKeys["ingredientId"].ToString();
    }

    protected override IQueryable<ProductIngredient> IncludeRelationships(IQueryable<ProductIngredient> query)
    {
        return query.Include(pi => pi.Product)
                   .Include(pi => pi.Ingredient);
    }
}