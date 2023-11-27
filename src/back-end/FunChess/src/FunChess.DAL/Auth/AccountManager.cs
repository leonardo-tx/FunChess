using System.Collections.Concurrent;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Auth.Settings;
using Microsoft.Extensions.Options;

namespace FunChess.DAL.Auth;

public sealed class AccountManager : IAccountManager
{
    public AccountManager(ITokenManager tokenManager, IOptions<PasswordSettings> passwordSettings)
    {
        _tokenManager = tokenManager;
        _passwordSettings = passwordSettings.Value;
    }
    
    private ConcurrentDictionary<ulong, Account> Accounts { get; } = new();

    private readonly ITokenManager _tokenManager;
    private readonly PasswordSettings _passwordSettings;
    
    public Task Add(Account account)
    {
        ulong key = (ulong)Accounts.Count + 1;
        account.Id = key;
        
        Accounts.TryAdd(key, account);
        return Task.CompletedTask;
    }

    public Task Delete(Account account)
    {
        Accounts.TryRemove(account.Id, out _);
        return Task.CompletedTask;
    }

    public Task<Account?> FindAccount(ulong id)
    {
        Accounts.TryGetValue(id, out Account? account);
        return Task.FromResult(account);
    }
    
    public Task<Account?> FindAccount(string email)
    {
        Account? account = Accounts.Values.FirstOrDefault(account => account.Email == email);
        return Task.FromResult(account);
    }

    public Task<bool> Exists(ulong id)
    {
        return Task.FromResult(Accounts.ContainsKey(id));
    }
    
    public Task<bool> Exists(string email)
    {
        return Task.FromResult(Accounts.Values.Any(account => account.Email == email));
    }
}