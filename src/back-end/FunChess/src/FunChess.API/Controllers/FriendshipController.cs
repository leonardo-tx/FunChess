using FunChess.Core.Auth;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Auth.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]")]
[AuthorizeCustom]
public sealed class FriendshipsController : ControllerBase
{
    public FriendshipsController(IFriendshipService friendshipService, IAccountService accountService)
    {
        _friendshipService = friendshipService;
        _accountService = accountService;
    }

    private readonly IFriendshipService _friendshipService;
    private readonly IAccountService _accountService;

    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAccount(id))!;

        IAsyncEnumerable<Friendship> friends = _friendshipService.GetAllFriendships(account);
        return Ok(new ApiResponse(friends));
    }

    [HttpGet("Invites")]
    public async Task<IActionResult> GetInvites()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAccount(id))!;

        IAsyncEnumerable<FriendshipRequest> requests = _friendshipService.GetAllRequests(account);
        return Ok(new ApiResponse(requests));
    }

    [HttpPost("Invite/{id}")]
    public async Task<IActionResult> Invite(ulong id)
    {
        Account? givenAccount = await _accountService.FindAccount(id);
        if (givenAccount is null) return NotFound();
        
        ulong currentId = User.GetAccountId();
        Account account = (await _accountService.FindAccount(currentId))!;

        if (await _friendshipService.Find(account, givenAccount) is not null)
        {
            return BadRequest(new ApiResponse(message: "The two accounts are already friends."));
        }
        if (await _friendshipService.FindRequest(account, givenAccount) is not null)
        {
            return BadRequest(new ApiResponse(message: "A friend invitation already exists between the two accounts."));
        }
        
        try
        {
            await _friendshipService.Invite(account, givenAccount);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        return Ok();
    }
}