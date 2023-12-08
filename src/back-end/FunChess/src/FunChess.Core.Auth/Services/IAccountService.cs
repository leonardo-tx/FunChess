using System.Net;
using FunChess.Core.Auth.Forms;

namespace FunChess.Core.Auth.Services;

public interface IAccountService
{
    public Task AddAsync(Account account);

    public Task DeleteAsync(Account account);

    public Task<HttpStatusCode> UpdateAsync(Account account, AccountForm form);
    
    public Task<Account?> FindAsync(ulong id);

    public Task<Account?> FindAsync(string email);

    public Task<bool> ExistsAsync(ulong id);
    
    public Task<bool> ExistsAsync(string email);
}