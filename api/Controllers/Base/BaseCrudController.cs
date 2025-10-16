using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Controllers.Base;

[ApiController]
public abstract class BaseCrudController<T> : ControllerBase where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseCrudController(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    // GET: api/[controller]
    [HttpGet]
    public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
    {
        return await _dbSet.ToListAsync();
    }

    // GET: api/[controller]/5
    [HttpGet("{id}")]
    public virtual async Task<ActionResult<T>> GetById(int id)
    {
        var entity = await _dbSet.FindAsync(id);

        if (entity == null)
        {
            return NotFound();
        }

        return entity;
    }

    // POST: api/[controller]
    [HttpPost]
    public virtual async Task<ActionResult<T>> Create(T entity)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = GetEntityId(entity) }, entity);
    }

    // PUT: api/[controller]/5
    [HttpPut("{id}")]
    public virtual async Task<IActionResult> Update(int id, T entity)
    {
        var entityId = GetEntityId(entity);
        if (id != entityId)
        {
            return BadRequest();
        }

        _context.Entry(entity).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EntityExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/[controller]/5
    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null)
        {
            return NotFound();
        }

        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Helper method để lấy ID của entity
    protected virtual int GetEntityId(T entity)
    {
        var idProperty = typeof(T).GetProperty("Id");
        if (idProperty != null && idProperty.CanRead)
        {
            return (int)idProperty.GetValue(entity)!;
        }
        throw new InvalidOperationException($"Entity {typeof(T).Name} does not have an Id property");
    }

    // Helper method để kiểm tra entity có tồn tại không
    protected virtual bool EntityExists(int id)
    {
        return _dbSet.Any(e => GetEntityId(e) == id);
    }

    // Virtual method để override Include relationships nếu cần
    protected virtual IQueryable<T> IncludeRelationships(IQueryable<T> query)
    {
        return query;
    }
}
