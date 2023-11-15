using System.IdentityModel.Tokens.Jwt;
using FunChess.Core.Auth.Repositories;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FunChess.Core.Auth.Filters;

public sealed class AuthorizeCustomFilter : IAsyncAuthorizationFilter
{
    public AuthorizeCustomFilter(IAccountManager accountManager, ITokenManager tokenManager)
    {
        _accountManager = accountManager;
        _tokenManager = tokenManager;
    }
    
    private readonly IAccountManager _accountManager;

    private readonly ITokenManager _tokenManager;

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        string? accessToken = context.HttpContext.Request.Cookies["access_token"];
        if (accessToken == null)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is non-existent."));
            return;
        }

        JwtSecurityToken? jwtToken = _tokenManager.GetTokenValidationResult(accessToken);
        if (jwtToken == null)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is invalid."));
            return;
        }
        string? id = jwtToken.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value;
        if (id == null || !ulong.TryParse(id, out ulong ulongId) || !await _accountManager.Exists(ulongId))
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The name identifier from 'access_token' is invalid."));
        }
    }
}