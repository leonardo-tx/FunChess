using FunChess.Core.Client;
using FunChess.Core.Client.Forms;
using FunChess.Core.Client.Mappers;
using FunChess.Core.Client.Services;

namespace FunChess.API.Loaders;

public sealed class AccountLoader : LoaderBase
{
    private const string FilePath = "LoaderFiles/accounts.dat";
    
    public AccountLoader(IAccountService accountService, AccountMapper accountMapper, ILogger<AccountLoader> logger)
    {
        _accountService = accountService;
        _accountMapper = accountMapper;
        _logger = logger;
    }

    private readonly ILogger<AccountLoader> _logger;
    private readonly IAccountService _accountService;
    private readonly AccountMapper _accountMapper;
    
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
        Account account = _accountMapper.ToAccount(accountForm);
            
        if (await _accountService.FindAsync(account.Email) is not null)
        {
            _logger.LogError("Unable to add the account with email {0}, because it already exists.", account.Email);
            return;
        }
        await _accountService.AddAsync(account);
        _logger.LogInformation("The account with e-mail {0} was created successfully.", account.Email);
    }
}