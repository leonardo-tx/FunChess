using FunChess.Core.Client.Dtos;
using Riok.Mapperly.Abstractions;

namespace FunChess.Core.Client.Mappers;

[Mapper]
public partial class MessageMapper
{
    public partial MessageDtoOutput ToOutput(Message message);
}