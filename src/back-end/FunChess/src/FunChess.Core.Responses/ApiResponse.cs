using System.Text.Json.Serialization;

namespace FunChess.Core.Responses;

public sealed class ApiResponse
{
    public ApiResponse(object? result = null, string? message = null)
    {
        Result = result;
        Message = message;
    }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Result { get; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; }
}