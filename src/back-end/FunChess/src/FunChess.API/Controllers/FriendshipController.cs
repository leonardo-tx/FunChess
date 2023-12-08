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
        Account account = (await _accountService.FindAsync(id))!;

        List<SimpleAccount> friends = new();
        IAsyncEnumerable<Friendship> friendships = _friendshipService.GetAllFriendships(account);
        await foreach (Friendship friendship in friendships)
        {
            Account friendAccount = (await _accountService.FindAsync(friendship.FriendId))!;
            friends.Add(SimpleAccount.Parse(friendAccount, true));
        }
        return Ok(new ApiResponse(friends));
    }

    [HttpGet("Invites")]
    public async Task<IActionResult> GetInvites()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountService.FindAsync(id))!;

        IAsyncEnumerable<FriendshipRequest> requests = _friendshipService.GetAllRequests(account);
        return Ok(new ApiResponse(requests));
    }

    [HttpPost("Invite/{id}")]
    public async Task<IActionResult> Invite(ulong id)
    {
        Account? givenAccount = await _accountService.FindAsync(id);
        if (givenAccount is null) return NotFound();
        
        ulong currentId = User.GetAccountId();

        if (await _friendshipService.FindAsync(currentId, id) is not null)
        {
            return BadRequest(new ApiResponse(message: "The two accounts are already friends."));
        }
        if (await _friendshipService.FindRequestAsync(currentId, id) is not null)
        {
            return BadRequest(new ApiResponse(message: "A friend invitation already exists between the two accounts."));
        }
        
        try
        {
            await _friendshipService.InviteAsync(currentId, id);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        return Ok();
    }

    [HttpPost("Accept/{id}")]
    public async Task<IActionResult> Accept(ulong id)
    {
        ulong currentId = User.GetAccountId();
        bool result = await _friendshipService.AcceptInviteAsync(id, currentId);

        if (result)
        {
            return Ok();
        }
        return BadRequest(new ApiResponse(message: "The invitation does not exist."));
    }
    
    [HttpPost("Decline/{id}")]
    public async Task<IActionResult> Decline(ulong id)
    {
        ulong currentId = User.GetAccountId();
        bool result = await _friendshipService.AcceptInviteAsync(id, currentId);

        if (result)
        {
            return Ok();
        }
        return BadRequest(new ApiResponse(message: "The invitation does not exist."));
    }
}