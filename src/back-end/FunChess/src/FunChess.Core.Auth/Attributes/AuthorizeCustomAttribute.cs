using FunChess.Core.Auth.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FunChess.Core.Auth.Attributes;

public sealed class AuthorizeCustomAttribute : TypeFilterAttribute
{
    public AuthorizeCustomAttribute() : base(typeof(AuthorizeCustomFilter))
    {
    }
}