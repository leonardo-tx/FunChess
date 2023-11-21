using FunChess.Core.Auth;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Auth.Settings;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]/[action]")]
public sealed class AuthController : ControllerBase
{
    public AuthController(IAccountManager accountManager, ITokenManager tokenManager, IOptions<PasswordSettings> passwordSettings)
    {
        _accountManager = accountManager;
        _tokenManager = tokenManager;
        _passwordSettings = passwordSettings.Value;
    }

    private readonly IAccountManager _accountManager;
    private readonly ITokenManager _tokenManager;
    private readonly PasswordSettings _passwordSettings;
    
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] AccountForm form)
    {
        Account account;
        try
        {
            account = new Account(form, _passwordSettings.Pepper);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        if (await _accountManager.Exists(account.Email)) return Conflict(new ApiResponse(message: "The email is already registered."));
        await _accountManager.Add(account);
        
        return Created("/Api/Account/" + account.Id, SimpleAccount.Parse(account));
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginForm form)
    {
        try
        {
            Account.ThrowIfLoginFormIsInvalid(form);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        Account? account = await _accountManager.FindAccount(form.Email!);
        
        if (account is null) 
            return NotFound(new ApiResponse(message: "The email was not found."));
        if (!account.VerifyPassword(form.Password!, _passwordSettings.Pepper))
            return Unauthorized(new ApiResponse(message: "Incorrect password."));
            
        string token = _tokenManager.GenerateAccessToken(account);
        Response.Cookies.Append("access_token", token, GetCookieOptionsForAccessToken());

        return Ok();
    }
    
    [HttpPost, AuthorizeCustom]
    public async Task<IActionResult> Logout()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountManager.FindAccount(id))!;
        
        Response.Cookies.Delete("access_token");
        return Ok();
    }

    [HttpDelete, AuthorizeCustom]
    public async Task<IActionResult> Delete()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountManager.FindAccount(id))!;
        
        await _accountManager.Delete(account);
        
        Response.Cookies.Delete("access_token");
        return Ok();
    }
    
    private CookieOptions GetCookieOptionsForAccessToken()
    {
        int minutes = _tokenManager.AccessTokenDurationInMinutes;
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            Expires = DateTime.UtcNow.AddMinutes(minutes),
            SameSite = SameSiteMode.Strict
        };
    }
}