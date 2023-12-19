using System.IdentityModel.Tokens.Jwt;
using FunChess.Core.Client.Services;
using FunChess.Core.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FunChess.Core.Client.Filters;

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
        if (jwtToken is null)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is invalid."));
            return;
        }
        
        string? id = jwtToken.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value;
        string? email = jwtToken.Claims.FirstOrDefault(x => x.Type == "email")?.Value;
        if (id is null || email is null || !ulong.TryParse(id, out ulong ulongId))
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is invalid."));
            return;
        }
        
        Account? account = await _accountService.FindAsync(ulongId);
        if (account is null || account.Email != email || account.Id != ulongId)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponse(message: "The 'access_token' is invalid."));
        }
    }
}