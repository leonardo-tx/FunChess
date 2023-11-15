using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess;

public sealed class Match
{
    public Match(float secondsLimit, Player player1, Player player2)
    {
        SecondsLimit = secondsLimit;
        Players = new[] { player1, player2 };
    }

    public string Id { get; } = Guid.NewGuid().ToString();
    
    public Board Board { get; } = new();
    
    public float SecondsLimit { get; }

    public DateTime LastMoveDateTime { get; private set; } = DateTime.UtcNow;

    private MatchState _boardMatchState;

    public MatchState MatchState
    {
        get
        {
            if (_boardMatchState != MatchState.Running) return _boardMatchState;
            Player player = Players.Span[(int)Board.Turn - 1];

            float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds;
            float totalPlayerSpentSeconds = player.SpentSeconds + spentSeconds;

            if (totalPlayerSpentSeconds >= SecondsLimit)
            {
                _boardMatchState = (MatchState)Board.NextTurn;
            }
            return _boardMatchState;
        }
    }
    
    public ReadOnlyMemory<Player> Players { get; }

    public bool MoveAtBoard(ulong accountId, Move move)
    {
        Player player = GetPlayerByTurn();
        if (player.AccountId != accountId) return false;
        
        float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds;
        float totalPlayerSpentSeconds = player.SpentSeconds + spentSeconds;
        
        if (MatchState != MatchState.Running || !Board.MovePiece(move)) return false;
        
        player.SpentSeconds = totalPlayerSpentSeconds;
        LastMoveDateTime = DateTime.UtcNow;
        _boardMatchState = Board.GetMatchState();
        
        return true;
    }

    public Player GetPlayerById(ulong accountId)
    {
        ReadOnlySpan<Player> players = Players.Span;
        for (int i = 0; i < 2; i++)
        {
            Player player = players[i];
            if (player.AccountId == accountId) return player;
        }
        throw new ArgumentException($"The {nameof(accountId)} does not belong to any player.", nameof(accountId));
    }

    private Player GetPlayerByTurn()
    {
        return Players.Span[(int)Board.Turn - 1];
    }
}