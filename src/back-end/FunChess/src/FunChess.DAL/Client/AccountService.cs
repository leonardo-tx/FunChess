using FunChess.Core.Client;
using FunChess.Core.Client.Forms;
using FunChess.Core.Client.Services;
using FunChess.Core.Client.Settings;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FunChess.DAL.Client;

public sealed class AccountService : GenericDbService, IAccountService
{
    public AccountService(DatabaseContext context, IOptions<PasswordSettings> passwordSettings): base(context)
    {
        _passwordSettings = passwordSettings.Value;
    }
    
    private readonly PasswordSettings _passwordSettings;
    
    public async Task AddAsync(Account account)
    {
        await Context.Accounts.AddAsync(account);
        await Context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(Account account, DeleteAccountForm form)
    {
        if (form.CurrentPassword is null || account.VerifyPassword(form.CurrentPassword, _passwordSettings.Pepper)) return false;
        
        IEnumerable<Friendship> friendships = Context.Friendships.Where(friendship => friendship.FriendId == account.Id);
        IEnumerable<FriendshipRequest> requests = Context.FriendshipRequests.Where(request => request.FriendId == account.Id);
        
        Context.Friendships.RemoveRange(friendships);
        Context.FriendshipRequests.RemoveRange(requests);
        Context.Accounts.Remove(account);
        
        await Context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateAsync(ulong id, UpdateAccountForm form)
    {
        Account? account = await Context.Accounts.FindAsync(id);
        
        if (account is null || form.CurrentPassword is null) return false;
        if (!account.VerifyPassword(form.CurrentPassword, _passwordSettings.Pepper)) return false;
        
        UpdateUsername(account, form.Username);
        UpdateEmail(account, form.Email);
        UpdatePassword(account, form.Password);

        Context.Accounts.Update(account);
        await Context.SaveChangesAsync();

        return true;
    }

    private void UpdatePassword(Account account, string? password)
    {
        if (password is null) return;
        
        string newPassword = Account.GeneratePasswordHash(password, _passwordSettings.Pepper);
        account.PasswordHash = newPassword;
    }

    private static void UpdateUsername(Account account, string? username)
    {
        if (username is null) return;
        
        account.Username = username;
    }

    private static void UpdateEmail(Account account, string? email)
    {
        if (email is null) return;

        account.Email = email;
    }

    public async Task<Account?> FindAsync(ulong id)
    {
        return await Context.Accounts.FindAsync(id);
    }
    
    public async Task<Account?> FindAsync(string email)
    {
        return await Context.Accounts.FirstOrDefaultAsync(account => account.Email == email);
    }

    public async Task<bool> ExistsAsync(ulong id)
    {
        return await Context.Accounts.AnyAsync(account => account.Id == id);
    }
    
    public async Task<bool> ExistsAsync(string email)
    {
        return await Context.Accounts.AnyAsync(account => account.Email == email);
    }

    public bool VerifyPassword(Account account, string password)
    {
        return account.VerifyPassword(password, _passwordSettings.Pepper);
    }
}