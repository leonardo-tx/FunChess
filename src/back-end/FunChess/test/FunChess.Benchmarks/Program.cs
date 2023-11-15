using System.Diagnostics;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Forms;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Benchmarks;

internal sealed class Program
{
    private static void Main()
    {
        BenchmarkRunner.Run<BoardBenchmark>();
    }
}

[MemoryDiagnoser]
public class BoardBenchmark
{
#pragma warning disable CS8618
    private Board _board;
    private byte[] _boardByteArray;
#pragma warning restore CS8618

    [GlobalSetup]
    public void Setup()
    {
        _board = new Board();
        _boardByteArray = _board.ToByteArray();
    }

    [Benchmark]
    public bool PieceCanMove()
    {
        return _board.PieceCanMove(new Move(new(1, 0), new(2, 0)));
    }
    
    [Benchmark]
    public MatchState GetKingState()
    {
        return _board.GetMatchState();
    }

    [Benchmark]
    public Board CreateBoard()
    {
        return new Board();
    }

    [Benchmark]
    public string BoardToString()
    {
        return _board.ToString();
    }
    
    [Benchmark]
    public byte[] BoardToByteArray()
    {
        return _board.ToByteArray();
    }

    [Benchmark]
    public Board Parse()
    {
        return Board.Parse(_boardByteArray);
    }

    [Benchmark]
    public Account CreatingAccount()
    {
        return new Account
        (
            new AccountForm { Email = "123@gmail.com", Username = "Byces", Password = "123456"}, 
            "%k9\u00a8çf{bfp*&§\u00ac\u00ac#sx@]!n0(<?,ub8;+"
        );
    }
}