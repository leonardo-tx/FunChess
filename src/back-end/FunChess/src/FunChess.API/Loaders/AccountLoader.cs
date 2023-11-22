using FunChess.Core.Auth;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Auth.Settings;
using FunChess.Core.Loader;
using Microsoft.Extensions.Options;

namespace FunChess.API.Loaders;

public sealed class AccountLoader : LoaderBase
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
    
    public override async Task ExecuteAsync()
    {
        if (!File.Exists(FilePath)) return;

        IEnumerable<string> lines = File.ReadLines(FilePath);

        int lineCount = 0;
        foreach (string line in lines)
        {
            try
            {
                await CreateAccountFromLine(line);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError("Account information from line {0} is invalid. {1}", lineCount, ex.Message);
            }
            ++lineCount;
        }
    }

    private async Task CreateAccountFromLine(string textLine)
    {
        string[] accountInfo = textLine.Split(';');
        AccountForm accountForm = new()
        {
            Email = accountInfo[0], 
            Username = accountInfo[1], 
            Password = accountInfo[2]
        };
        Account account = new Account(accountForm, _passwordSettings.Pepper);
            
        if (await _accountManager.FindAccount(account.Email) is not null)
        {
            _logger.LogError("Unable to add the account with email {0}, because it already exists.", account.Email);
            return;
        }
        await _accountManager.Add(account);
        _logger.LogInformation("The account with e-mail {0} was created successfully.", account.Email);
    }
}