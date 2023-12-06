using FunChess.Core.Auth;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Auth.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]")]
public class AccountController : ControllerBase
{
    public AccountController(IAccountService accountService, IFriendshipService friendshipService)
    {
        _accountService = accountService;
    }
    
    private readonly IAccountService _accountService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSimpleAccount(ulong id)
    {
        Account? account = await _accountService.FindAccount(id);
        if (account is null) return NotFound();
        
        return Ok(new ApiResponse(SimpleAccount.Parse(account)));
    }

    [HttpGet, AuthorizeCustom]
    public async Task<IActionResult> GetCurrentAccount()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAccount(id))!;

        return Ok(new ApiResponse(CurrentAccount.Parse(account)));
    }
}