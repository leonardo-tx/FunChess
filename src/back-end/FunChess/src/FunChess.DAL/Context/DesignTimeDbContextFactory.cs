using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FunChess.DAL.Context;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
{
    public DatabaseContext CreateDbContext(string[] args)
    {
        string partialPath = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? @"\..\FunChess.API\appsettings.json"
            : "/../FunChess.API/appsettings.json";
        
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(Directory.GetCurrentDirectory() + partialPath)
            .Build();

        var builder = new DbContextOptionsBuilder<DatabaseContext>();
        var dbConnection = configuration.GetConnectionString("DbConnection");

        builder.UseSqlServer(dbConnection);
        return new DatabaseContext(builder.Options);
    }
}