namespace api.Models;

public sealed class ProductListItemDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Origin { get; set; }
    public string? Status { get; set; }
    public decimal? PriceVnd { get; set; }
    public string? Currency { get; set; }
}

public sealed class ProductDetailDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Origin { get; set; }
    public string? Status { get; set; }
    public decimal? PriceVnd { get; set; }
    public string? Currency { get; set; }
    public List<ProductIngredientDto> Ingredients { get; set; } = new();
}

public sealed class ProductIngredientDto
{
    public int IngredientId { get; set; }
    public string? IngredientName { get; set; }
    public decimal? Percent { get; set; }
}


