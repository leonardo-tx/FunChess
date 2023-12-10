using FunChess.Core.Client.Attributes;
using FunChess.Core.Client.Dtos;
using FunChess.Core.Client.Extensions;
using FunChess.Core.Client.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.API.Controllers;

[ApiController, Route("Api/[controller]")]
[AuthorizeCustom]
public sealed class MessagesController : ControllerBase
{
    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    private readonly IMessageService _messageService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAll(ulong id)
    {
        ulong currentId = User.GetAccountId();
        IEnumerable<MessageDtoOutput> messages = await _messageService.GetAllAsync(currentId, id);

        return Ok(new ApiResponse(messages));
    }
}