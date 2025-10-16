using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Order
{
    public int Id { get; set; }

    public DateTime OrderDate { get; set; }

    public int? CustomerId { get; set; }

    public string Channel { get; set; } = null!;

    public int? DiscountPolicyId { get; set; }

    public int TotalAmountVnd { get; set; }

    public string Status { get; set; } = null!;

    public virtual Customer? Customer { get; set; }

    public virtual DiscountPolicy? DiscountPolicy { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
