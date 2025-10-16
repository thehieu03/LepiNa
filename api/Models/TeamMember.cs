using System;
using System.Collections.Generic;

namespace api.Models;

public partial class TeamMember
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Responsibilities { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
