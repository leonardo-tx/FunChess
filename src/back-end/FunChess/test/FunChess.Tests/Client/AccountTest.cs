using FunChess.Core.Client.Forms;
using FunChess.Core.Client;

namespace FunChess.Tests.Client;

public sealed class AccountTest
{
    private const string Pepper = "qhywceriuyyhq37ecthy872q3cther876t2hc3r76cth2376cr4th2673tcr762trc762t7";
    
    [Fact]
    public void ValidateCreateAccount()
    {
        foreach (AccountForm form in _validAccountForms)
        {
            Account account = new(form, Pepper);
            Assert.True(account.Email == form.Email);
            Assert.True(account.Username == form.Username);
            Assert.True(form.Password != null && account.VerifyPassword(form.Password, Pepper));
        }
    }

    private readonly AccountForm[] _validAccountForms =
    {
        new() { Email = "123@gmail.com", Password = "123456", Username = "Byces" },
        new() { Email = "user1@example.com", Password = "123456", Username = "Use" },
        new() { Email = "test2@domain.net", Password = "P@ssw0", Username = "LongUsernameThatIsMo" },
        new() { Email = "user3@gmail.com", Password = "12345678", Username = "UsLast" },
        new() { Email = "name4@subdomain.org", Password = "ValidPassword1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", Username = "ValidUsername" },
        new() { Email = "user5@example.co.uk", Password = "Valid1@", Username = "Short" },
        new() { Email = "user6@example.io", Password = "Aaa&*(", Username = "User" },
        new() { Email = "test7@sub.domain.com", Password = "ValidPassword", Username = "UsernameWithSpaces" },
        new() { Email = "email8@domain_with_underscores.com", Password = "1234@#", Username = "ValidUsername_123" },
        new() { Email = "user9@example.net", Password = "1234567", Username = "Uuuuuuuu" },
        new() { Email = "user10@example-domain.com", Password = "ValidPassword1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", Username = "ValidUsername12345" },
        new() { Email = "email11@sub.domain.com", Password = "NoDigitsHere", Username = "ValidUsername" },
        new() { Email = "user12@ex-ample.com", Password = "ValidPassword", Username = "UsernameWithDashes-" },
        new() { Email = "user13@example.org", Password = "1@2#3$4%", Username = "Valid_Username" },
        new() { Email = "name14@sub.domain.com", Password = "123456", Username = "ValidUsernameWith___" },
        new() { Email = "user15@domain.co.uk", Password = "P@sswe", Username = "Valid12345" },
        new() { Email = "test16@sub.domain.io", Password = "PasswordWithSpecialChars!@#", Username = "ValidUsername_12345" },
        new() { Email = "email17@example-domain.net", Password = "ValidPassword123456789012345678901234567890", Username = "UsernameWithDashes-1" },
        new() { Email = "user18@example.co", Password = "Valid12345", Username = "Valid123456" },
        new() { Email = "test19@sub.domain.co.uk", Password = "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z", Username = "Val" },
        new() { Email = "user20@example.io", Password = "ValidP@ssw0rdWithSpecialChars123456789012345678901234567890123456789012345678901234567890123454234f23rf23rertgerrgtg3t4t34tg45t5", Username = "ValidAccount" }
    };
}