using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Campaign> Campaigns { get; set; }

    public virtual DbSet<ContentPost> ContentPosts { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<DiscountPolicy> DiscountPolicies { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Ingredient> Ingredients { get; set; }

    public virtual DbSet<KpiDefinition> KpiDefinitions { get; set; }

    public virtual DbSet<KpiMeasurement> KpiMeasurements { get; set; }

    public virtual DbSet<MarketingChannel> MarketingChannels { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductIngredient> ProductIngredients { get; set; }

    public virtual DbSet<ProductPrice> ProductPrices { get; set; }

    public virtual DbSet<SurveyStat> SurveyStats { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TeamMember> TeamMembers { get; set; }

    public virtual DbSet<VwProductsWithActivePrice> VwProductsWithActivePrices { get; set; }

    public virtual DbSet<WeeklyTarget> WeeklyTargets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=THEHIEU;Database=lepina;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Vietnamese_100_CI_AS");

        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.StartDate).HasColumnName("startDate");
        });

        modelBuilder.Entity<ContentPost>(entity =>
        {
            entity.HasIndex(e => e.PostDate, "IX_ContentPosts_Date");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ChannelId).HasColumnName("channelId");
            entity.Property(e => e.Comments).HasColumnName("comments");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.ImageData).HasColumnName("imageData");
            entity.Property(e => e.ImageMimeType)
                .HasMaxLength(100)
                .HasColumnName("imageMimeType");
            entity.Property(e => e.Likes).HasColumnName("likes");
            entity.Property(e => e.PostDate)
                .HasPrecision(3)
                .HasColumnName("postDate");
            entity.Property(e => e.Reach).HasColumnName("reach");
            entity.Property(e => e.Shares).HasColumnName("shares");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
            entity.Property(e => e.Url)
                .HasMaxLength(512)
                .HasColumnName("url");
            entity.Property(e => e.Views).HasColumnName("views");

            entity.HasOne(d => d.Channel).WithMany(p => p.ContentPosts)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("FK_CP_Channel");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.AgeGroup)
                .HasMaxLength(10)
                .HasDefaultValue("Unknown")
                .HasColumnName("ageGroup");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.CustomerType)
                .HasMaxLength(20)
                .HasDefaultValue("Individual")
                .HasColumnName("customerType");
            entity.Property(e => e.Email)
                .HasMaxLength(160)
                .HasColumnName("email");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasDefaultValue("Unknown")
                .HasColumnName("gender");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.Phone)
                .HasMaxLength(40)
                .HasColumnName("phone");
            entity.Property(e => e.SourceChannel)
                .HasMaxLength(20)
                .HasDefaultValue("Other")
                .HasColumnName("sourceChannel");
        });

        modelBuilder.Entity<DiscountPolicy>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
            entity.Property(e => e.BuyQty).HasColumnName("buyQty");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.FreeQty).HasColumnName("freeQty");
            entity.Property(e => e.MinQty).HasColumnName("minQty");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.PercentOff)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("percentOff");
            entity.Property(e => e.PolicyType)
                .HasMaxLength(20)
                .HasColumnName("policyType");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasIndex(e => e.StartDatetime, "IX_Events_Start");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaignId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDatetime)
                .HasPrecision(3)
                .HasColumnName("endDatetime");
            entity.Property(e => e.EventType)
                .HasMaxLength(20)
                .HasDefaultValue("Other")
                .HasColumnName("eventType");
            entity.Property(e => e.ImageData).HasColumnName("imageData");
            entity.Property(e => e.ImageMimeType)
                .HasMaxLength(100)
                .HasColumnName("imageMimeType");
            entity.Property(e => e.Location)
                .HasMaxLength(255)
                .HasColumnName("location");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.StartDatetime)
                .HasPrecision(3)
                .HasColumnName("startDatetime");

            entity.HasOne(d => d.Campaign).WithMany(p => p.Events)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Ev_Campaign");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.ToTable("Feedback");

            entity.HasIndex(e => new { e.CustomerId, e.CreatedAt }, "IX_Feedback_Customer").IsDescending(false, true);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Channel)
                .HasMaxLength(20)
                .HasDefaultValue("Website")
                .HasColumnName("channel");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.Rating).HasColumnName("rating");

            entity.HasOne(d => d.Customer).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_FB_Customer");

            entity.HasOne(d => d.Order).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_FB_Order");
        });

        modelBuilder.Entity<Ingredient>(entity =>
        {
            entity.HasIndex(e => e.Name, "UQ_Ingredients_Name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.Kind)
                .HasMaxLength(20)
                .HasDefaultValue("Other")
                .HasColumnName("kind");
            entity.Property(e => e.Name)
                .HasMaxLength(120)
                .HasColumnName("name");
            entity.Property(e => e.Notes).HasColumnName("notes");
        });

        modelBuilder.Entity<KpiDefinition>(entity =>
        {
            entity.HasIndex(e => e.Code, "UQ_KpiDefinitions_Code").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.Unit)
                .HasMaxLength(40)
                .HasColumnName("unit");
        });

        modelBuilder.Entity<KpiMeasurement>(entity =>
        {
            entity.HasIndex(e => e.MeasureDate, "IX_KpiMeasurements_Date");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaignId");
            entity.Property(e => e.KpiId).HasColumnName("kpiId");
            entity.Property(e => e.MeasureDate).HasColumnName("measureDate");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Value)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("value");
            entity.Property(e => e.WeekNumber).HasColumnName("weekNumber");

            entity.HasOne(d => d.Campaign).WithMany(p => p.KpiMeasurements)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_KM_Campaign");

            entity.HasOne(d => d.Kpi).WithMany(p => p.KpiMeasurements)
                .HasForeignKey(d => d.KpiId)
                .HasConstraintName("FK_KM_Kpi");
        });

        modelBuilder.Entity<MarketingChannel>(entity =>
        {
            entity.HasIndex(e => e.Name, "UQ_MarketingChannels_Name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ChannelType)
                .HasMaxLength(20)
                .HasDefaultValue("Other")
                .HasColumnName("channelType");
            entity.Property(e => e.LogoData).HasColumnName("logoData");
            entity.Property(e => e.LogoMimeType)
                .HasMaxLength(100)
                .HasColumnName("logoMimeType");
            entity.Property(e => e.Name)
                .HasMaxLength(120)
                .HasColumnName("name");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Url)
                .HasMaxLength(512)
                .HasColumnName("url");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => new { e.CustomerId, e.OrderDate }, "IX_Orders_Customer").IsDescending(false, true);

            entity.HasIndex(e => e.OrderDate, "IX_Orders_Date");

            entity.HasIndex(e => new { e.Status, e.OrderDate }, "IX_Orders_Status_Date").IsDescending(false, true);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Channel)
                .HasMaxLength(20)
                .HasDefaultValue("Website")
                .HasColumnName("channel");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.DiscountPolicyId).HasColumnName("discountPolicyId");
            entity.Property(e => e.OrderDate)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("orderDate");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending")
                .HasColumnName("status");
            entity.Property(e => e.TotalAmountVnd).HasColumnName("totalAmountVnd");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Orders_Customer");

            entity.HasOne(d => d.DiscountPolicy).WithMany(p => p.Orders)
                .HasForeignKey(d => d.DiscountPolicyId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Orders_Discount");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable(tb => tb.HasTrigger("trg_Orders_Recalc"));

            entity.HasIndex(e => e.OrderId, "IX_OrderItems_Order");

            entity.HasIndex(e => e.ProductId, "IX_OrderItems_Product");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LineTotalVnd)
                .HasComputedColumnSql("([quantity]*[unitPriceVnd])", true)
                .HasColumnName("lineTotalVnd");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.UnitPriceVnd).HasColumnName("unitPriceVnd");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_OI_Order");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OI_Product");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable(tb => tb.HasTrigger("trg_Products_Touch"));

            entity.HasIndex(e => e.Name, "UQ_Products_Name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ImageData).HasColumnName("imageData");
            entity.Property(e => e.ImageMimeType)
                .HasMaxLength(100)
                .HasColumnName("imageMimeType");
            entity.Property(e => e.Name)
                .HasMaxLength(120)
                .HasColumnName("name");
            entity.Property(e => e.Origin).HasColumnName("origin");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Testing")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("updatedAt");
        });

        modelBuilder.Entity<ProductIngredient>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.IngredientId });

            entity.HasIndex(e => e.IngredientId, "IX_PI_Ingredient");

            entity.Property(e => e.ProductId).HasColumnName("productId");
            entity.Property(e => e.IngredientId).HasColumnName("ingredientId");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Percent)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("percent");

            entity.HasOne(d => d.Ingredient).WithMany(p => p.ProductIngredients)
                .HasForeignKey(d => d.IngredientId)
                .HasConstraintName("FK_PI_Ingredient");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductIngredients)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_PI_Product");
        });

        modelBuilder.Entity<ProductPrice>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.IsActive, e.EffectiveFrom }, "IX_ProductPrices_Active");

            entity.HasIndex(e => e.ProductId, "UX_ProductPrices_OneActive")
                .IsUnique()
                .HasFilter("([isActive]=(1))");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasDefaultValue("VND")
                .HasColumnName("currency");
            entity.Property(e => e.EffectiveFrom).HasColumnName("effectiveFrom");
            entity.Property(e => e.EffectiveTo).HasColumnName("effectiveTo");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.PriceVnd).HasColumnName("priceVnd");
            entity.Property(e => e.ProductId).HasColumnName("productId");

            entity.HasOne(d => d.Product).WithOne(p => p.ProductPrice)
                .HasForeignKey<ProductPrice>(d => d.ProductId)
                .HasConstraintName("FK_PP_Product");
        });

        modelBuilder.Entity<SurveyStat>(entity =>
        {
            entity.HasIndex(e => new { e.Dimension, e.OptionLabel }, "UQ_Survey").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CollectedOn).HasColumnName("collectedOn");
            entity.Property(e => e.Dimension)
                .HasMaxLength(60)
                .HasColumnName("dimension");
            entity.Property(e => e.OptionLabel)
                .HasMaxLength(120)
                .HasColumnName("optionLabel");
            entity.Property(e => e.Percentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("percentage");
            entity.Property(e => e.SampleSize).HasColumnName("sampleSize");
            entity.Property(e => e.Source)
                .HasMaxLength(255)
                .HasColumnName("source");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Category)
                .HasMaxLength(20)
                .HasDefaultValue("Other")
                .HasColumnName("category");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("createdAt");
            entity.Property(e => e.Details).HasColumnName("details");
            entity.Property(e => e.DueDate).HasColumnName("dueDate");
            entity.Property(e => e.OwnerId).HasColumnName("ownerId");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Todo")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Owner).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.OwnerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Task_Owner");
        });

        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(160)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(160)
                .HasColumnName("fullName");
            entity.Property(e => e.Phone)
                .HasMaxLength(40)
                .HasColumnName("phone");
            entity.Property(e => e.Responsibilities).HasColumnName("responsibilities");
            entity.Property(e => e.Title)
                .HasMaxLength(160)
                .HasColumnName("title");
        });

        modelBuilder.Entity<VwProductsWithActivePrice>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ProductsWithActivePrice");

            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasColumnName("currency");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(120)
                .HasColumnName("name");
            entity.Property(e => e.Origin).HasColumnName("origin");
            entity.Property(e => e.PriceVnd).HasColumnName("priceVnd");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
        });

        modelBuilder.Entity<WeeklyTarget>(entity =>
        {
            entity.HasIndex(e => new { e.CampaignId, e.WeekNumber }, "UQ_WeeklyTargets_CampaignWeek").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaignId");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.PrimaryActivity)
                .HasMaxLength(255)
                .HasColumnName("primaryActivity");
            entity.Property(e => e.ProjectedFeedback).HasColumnName("projectedFeedback");
            entity.Property(e => e.ProjectedOrders).HasColumnName("projectedOrders");
            entity.Property(e => e.ProjectedReach).HasColumnName("projectedReach");
            entity.Property(e => e.ProjectedRevenueVnd).HasColumnName("projectedRevenueVnd");
            entity.Property(e => e.ProjectedTraffic).HasColumnName("projectedTraffic");
            entity.Property(e => e.ProjectedTrialUsers).HasColumnName("projectedTrialUsers");
            entity.Property(e => e.WeekNumber).HasColumnName("weekNumber");

            entity.HasOne(d => d.Campaign).WithMany(p => p.WeeklyTargets)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK_WT_Campaign");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
