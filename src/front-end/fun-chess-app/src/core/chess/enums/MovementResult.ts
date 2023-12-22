enum MovementResult {
    None = "none",
    Illegal = "illegal",
    Move = "move-self",
    Capture = "capture",
    Check = "move-check",
    Castle = "castle"
}

export default MovementResult;