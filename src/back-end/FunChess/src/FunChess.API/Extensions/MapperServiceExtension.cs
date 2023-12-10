using System.Reflection;
using Riok.Mapperly.Abstractions;

namespace FunChess.API.Extensions;

public static class MapperServiceExtension
{
    public static void AddSingletonMappers(this IServiceCollection services)
    {
        Assembly[] assemblies = AppDomain.CurrentDomain.GetAssemblies();
        Type mapperAttributeType = typeof(MapperAttribute);

        foreach (Assembly assembly in assemblies)
        {
            IEnumerable<Type> loaderTypesEnumerable = assembly.GetTypes()
                .Where(type => type.GetCustomAttributes(mapperAttributeType, false).Length == 1);
            foreach (Type classType in loaderTypesEnumerable)
            {
                services.AddSingleton(classType);
            }
        }
    }
}