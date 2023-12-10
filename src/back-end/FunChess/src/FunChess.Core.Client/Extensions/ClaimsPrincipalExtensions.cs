using System.Security.Claims;

namespace FunChess.Core.Client.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static ulong GetAccountId(this ClaimsPrincipal claimsPrincipal)
    {
        string id = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return ulong.Parse(id);
    }
}