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


// Create/Update DTOs for Product creation/update compatible with camelCase and snake_case
public sealed class ProductCreateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Origin { get; set; }
    public string? Status { get; set; }

    // Accept both snake_case and camelCase
    [System.Text.Json.Serialization.JsonPropertyName("price_vnd")]
    public decimal? PriceVnd_Snake { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("priceVnd")]
    public decimal? PriceVnd_Camel { get; set; }

    public string? ImageData { get; set; }
    public string? ImageMimeType { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public decimal? PriceVnd => PriceVnd_Camel ?? PriceVnd_Snake;
}

public sealed class ProductUpdateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Origin { get; set; }
    public string? Status { get; set; }

    // Accept both snake_case and camelCase
    [System.Text.Json.Serialization.JsonPropertyName("price_vnd")]
    public decimal? PriceVnd_Snake { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("priceVnd")]
    public decimal? PriceVnd_Camel { get; set; }

    public string? ImageData { get; set; }
    public string? ImageMimeType { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public decimal? PriceVnd => PriceVnd_Camel ?? PriceVnd_Snake;
}


