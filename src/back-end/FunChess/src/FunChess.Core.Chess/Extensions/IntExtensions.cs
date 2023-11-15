using FunChess.Core.Chess.Constants;

namespace FunChess.Core.Chess.Extensions;

internal static class IntExtensions
{
    internal static bool LengthIsOutOfBorder(this int value) => value > BoardConstants.MaxIndex || value < BoardConstants.MinIndex;

    internal static bool SizeIsOutOfBorder(this int value) => value < BoardConstants.MinIndex || value >= BoardConstants.TotalSize;
}