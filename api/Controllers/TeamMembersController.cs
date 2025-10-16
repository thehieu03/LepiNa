using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class TeamMembersController : BaseCrudController<TeamMember>
{
    public TeamMembersController(AppDbContext context) : base(context) { }
}