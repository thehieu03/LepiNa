using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Campaign
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<KpiMeasurement> KpiMeasurements { get; set; } = new List<KpiMeasurement>();

    public virtual ICollection<WeeklyTarget> WeeklyTargets { get; set; } = new List<WeeklyTarget>();
}
