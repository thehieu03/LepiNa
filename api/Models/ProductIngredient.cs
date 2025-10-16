using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models;

public partial class ProductIngredient
{
    public int ProductId { get; set; }

    public int IngredientId { get; set; }

    public decimal? Percent { get; set; }

    public string? Notes { get; set; }

    public virtual Ingredient Ingredient { get; set; } = null!;

    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}
