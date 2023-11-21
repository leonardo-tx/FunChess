using FunChess.Core.Auth;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Auth.Settings;
using Microsoft.Extensions.Options;

namespace FunChess.API.Loaders;

public sealed class AccountLoader
{
    private const string FilePath = "LoaderFiles/accounts.dat";
    
    public AccountLoader(IAccountManager accountManager, IOptions<PasswordSettings> passwordSettings, ILogger<AccountLoader> logger)
    {
        _accountManager = accountManager;
        _passwordSettings = passwordSettings.Value;
        _logger = logger;
    }

    private readonly ILogger<AccountLoader> _logger;
    private readonly IAccountManager _accountManager;
    private readonly PasswordSettings _passwordSettings;
    
    public async Task Start()
    {
        _logger.LogInformation("Starting AccountLoader");
        if (!File.Exists(FilePath)) return;

        IEnumerable<string> lines = File.ReadLines(FilePath);
        foreach (string line in lines)
        {
            string[] accountInfo = line.Split(';');
            AccountForm accountForm = new()
            {
                Email = accountInfo[0], 
                Username = accountInfo[1], 
                Password = accountInfo[2]
            };
            Account account;
            
            try
            {
                account = new Account(accountForm, _passwordSettings.Pepper);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError("Account information is invalid. {0}", ex.Message);
                continue;
            }
            
            if (await _accountManager.FindAccount(account.Email) is not null)
            {
                _logger.LogError("Unable to add the account with email {0}, because it already exists.", account.Email);
                continue;
            }
            await _accountManager.Add(account);
            _logger.LogInformation("The account with e-mail {0} was created successfully.", account.Email);
        }
    }
}