using FunChess.Core.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FunChess.DAL.Context;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
    }

    internal DbSet<Account> Accounts { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var dateConverter = new ValueConverter<DateOnly, DateTime>
        (
            dateOnly => dateOnly.ToDateTime(TimeOnly.MinValue),
            dateTime => DateOnly.FromDateTime(dateTime)
        );
        builder.Entity<Account>().Property(account => account.Creation).HasConversion(dateConverter);
        
        builder.Entity<Friendship>().HasKey(f => new { f.AccountId, f.FriendId });
        builder.Entity<Friendship>()
            .HasOne(f => f.Account)
            .WithMany(p => p.Friendships)
            .HasForeignKey(f => f.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Friendship>()
            .HasOne(f => f.Friend)
            .WithMany()
            .HasForeignKey(f => f.FriendId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}