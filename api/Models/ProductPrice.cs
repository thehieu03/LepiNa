using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models;

public partial class ProductPrice
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int PriceVnd { get; set; }

    public string Currency { get; set; } = null!;

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public bool IsActive { get; set; }

    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}
