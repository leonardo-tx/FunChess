using FunChess.Core.Auth;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]")]
[AuthorizeCustom]
public sealed class FriendshipsController : ControllerBase
{
    public FriendshipsController(IFriendshipRepository friendshipRepository, IAccountManager accountManager)
    {
        _friendshipRepository = friendshipRepository;
        _accountManager = accountManager;
    }

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IAccountManager _accountManager;

    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountManager.FindAccount(id))!;

        IAsyncEnumerable<Friendship> friends = _friendshipRepository.GetAllFriendships(account);
        return Ok(new ApiResponse(friends));
    }

    [HttpGet("Invites")]
    public async Task<IActionResult> GetInvites()
    {
        ulong id = User.GetAccountId();
        Account account = (await _accountManager.FindAccount(id))!;

        IAsyncEnumerable<FriendshipRequest> requests = _friendshipRepository.GetAllRequests(account);
        return Ok(new ApiResponse(requests));
    }

    [HttpPost("Invite/{id}")]
    public async Task<IActionResult> Invite(ulong id)
    {
        Account? givenAccount = await _accountManager.FindAccount(id);
        if (givenAccount is null) return NotFound();
        
        ulong currentId = User.GetAccountId();
        Account account = (await _accountManager.FindAccount(currentId))!;

        if (await _friendshipRepository.Find(account, givenAccount) is not null)
        {
            return BadRequest(new ApiResponse(message: "The two accounts are already friends."));
        }
        if (await _friendshipRepository.FindRequest(account, givenAccount) is not null)
        {
            return BadRequest(new ApiResponse(message: "A friend invitation already exists between the two accounts."));
        }
        
        try
        {
            await _friendshipRepository.Invite(account, givenAccount);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse(message: ex.Message));
        }
        return Ok();
    }
}