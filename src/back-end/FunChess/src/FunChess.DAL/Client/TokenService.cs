using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FunChess.Core.Client;
using FunChess.Core.Client.Services;
using FunChess.Core.Client.Settings;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FunChess.DAL.Client;

public sealed class TokenService : GenericDbService, ITokenService
{
    public TokenService(DatabaseContext context, IOptions<TokenSettings> tokenSettings) : base(context)
    {
        _tokenSettings = tokenSettings.Value;
        
        byte[] key = Encoding.ASCII.GetBytes(_tokenSettings.SecretKey);
        _tokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = _tokenSettings.Issuer,
            ValidAudience = _tokenSettings.Audience,
            ValidateIssuerSigningKey = _tokenSettings.ValidateIssuerSigningKey,
            ValidateLifetime = _tokenSettings.ValidateLifetime,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero,
        };
    }

    private readonly JwtSecurityTokenHandler _tokenHandler = new();

    private readonly TokenValidationParameters _tokenValidationParameters;
    
    private readonly TokenSettings _tokenSettings;

    public string GenerateAccessToken(Account account)
    {
        byte[] key = Encoding.ASCII.GetBytes(_tokenSettings.SecretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Email, account.Email),
                new(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new(ClaimTypes.Name, account.Username)
            }),
            Expires = DateTime.UtcNow.AddMinutes(_tokenSettings.AccessTokenExpiryTimeInMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha384Signature),
            Audience = _tokenSettings.Audience,
            Issuer = _tokenSettings.Issuer,
        };
        SecurityToken token = _tokenHandler.CreateToken(tokenDescriptor);
        return _tokenHandler.WriteToken(token);
    }

    public JwtSecurityToken? GetTokenValidationResult(string token)
    {
        try
        {
            _tokenHandler.ValidateToken(token, _tokenValidationParameters, out SecurityToken validatedToken);
            return (JwtSecurityToken)validatedToken;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public int AccessTokenDurationInMinutes => _tokenSettings.AccessTokenExpiryTimeInMinutes;
}