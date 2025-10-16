using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Controllers.Base;

[ApiController]
public abstract class BaseCompositeKeyController<T> : ControllerBase where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseCompositeKeyController(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    // GET: api/[controller]
    [HttpGet]
    public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
    {
        return await IncludeRelationships(_dbSet).ToListAsync();
    }

    // POST: api/[controller]
    [HttpPost]
    public virtual async Task<ActionResult<T>> Create(T entity)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), GetCompositeKey(entity), entity);
    }

    // PUT: api/[controller]/key1/key2
    [HttpPut("{*keys}")]
    public virtual async Task<IActionResult> Update(string keys, T entity)
    {
        var keyValues = keys.Split('/');
        var entityKeys = GetCompositeKey(entity);
        
        if (!AreKeysEqual(keyValues, entityKeys))
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
            if (!EntityExists(keys))
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

    // DELETE: api/[controller]/key1/key2
    [HttpDelete("{*keys}")]
    public virtual async Task<IActionResult> Delete(string keys)
    {
        var entity = await FindEntityByKeys(keys);
        if (entity == null)
        {
            return NotFound();
        }

        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Abstract methods cần được implement bởi derived classes
    protected abstract Task<T?> GetById(string keys);
    protected abstract Dictionary<string, object> GetCompositeKey(T entity);
    protected abstract Task<T?> FindEntityByKeys(string keys);
    protected abstract bool EntityExists(string keys);
    protected abstract bool AreKeysEqual(string[] routeKeys, Dictionary<string, object> entityKeys);

    // Virtual method để override Include relationships nếu cần
    protected virtual IQueryable<T> IncludeRelationships(IQueryable<T> query)
    {
        return query;
    }
}
