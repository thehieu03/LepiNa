using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Event
{
    public int Id { get; set; }

    public int? CampaignId { get; set; }

    public string Name { get; set; } = null!;

    public string EventType { get; set; } = null!;

    public DateTime StartDatetime { get; set; }

    public DateTime? EndDatetime { get; set; }

    public string? Location { get; set; }

    public string? Description { get; set; }

    public byte[]? ImageData { get; set; }

    public string? ImageMimeType { get; set; }

    public virtual Campaign? Campaign { get; set; }
}
