using FunChess.Core.Client;
using FunChess.Core.Client.Attributes;
using FunChess.Core.Client.Enums;
using FunChess.Core.Client.Extensions;
using FunChess.Core.Client.Forms;
using FunChess.Core.Client.Mappers;
using FunChess.Core.Client.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]/[action]")]
public sealed class AuthController : ControllerBase
{
    public AuthController(IAccountService accountService, ITokenService tokenService, AccountMapper accountMapper)
    {
        _accountService = accountService;
        _tokenService = tokenService;
        _accountMapper = accountMapper;
    }

    private readonly IAccountService _accountService;
    private readonly ITokenService _tokenService;
    private readonly AccountMapper _accountMapper;
    
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] AccountForm form)
    {
        Account account;
        try
        {
            account = _accountMapper.ToAccount(form);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        if (await _accountService.ExistsAsync(account.Email)) return Conflict(new ApiResponse(message: "The email is already registered."));
        await _accountService.AddAsync(account);
        
        return Created("/Api/Account/" + account.Id, SimpleAccount.Parse(account, FriendStatus.None));
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
        Account? account = await _accountService.FindAsync(form.Email!);
        
        if (account is null) 
            return NotFound(new ApiResponse(message: "The email was not found."));
        if (!_accountService.VerifyPassword(account, form.Password!))
            return Unauthorized(new ApiResponse(message: "Incorrect password."));
            
        string token = _tokenService.GenerateAccessToken(account);
        Response.Cookies.Append("access_token", token, GetCookieOptionsForAccessToken());

        return Ok();
    }
    
    [HttpPost, AuthorizeCustom]
    public async Task<IActionResult> Logout()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAsync(id))!;
        
        Response.Cookies.Delete("access_token");
        return Ok();
    }

    [HttpPut, AuthorizeCustom]
    public async Task<IActionResult> Update([FromBody] UpdateAccountForm form)
    {
        ulong id = User.GetAccountId();
        try
        {
            if (!await _accountService.UpdateAsync(id, form)) return Unauthorized(new ApiResponse(message: "The account doesn't exist or incorrect password."));
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
    }

    [HttpDelete, AuthorizeCustom]
    public async Task<IActionResult> Delete([FromBody] DeleteAccountForm form)
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAsync(id))!;

        if (!await _accountService.DeleteAsync(account, form))
        {
            return Unauthorized(new ApiResponse(message: "Incorrect password."));
        }
        Response.Cookies.Delete("access_token");
        return Ok();
    }
    
    private CookieOptions GetCookieOptionsForAccessToken()
    {
        int minutes = _tokenService.AccessTokenDurationInMinutes;
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            Expires = DateTime.UtcNow.AddMinutes(minutes),
            SameSite = SameSiteMode.Strict
        };
    }
}