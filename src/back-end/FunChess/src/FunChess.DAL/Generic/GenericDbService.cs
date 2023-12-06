using FunChess.DAL.Context;

namespace FunChess.DAL.Generic;

public class GenericDbService
{
    protected GenericDbService(DatabaseContext context)
    {
        Context = context;
    }
    
    protected DatabaseContext Context { get; }
}