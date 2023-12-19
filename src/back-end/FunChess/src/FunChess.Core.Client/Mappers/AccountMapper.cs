using FunChess.Core.Client.Forms;
using FunChess.Core.Client.Settings;
using Microsoft.Extensions.Options;
using Riok.Mapperly.Abstractions;

namespace FunChess.Core.Client.Mappers;

[Mapper]
public partial class AccountMapper
{
    public AccountMapper(IOptions<PasswordSettings> passwordSettings)
    {
        _passwordSettings = passwordSettings.Value;
    }

    private readonly PasswordSettings _passwordSettings;

    public Account ToAccount(AccountForm form)
    {
        return new Account(form, _passwordSettings.Pepper);
    }
}