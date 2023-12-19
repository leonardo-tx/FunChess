using FunChess.Core.Client.Forms;

namespace FunChess.Core.Client.Services;

public interface IAccountService
{
    public Task AddAsync(Account account);

    public Task<bool> DeleteAsync(Account account, DeleteAccountForm form);

    public Task<bool> UpdateAsync(ulong id, UpdateAccountForm form);
    
    public Task<Account?> FindAsync(ulong id);

    public Task<Account?> FindAsync(string email);

    public Task<bool> ExistsAsync(ulong id);
    
    public Task<bool> ExistsAsync(string email);

    public bool VerifyPassword(Account account, string password);
}