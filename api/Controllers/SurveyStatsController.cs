using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;

namespace api.Controllers;

[Route("api/[controller]")]
public class SurveyStatsController : BaseCrudController<SurveyStat>
{
    public SurveyStatsController(AppDbContext context) : base(context) { }
}