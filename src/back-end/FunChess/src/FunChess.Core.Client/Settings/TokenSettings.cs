namespace FunChess.Core.Client.Settings;

public sealed class TokenSettings
{
    public required string SecretKey { get; set; }
    
    public required string Audience { get; set; }
    
    public required string Issuer { get; set; }
    
    public required int RefreshTokenExpiryTimeInDays { get; set; }
    
    public required int AccessTokenExpiryTimeInMinutes { get; set; }
    
    public required bool ValidateLifetime { get; set; }
    
    public required bool ValidateIssuerSigningKey { get; set; }
}