using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Task
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int? OwnerId { get; set; }

    public string Status { get; set; } = null!;

    public string Category { get; set; } = null!;

    public DateOnly? DueDate { get; set; }

    public string? Details { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual TeamMember? Owner { get; set; }
}
