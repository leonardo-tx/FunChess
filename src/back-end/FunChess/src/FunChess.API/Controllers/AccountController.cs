using System.Security.Claims;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Enums;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Auth.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]")]
public class AccountController : ControllerBase
{
    public AccountController(IAccountService accountService, IFriendshipService friendshipService, ITokenService tokenService)
    {
        _accountService = accountService;
        _friendshipService = friendshipService;
        _tokenService = tokenService;
    }
    
    private readonly IAccountService _accountService;
    private readonly IFriendshipService _friendshipService;
    private readonly ITokenService _tokenService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSimpleAccount(ulong id)
    {
        Account? account = await _accountService.FindAsync(id);
        if (account is null) return NotFound();
        
        string? accessToken = Request.Cookies["access_token"];
        if (accessToken is null || 
            _tokenService.GetTokenValidationResult(accessToken) is null || 
            !ulong.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out ulong currentId))
        {
            return Ok(new ApiResponse(SimpleAccount.Parse(account, FriendStatus.None)));
        }
        if (await _friendshipService.FindAsync(currentId, id) is not null)
        {
            return Ok(new ApiResponse(SimpleAccount.Parse(account, FriendStatus.Friends)));
        }
        FriendshipRequest? request = await _friendshipService.FindRequestAsync(currentId, id);
        if (request is null)
        {
            return Ok(new ApiResponse(SimpleAccount.Parse(account, FriendStatus.None)));
        }

        return Ok(request.RequestType == FriendRequestType.Delivered 
            ? new ApiResponse(SimpleAccount.Parse(account, FriendStatus.Delivered)) 
            : new ApiResponse(SimpleAccount.Parse(account, FriendStatus.Received)));
    }

    [HttpGet, AuthorizeCustom]
    public async Task<IActionResult> GetCurrentAccount()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAsync(id))!;

        return Ok(new ApiResponse(CurrentAccount.Parse(account)));
    }
}