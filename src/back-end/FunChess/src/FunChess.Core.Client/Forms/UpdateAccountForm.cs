namespace FunChess.Core.Client.Forms;

public sealed class UpdateAccountForm
{
    public string? Email { get; set; }
    
    public string? Username { get; set; }
    
    public string? CurrentPassword { get; set; }
    
    public string? Password { get; set; }
}