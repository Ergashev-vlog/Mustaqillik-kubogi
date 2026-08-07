export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'draw_error';

export interface Match {
  id: string; // e.g. "R16_M1", "R8_M1", "R4_M1", "FINAL"
  roundId: 'R16' | 'R8' | 'R4' | 'FINAL';
  matchNumber: number; // 1..8 for R16, 1..4 for R8, 1..2 for R4, 1 for FINAL
  bracketSide: 'left' | 'right' | 'center';
  team1: Team | null;
  team2: Team | null;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  status: MatchStatus;
  nextMatchId: string | null;
  nextMatchSlot: 1 | 2 | null; // slot inside next match
  sourceMatch1Id?: string; // previous match supplying team 1
  sourceMatch2Id?: string; // previous match supplying team 2
}

export interface TournamentSettings {
  name: string;
  fontFamily: string;
  theme: 'win11_light' | 'win11_dark' | 'green_pitch' | 'stadium_night' | 'custom';
  backgroundImageUrl: string;
  backgroundOpacity: number;
  lineColor: string;
  lineWidth: number;
  winnerColor: string;
  loserColor: string;
  drawColor: string;
  cardBgColor: string;
}

export interface TournamentState {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  matches: Record<string, Match>;
  championId: string | null;
  settings: TournamentSettings;
}

export interface HistoryState {
  past: TournamentState[];
  present: TournamentState;
  future: TournamentState[];
}
