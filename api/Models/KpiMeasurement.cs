using System;
using System.Collections.Generic;

namespace api.Models;

public partial class KpiMeasurement
{
    public int Id { get; set; }

    public int KpiId { get; set; }

    public int? CampaignId { get; set; }

    public DateOnly MeasureDate { get; set; }

    public int? WeekNumber { get; set; }

    public decimal Value { get; set; }

    public string? Notes { get; set; }

    public virtual Campaign? Campaign { get; set; }

    public virtual KpiDefinition Kpi { get; set; } = null!;
}
