using FunChess.Core.Client.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.Core.Client.Attributes;

public sealed class AuthorizeCustomAttribute : TypeFilterAttribute
{
    public AuthorizeCustomAttribute() : base(typeof(AuthorizeCustomFilter))
    {
    }
}