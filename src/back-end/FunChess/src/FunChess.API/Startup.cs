using System.Text;
using FunChess.API.Hubs;
using FunChess.API.Workers;
using FunChess.Core.Client.Services;
using FunChess.Core.Client.Settings;
using FunChess.Core.Chess.Services;
using FunChess.API.Extensions;
using FunChess.DAL.Chess;
using FunChess.DAL.Client;
using FunChess.DAL.Context;
using FunChess.DAL.Hub;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FunChess.API;

internal sealed class Startup
{
    public Startup(IConfigurationRoot configuration)
    {
        _configuration = configuration;
    }

    private readonly IConfigurationRoot _configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        IConfigurationSection passwordSettingsSection = _configuration.GetSection("PasswordSettings");
        IConfigurationSection tokenSettingsSection = _configuration.GetSection("TokenSettings");
        
        var tokenSettings = tokenSettingsSection.Get<TokenSettings>()!;
        byte[] key = Encoding.ASCII.GetBytes(tokenSettings.SecretKey);
        
        services.AddDbContext<DatabaseContext>();
        services.Configure<PasswordSettings>(passwordSettingsSection);
        services.Configure<TokenSettings>(tokenSettingsSection);
        services.AddCors();
        services.AddControllers();
        services.AddSignalR();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = tokenSettings.Issuer,
                ValidAudience = tokenSettings.Audience,
                ValidateIssuerSigningKey = tokenSettings.ValidateIssuerSigningKey,
                ValidateLifetime = tokenSettings.ValidateLifetime,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero,
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["access_token"];
                    return Task.CompletedTask;
                }
            };
        });
        
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IFriendshipService, FriendshipService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddSingleton<IQueueService, QueueService>();
        services.AddSingleton<IFriendChatService, FriendChatService>();
        services.AddSingletonMappers();
        services.AddHostedService<QueueWorker>();
        services.AddHostedService<MatchWorker>();
    }

    public void ConfigureApp(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        MigrateNewChangesToDatabase(app);
        
        app.UseAuthentication();
        app.UseAuthorization();

        IConfigurationSection section = app.Configuration.GetSection("CorsAllowedHosts");
        string[] hosts = section.Get<string[]>()!;
        
        app.UseCors(options =>
        {
            options.SetIsOriginAllowed(origin =>
            {
                string originHost = new Uri(origin).Host;
                bool allowed = false;
                foreach (string host in hosts)
                {
                    if (host != originHost) continue;
                    
                    allowed = true;
                    break;
                }
                return allowed;
            });
            options.AllowAnyHeader();
            options.AllowCredentials();
            options.AllowAnyMethod();
        });
        app.MapControllers();
        app.MapHub<MatchHub>("Hub/Queue");
        app.MapHub<FriendChatHub>("Hub/FriendChat");
        
        app.RunLoaders();
        app.Run();
    }
    
    private static void MigrateNewChangesToDatabase(IApplicationBuilder app)
    {
        using IServiceScope serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<DatabaseContext>();
        context.Database.Migrate();
    }
}