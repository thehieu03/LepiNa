using System;
using System.Collections.Generic;

namespace api.Models;

public partial class SurveyStat
{
    public int Id { get; set; }

    public string Dimension { get; set; } = null!;

    public string OptionLabel { get; set; } = null!;

    public decimal Percentage { get; set; }

    public int? SampleSize { get; set; }

    public string? Source { get; set; }

    public DateOnly? CollectedOn { get; set; }
}
