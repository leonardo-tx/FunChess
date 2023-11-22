using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace FunChess.Core.Loader.Extensions;

public static class LoaderAppExtension
{
    public static void RunLoaders(this IApplicationBuilder app)
    {
        Assembly[] assemblies = AppDomain.CurrentDomain.GetAssemblies();
        List<Type> loaderTypes = new();
        
        Type loaderBaseType = typeof(LoaderBase);
        foreach (Assembly assembly in assemblies)
        {
            IEnumerable<Type> loaderTypesEnumerable = assembly.GetTypes()
                .Where(type => !type.IsAbstract && type.IsSubclassOf(loaderBaseType));
            loaderTypes.AddRange(loaderTypesEnumerable);
        }
        using IServiceScope serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();

        var tasks = new Task[loaderTypes.Count];
        for (int i = 0; i < loaderTypes.Count; i++)
        {
            var loader = (LoaderBase)ActivatorUtilities.CreateInstance(serviceScope.ServiceProvider, loaderTypes[i]);
            tasks[i] = loader.ExecuteAsync();
        }
        Task.WaitAll(tasks);
    }
}