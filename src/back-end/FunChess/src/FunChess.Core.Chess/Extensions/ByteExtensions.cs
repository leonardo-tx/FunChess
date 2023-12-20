using FunChess.Core.Chess.Constants;

namespace FunChess.Core.Chess.Extensions;

internal static class ByteExtensions
{
    internal static bool LengthIsOutOfBorder(this byte value) => value > BoardConstants.MaxIndex;

    internal static bool SizeIsOutOfBorder(this byte value) => value >= BoardConstants.TotalSize;
}