using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Origin { get; set; }

    public string Status { get; set; } = null!;

    public byte[]? ImageData { get; set; }

    public string? ImageMimeType { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [JsonIgnore]
    public virtual ICollection<ProductIngredient> ProductIngredients { get; set; } = new List<ProductIngredient>();

    public virtual ProductPrice? ProductPrice { get; set; }
}
