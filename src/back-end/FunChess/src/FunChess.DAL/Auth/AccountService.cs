using System.Net;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Auth.Services;
using FunChess.Core.Auth.Settings;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FunChess.DAL.Auth;

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

    public async Task DeleteAsync(Account account)
    {
        Context.Accounts.Remove(account);
        await Context.SaveChangesAsync();
    }

    public async Task<HttpStatusCode> UpdateAsync(Account account, AccountForm form)
    {
        bool hasChanges;
        try
        {
            hasChanges = UpdateUsername(account, form.Username) | 
                         UpdateEmail(account, form.Email) |
                         UpdatePassword(account, form.Password);
        }
        catch (ArgumentException)
        {
            return HttpStatusCode.BadRequest;
        }
        if (!hasChanges) return HttpStatusCode.NotModified;

        Context.Accounts.Update(account);
        await Context.SaveChangesAsync();

        return HttpStatusCode.OK;
    }

    private bool UpdatePassword(Account account, string? password)
    {
        if (password is null) return false;
        
        string newPassword = Account.GeneratePasswordHash(password, _passwordSettings.Pepper);
        account.PasswordHash = newPassword;

        return true;
    }

    private static bool UpdateUsername(Account account, string? username)
    {
        if (username is null) return false;
        
        account.Username = username;
        return true;
    }

    private static bool UpdateEmail(Account account, string? email)
    {
        if (email is null) return false;

        account.Email = email;
        return true;
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
}