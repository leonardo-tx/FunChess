using System.IdentityModel.Tokens.Jwt;
using FunChess.Core.Auth.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FunChess.Core.Auth.Filters;

public sealed class AuthorizeCustomFilter : IAsyncAuthorizationFilter
{
    public AuthorizeCustomFilter(IAccountService accountService, ITokenService tokenService)
    {
        _accountService = accountService;
        _tokenService = tokenService;
    }
    
    private readonly IAccountService _accountService;

    private readonly ITokenService _tokenService;

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        string? accessToken = context.HttpContext.Request.Cookies["access_token"];
        if (accessToken == null)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is non-existent."));
            return;
        }

        JwtSecurityToken? jwtToken = _tokenService.GetTokenValidationResult(accessToken);
        if (jwtToken == null)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is invalid."));
            return;
        }
        string? id = jwtToken.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value;
        if (id == null || !ulong.TryParse(id, out ulong ulongId) || !await _accountService.Exists(ulongId))
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The name identifier from 'access_token' is invalid."));
        }
    }
}