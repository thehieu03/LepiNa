using System;
using System.Collections.Generic;

namespace api.Models;

public partial class WeeklyTarget
{
    public int Id { get; set; }

    public int CampaignId { get; set; }

    public int WeekNumber { get; set; }

    public string? PrimaryActivity { get; set; }

    public int? ProjectedOrders { get; set; }

    public int? ProjectedRevenueVnd { get; set; }

    public int? ProjectedTrialUsers { get; set; }

    public int? ProjectedReach { get; set; }

    public int? ProjectedTraffic { get; set; }

    public int? ProjectedFeedback { get; set; }

    public string? Notes { get; set; }

    public virtual Campaign Campaign { get; set; } = null!;
}
