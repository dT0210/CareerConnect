namespace Backend.Infrastructure.Repositories.Interfaces;

public interface IGenericRepository<T> where T : class {
    IQueryable<T> GetAllQueryable();
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task InsertAsync(T obj);
    void Update(T obj);
    Task DeleteAsync(Guid id);
    Task SaveAsync();
    Task ExecuteInTransactionAsync(Func<Task> action);
}