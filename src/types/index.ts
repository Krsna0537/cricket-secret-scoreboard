
export enum TournamentFormat {
  KNOCKOUT = "knockout",
  LEAGUE = "league",
  GROUP_KNOCKOUT = "group_knockout"
}

export enum UserRole {
  ADMIN = "admin",
  VIEWER = "viewer"
}

export enum MatchStatus {
  UPCOMING = "upcoming",
  LIVE = "live",
  COMPLETED = "completed",
  ABANDONED = "abandoned"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Player {
  id: string;
  name: string;
  role?: string;
  batting?: string;
  bowling?: string;
  image?: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  matches: number;
  runs: number;
  wickets: number;
  battingAverage?: number;
  strikeRate?: number;
  bowlingAverage?: number;
  economyRate?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  players: Player[];
  tournamentId: string;
  stats?: TeamStats;
}

export interface TeamStats {
  matches: number;
  won: number;
  lost: number;
  draw: number;
  noResult: number;
  points: number;
  netRunRate?: number;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  logo?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  createdBy: string;
  secretCode: string;
  teams: Team[];
  matches: Match[];
}

export interface Match {
  id: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  date?: string;
  time?: string;
  venue?: string;
  status: MatchStatus;
  result?: MatchResult;
  inning1?: Inning;
  inning2?: Inning;
  winner?: string;
}

export interface MatchResult {
  winnerId?: string;
  winMargin?: number;
  winMarginType?: "runs" | "wickets";
  summary?: string;
}

export interface Inning {
  teamId: string;
  runs: number;
  wickets: number;
  overs: number;
  ballByBall?: BallDetail[];
}

export interface BallDetail {
  over: number;
  ball: number;
  runs: number;
  wicket?: boolean;
  wicketType?: string;
  bowlerId?: string;
  batsmanId?: string;
  commentary?: string;
}
