using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly CareerConnectContext _dbContext;
    public GenericRepository(CareerConnectContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IEnumerable<T> GetAll()
    {
        return _dbContext.Set<T>().ToList();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbContext.Set<T>().ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Set<T>().FindAsync(id);
    }

    public async Task InsertAsync(T obj)
    {
        await _dbContext.Set<T>().AddAsync(obj);
    }

    public void Update(T obj)
    {
        _dbContext.Set<T>().Update(obj);
    }

    public async Task DeleteAsync(Guid id)
    {
        var obj = await _dbContext.Set<T>().FindAsync(id);
        if (obj != null)
        {
            _dbContext.Set<T>().Remove(obj);
        }
    }
    public async Task SaveAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public IQueryable<T> GetAllQueryable()
    {
        return _dbContext.Set<T>();
    }

    public async Task ExecuteInTransactionAsync(Func<Task> action)
    {
        if (_dbContext.Database.CurrentTransaction != null)
        {
            // If a transaction is already in progress, just execute the action
            await action();
            return;
        }

        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            await action();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}