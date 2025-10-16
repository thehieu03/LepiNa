using System;
using System.Collections.Generic;

namespace api.Models;

public partial class VwProductsWithActivePrice
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Origin { get; set; }

    public string Status { get; set; } = null!;

    public int? PriceVnd { get; set; }

    public string? Currency { get; set; }
}
