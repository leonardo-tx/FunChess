using System.Net;
using FunChess.Core.Auth.Forms;

namespace FunChess.Core.Auth.Repositories;

public interface IAccountManager
{
    public Task Add(Account account);

    public Task Delete(Account account);

    public Task<HttpStatusCode> Update(Account account, AccountForm form);
    
    public Task<Account?> FindAccount(ulong id);

    public Task<Account?> FindAccount(string email);

    public Task<bool> Exists(ulong id);
    
    public Task<bool> Exists(string email);
}