using FunChess.Core.Chess;
using FunChess.Core.Chess.Services;
using FunChess.Core.Client.Attributes;
using FunChess.Core.Client.Extensions;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[AuthorizeCustom]
[ApiController, Route("Api/[controller]/[action]")]
public sealed class MatchController : ControllerBase
{
    public MatchController(IQueueService queueService)
    {
        _queueService = queueService;
    }

    private readonly IQueueService _queueService;

    [HttpGet]
    public Task<IActionResult> AtMatch()
    {
        ulong id = User.GetAccountId();
        Match? match = _queueService.FindAccountMatch(id);

        IActionResult actionResult = Ok(new ApiResponse(match is not null));
        return Task.FromResult(actionResult);
    }
}