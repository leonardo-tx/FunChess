using FunChess.Core.Auth.Attributes;
using FunChess.Core.Auth.Extensions;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Repositories;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[AuthorizeCustom]
[ApiController, Route("Api/[controller]/[action]")]
public sealed class MatchController : ControllerBase
{
    public MatchController(IQueueRepository queueRepository)
    {
        _queueRepository = queueRepository;
    }

    private readonly IQueueRepository _queueRepository;

    [HttpGet]
    public Task<IActionResult> AtMatch()
    {
        ulong id = User.GetAccountId();
        Match? match = _queueRepository.FindAccountMatch(id);

        IActionResult actionResult = Ok(new ApiResponse(match is not null));
        return Task.FromResult(actionResult);
    }
}