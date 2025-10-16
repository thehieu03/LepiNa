using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string CustomerType { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public string AgeGroup { get; set; } = null!;

    public string SourceChannel { get; set; } = null!;

    public string? Address { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
