namespace FunChess.API;

internal sealed class Program
{
    private static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
        Startup startup = new(builder.Configuration);
        
        startup.ConfigureServices(builder.Services);
        
        WebApplication app = builder.Build();
        startup.ConfigureApp(app);
    }
}