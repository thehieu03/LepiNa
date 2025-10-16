using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Feedback
{
    public int Id { get; set; }

    public int? CustomerId { get; set; }

    public int? OrderId { get; set; }

    public byte Rating { get; set; }

    public string? Comment { get; set; }

    public string Channel { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual Order? Order { get; set; }
}
