using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public record LoginRequest(string username, string password);
    public record TokenResponse(string access_token, int expires_in);

    [HttpPost("token")]
    public ActionResult<TokenResponse> Token([FromBody] LoginRequest request)
    {
        // NOTE: Replace with real user validation against your datastore
        if (string.IsNullOrWhiteSpace(request.username) || string.IsNullOrWhiteSpace(request.password))
        {
            return Unauthorized();
        }

        var jwtSection = _configuration.GetSection("Jwt");
        var key = jwtSection["Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];
        var expiresMinutes = int.TryParse(jwtSection["ExpiresMinutes"], out var m) ? m : 120;

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, request.username),
            new Claim(ClaimTypes.Name, request.username),
            // In real app, set proper role from DB
            new Claim(ClaimTypes.Role, "admin")
        };

        var expires = DateTime.UtcNow.AddMinutes(expiresMinutes);
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new TokenResponse(accessToken, (int)TimeSpan.FromMinutes(expiresMinutes).TotalSeconds));
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] object _)
    {
        // Stub: accept any registration. Replace with real creation logic.
        return Ok();
    }

    [HttpPost("refresh")]
    public ActionResult<TokenResponse> Refresh()
    {
        // Stub refresh: issue a new token for current user if authenticated
        var username = User.Identity?.Name ?? "guest";
        var jwtSection = _configuration.GetSection("Jwt");
        var key = jwtSection["Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];
        var expiresMinutes = int.TryParse(jwtSection["ExpiresMinutes"], out var m) ? m : 120;

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "admin")
        };

        var expires = DateTime.UtcNow.AddMinutes(expiresMinutes);
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new TokenResponse(accessToken, (int)TimeSpan.FromMinutes(expiresMinutes).TotalSeconds));
    }
}


