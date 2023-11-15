using System.IdentityModel.Tokens.Jwt;

namespace FunChess.Core.Auth.Repositories;

public interface ITokenManager
{
    public string GenerateAccessToken(Account account);

    public JwtSecurityToken? GetTokenValidationResult(string token);
    
    public int AccessTokenDurationInMinutes { get; }
}