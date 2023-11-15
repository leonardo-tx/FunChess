import MatchState from "./enums/MatchState";
import Team from "./enums/Team";

export default interface Match {
    secondsLimit: number;
    timeStamp: number;
    matchState: MatchState;
    players: { team: Team, accountId: number, spentSeconds: number }[];
}