using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Controllers.Base;
using TaskEntity = api.Models.Task;

namespace api.Controllers;

[Route("api/[controller]")]
public class TasksController : BaseCrudController<TaskEntity>
{
    public TasksController(AppDbContext context) : base(context) { }

    protected override IQueryable<TaskEntity> IncludeRelationships(IQueryable<TaskEntity> query)
    {
        return query.Include(t => t.Owner);
    }
}