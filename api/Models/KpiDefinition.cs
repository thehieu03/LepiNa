using System;
using System.Collections.Generic;

namespace api.Models;

public partial class KpiDefinition
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Unit { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<KpiMeasurement> KpiMeasurements { get; set; } = new List<KpiMeasurement>();
}
