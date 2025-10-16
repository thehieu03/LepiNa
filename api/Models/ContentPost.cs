using System;
using System.Collections.Generic;

namespace api.Models;

public partial class ContentPost
{
    public int Id { get; set; }

    public int ChannelId { get; set; }

    public string Title { get; set; } = null!;

    public string? Content { get; set; }

    public DateTime PostDate { get; set; }

    public string? Url { get; set; }

    public byte[]? ImageData { get; set; }

    public string? ImageMimeType { get; set; }

    public int? Views { get; set; }

    public int? Reach { get; set; }

    public int? Likes { get; set; }

    public int? Comments { get; set; }

    public int? Shares { get; set; }

    public virtual MarketingChannel Channel { get; set; } = null!;
}
