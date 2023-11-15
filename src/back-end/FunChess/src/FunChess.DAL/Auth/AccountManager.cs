using System.Net;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Auth.Settings;
using FunChess.Core.Responses;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FunChess.DAL.Auth;

public sealed class AccountManager : GenericDatabaseRepository, IAccountManager
{
    public AccountManager(DatabaseContext context, ITokenManager tokenManager, IOptions<PasswordSettings> passwordSettings): base(context)
    {
        _tokenManager = tokenManager;
        _passwordSettings = passwordSettings.Value;
    }

    private readonly ITokenManager _tokenManager;
    
    private readonly PasswordSettings _passwordSettings;
    
    public async Task Add(Account account)
    {
        await Context.Accounts.AddAsync(account);
        await Context.SaveChangesAsync();
    }

    public async Task Delete(Account account)
    {
        Context.Accounts.Remove(account);
        await Context.SaveChangesAsync();
    }

    public async Task<HttpStatusCode> Update(Account account, AccountForm form)
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

    public async Task<Account?> FindAccount(ulong id)
    {
        return await Context.Accounts.FindAsync(id);
    }
    
    public async Task<Account?> FindAccount(string email)
    {
        return await Context.Accounts.FirstOrDefaultAsync(account => account.Email == email);
    }

    public async Task<bool> Exists(ulong id)
    {
        return await Context.Accounts.AnyAsync(account => account.Id == id);
    }
    
    public async Task<bool> Exists(string email)
    {
        return await Context.Accounts.AnyAsync(account => account.Email == email);
    }
}