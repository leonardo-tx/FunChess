using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using FunChess.Core.Auth.Forms;
using Microsoft.EntityFrameworkCore;

namespace FunChess.Core.Auth;

using BCrypt.Net;

[Index(nameof(Email), IsUnique = true)]
public class Account
{
    public Account(AccountForm form, string pepper)
    {
        Email = form.Email!;
        Username = form.Username!;
        PasswordHash = GeneratePasswordHash(form.Password!, pepper);
        Creation = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public Account()
    {
    }

    private string _username = null!;
    private string _email = null!;
    
    [Key]
    public ulong Id { get; set; }

    [MinLength(3)]
    [MaxLength(20)]
    [Required]
    public string Username
    {
        get => _username;
        set
        {
            ThrowIfUsernameIsInvalid(value);
            _username = value;
        }
    }

    [EmailAddress]
    [Required]
    public string Email
    {
        get => _email;
        set
        {
            ThrowIfEmailIsInvalid(value);
            _email = value;
        }
    }
    
    public DateOnly Creation { get; set; }

    public List<Friendship> Friendships { get; set; } = new();
    
    [DataType(DataType.Password)]
    public string PasswordHash { get; set; } = null!;

    public bool VerifyPassword(string password, string pepper)
    {
        return BCrypt.EnhancedVerify(password + pepper, PasswordHash);
    }

    public static string GeneratePasswordHash(string password, string pepper)
    {
        ThrowIfPasswordIsInvalid(password);
        return BCrypt.EnhancedHashPassword(password + pepper, 12);
    }
    
    public static void ThrowIfLoginFormIsInvalid(LoginForm form)
    {
        ThrowIfEmailIsInvalid(form.Email);
        ThrowIfPasswordIsInvalid(form.Password);
    }
    
    private static void ThrowIfEmailIsInvalid([NotNull] string? email)
    {
        if (email is null) throw new ArgumentNullException(nameof(email), "E-mail cannot be null.");
            
        int index = email.IndexOf('@');
        if (index <= 0 || index == email.Length - 1 || index != email.LastIndexOf('@')) throw new ArgumentException
        (
            "Argument is not a valid email.",
            nameof(email)
        );
    }

    private static void ThrowIfPasswordIsInvalid([NotNull] string? password)
    {
        if (password is null) throw new ArgumentNullException(nameof(password), "E-mail cannot be null.");
        if (password.Length is < 6 or > 128) throw new ArgumentOutOfRangeException
        (
            nameof(password), password.Length, 
            "Password was out of range. Must be greater than 5 and less than 129."
        );
    }

    private static void ThrowIfUsernameIsInvalid([NotNull] string? username)
    {
        if (username is null) throw new ArgumentNullException(nameof(username), "Username cannot be null.");
        if (username.Length is < 3 or > 20) throw new ArgumentOutOfRangeException
        (
            nameof(username), username.Length, 
            "Username was out of range. Must be greater than 2 and less than 21."
        );
    }
}