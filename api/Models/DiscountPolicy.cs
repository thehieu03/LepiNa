using System;
using System.Collections.Generic;

namespace api.Models;

public partial class DiscountPolicy
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PolicyType { get; set; } = null!;

    public int? BuyQty { get; set; }

    public int? FreeQty { get; set; }

    public decimal? PercentOff { get; set; }

    public int? MinQty { get; set; }

    public string? Description { get; set; }

    public bool Active { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
