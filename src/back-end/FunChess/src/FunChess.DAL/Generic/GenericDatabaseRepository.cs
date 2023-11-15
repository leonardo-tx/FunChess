using FunChess.DAL.Context;

namespace FunChess.DAL.Generic;

public class GenericDatabaseRepository
{
    protected GenericDatabaseRepository(DatabaseContext context)
    {
        Context = context;
    }
    
    protected DatabaseContext Context { get; }
}