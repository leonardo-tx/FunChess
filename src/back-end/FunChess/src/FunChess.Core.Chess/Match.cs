using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess;

public sealed class Match
{
    public Match(float secondsLimit, Player player1, Player player2)
    {
        SecondsLimit = secondsLimit;
        WhiteTeamPlayer = player1;
        BlackTeamPlayer = player2;
    }
    
    public Board Board { get; } = new();
    
    public float SecondsLimit { get; }
    
    public float SecondsAlreadyCountedForTurn { get; private set; }

    public DateTime LastMoveDateTime { get; private set; } = DateTime.UtcNow;

    private MatchState _boardMatchState;

    public MatchState MatchState
    {
        get
        {
            if (_boardMatchState != MatchState.Running) return _boardMatchState;
            Player player = GetPlayerByTurn();

            float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds - SecondsAlreadyCountedForTurn;
            float totalPlayerSpentSeconds = player.SpentSeconds + spentSeconds;

            if (totalPlayerSpentSeconds >= SecondsLimit)
            {
                player.SpentSeconds = SecondsLimit;
                _boardMatchState = (MatchState)Board.NextTurn;
            }
            return _boardMatchState;
        }
    }
    
    public Player WhiteTeamPlayer { get; }
    
    public Player BlackTeamPlayer { get; }

    public bool MoveAtBoard(ulong accountId, Move move)
    {
        Player player = GetPlayerByTurn();
        if (player.AccountId != accountId) return false;
        
        float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds - SecondsAlreadyCountedForTurn;
        if (MatchState != MatchState.Running || !Board.MovePiece(move)) return false;
        
        player.SpentSeconds += spentSeconds;
        SecondsAlreadyCountedForTurn = 0;
        LastMoveDateTime = DateTime.UtcNow;
        _boardMatchState = Board.GetMatchState();
        
        return true;
    }

    public void Surrender(ulong accountId)
    {
        if (MatchState != MatchState.Running) return;
        
        Player player = GetPlayerById(accountId);
        float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds - SecondsAlreadyCountedForTurn;

        GetPlayerByTurn().SpentSeconds += spentSeconds;
        if (player.Team == Team.White)
        {
            _boardMatchState = MatchState.BlackWin;
            return;
        }
        _boardMatchState = MatchState.WhiteWin;
    }

    public void UpdateTurnPlayerSpentSeconds()
    {
        Player player = GetPlayerByTurn();
        float spentSeconds = (float)(DateTime.UtcNow - LastMoveDateTime).TotalSeconds - SecondsAlreadyCountedForTurn;

        SecondsAlreadyCountedForTurn += spentSeconds;
        player.SpentSeconds += spentSeconds;
    }

    public Player GetPlayerById(ulong accountId)
    {
        if (WhiteTeamPlayer.AccountId == accountId) return WhiteTeamPlayer;
        if (BlackTeamPlayer.AccountId == accountId) return BlackTeamPlayer;

        throw new ArgumentException($"The {nameof(accountId)} does not belong to any player.", nameof(accountId));
    }

    private Player GetPlayerByTurn()
    {
        return Board.Turn == Team.White ? WhiteTeamPlayer : BlackTeamPlayer;
    }
}