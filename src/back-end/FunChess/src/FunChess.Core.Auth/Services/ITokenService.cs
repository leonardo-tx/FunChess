using System.IdentityModel.Tokens.Jwt;

namespace FunChess.Core.Auth.Services;

public interface ITokenService
{
    public string GenerateAccessToken(Account account);

    public JwtSecurityToken? GetTokenValidationResult(string token);
    
    public int AccessTokenDurationInMinutes { get; }
}