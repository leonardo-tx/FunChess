using System.Runtime.InteropServices;
using FunChess.Core.Client;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;

namespace FunChess.DAL.Context;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
    }

    internal DbSet<Account> Accounts { get; set; } = null!;
    internal DbSet<FriendshipRequest> FriendshipRequests { get; set; } = null!;
    internal DbSet<Friendship> Friendships { get; set; } = null!;
    internal DbSet<Message> Messages { get; set; } = null!;
    
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
        
        builder.Entity<FriendshipRequest>().HasKey(f => new { f.AccountId, f.FriendId });
        builder.Entity<FriendshipRequest>()
            .HasOne(f => f.Account)
            .WithMany(p => p.FriendshipRequests)
            .HasForeignKey(f => f.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Entity<FriendshipRequest>()
            .HasOne(f => f.Friend)
            .WithMany()
            .HasForeignKey(f => f.FriendId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        string partialPath = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? @"\..\FunChess.API\appsettings.json"
            : "/../FunChess.API/appsettings.json";
        
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(Directory.GetCurrentDirectory() + partialPath)
            .Build();
        
        var dbConnection = configuration.GetConnectionString("DbConnection");
        builder.UseSqlServer(dbConnection);
    }
}