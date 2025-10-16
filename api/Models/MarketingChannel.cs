using System;
using System.Collections.Generic;

namespace api.Models;

public partial class MarketingChannel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string ChannelType { get; set; } = null!;

    public string? Url { get; set; }

    public byte[]? LogoData { get; set; }

    public string? LogoMimeType { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<ContentPost> ContentPosts { get; set; } = new List<ContentPost>();
}
