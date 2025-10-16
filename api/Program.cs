
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var configuration = builder.Configuration;
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            // Avoid serialization errors from EF Core navigation cycles
            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        });
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(o =>
        {
            o.CustomSchemaIds(t => t.FullName);
        });
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowVite5173", policy =>
            {
                policy.WithOrigins(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("MyCnn");
            options.UseSqlServer(connectionString);
        });
        var jwtSection = configuration.GetSection("Jwt");
        var jwtKey = jwtSection["Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException("JWT Key is not configured. Set Jwt:Key in appsettings.");
        }
        var keyBytes = System.Text.Encoding.UTF8.GetBytes(jwtKey);
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtSection["Issuer"],
                ValidAudience = jwtSection["Audience"],
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(keyBytes)
            };
        });

        var app = builder.Build();
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(options=>{
            options.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });

        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}
