using System;
using System.Collections.Generic;

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

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<ProductIngredient> ProductIngredients { get; set; } = new List<ProductIngredient>();

    public virtual ProductPrice? ProductPrice { get; set; }
}
