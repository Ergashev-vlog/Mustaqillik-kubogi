import { TournamentState, Match, TournamentSettings } from '../types/tournament';

export const DEFAULT_SETTINGS: TournamentSettings = {
  name: 'O‘zbekiston Play-Off Kubogi 2026',
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  theme: 'win11_light',
  backgroundImageUrl: '',
  backgroundOpacity: 0.15,
  lineColor: '#3b82f6',
  lineWidth: 2,
  winnerColor: '#22c55e',
  loserColor: '#ef4444',
  drawColor: '#eab308',
  cardBgColor: '#ffffff',
};

export const INITIAL_TEAMS_DEFAULT: string[] = [
  'Navbahor', 'Neftchi', 'Paxtakor', 'Nasaf',
  'Sog‘diyona', 'OKMK', 'Dinamo', 'Andijon',
  'Bunyodkor', 'Surxon', 'Qizilqum', 'Lokomotiv',
  'Metallurg', 'Xorazm', 'Turon', 'Buxoro'
];

export const PRESET_TEAMS_PFL: string[] = [
  'Navbahor', 'Neftchi', 'Paxtakor', 'Nasaf',
  'Sog‘diyona', 'OKMK', 'Dinamo', 'Andijon',
  'Bunyodkor', 'Surxon', 'Qizilqum', 'Lokomotiv',
  'Metallurg', 'Xorazm', 'Turon', 'Buxoro'
];

export const PRESET_TEAMS_UCL: string[] = [
  'Real Madrid', 'Manchester City', 'Bayern Munich', 'Paris Saint-Germain',
  'Barcelona', 'Arsenal', 'Inter Milan', 'Borussia Dortmund',
  'Liverpool', 'Atletico Madrid', 'Juventus', 'Bayer Leverkusen',
  'AC Milan', 'Benfica', 'Sporting CP', 'Porto'
];

export function createInitialTournament(teamNames: string[] = INITIAL_TEAMS_DEFAULT, tournamentName: string = DEFAULT_SETTINGS.name): TournamentState {
  const teams = teamNames.map((name, idx) => ({
    id: `team_${idx + 1}`,
    name: name.trim() || `Jamoa ${idx + 1}`,
  }));

  const matches: Record<string, Match> = {};

  // --- ROUND 1: 1/16 (8 matches) ---
  // Left side: M1, M2, M3, M4
  // Right side: M5, M6, M7, M8
  for (let i = 1; i <= 8; i++) {
    const isLeft = i <= 4;
    const matchId = `R16_M${i}`;
    const t1Index = (i - 1) * 2;
    const t2Index = t1Index + 1;
    
    // Determine next match ID and slot
    // M1, M2 -> R8_M1 (slots 1, 2)
    // M3, M4 -> R8_M2 (slots 1, 2)
    // M5, M6 -> R8_M3 (slots 1, 2)
    // M7, M8 -> R8_M4 (slots 1, 2)
    const nextMatchNum = Math.ceil(i / 2);
    const nextMatchSlot = (i % 2 === 1 ? 1 : 2) as 1 | 2;

    matches[matchId] = {
      id: matchId,
      roundId: 'R16',
      matchNumber: i,
      bracketSide: isLeft ? 'left' : 'right',
      team1: teams[t1Index] || null,
      team2: teams[t2Index] || null,
      score1: null,
      score2: null,
      winnerId: null,
      status: 'scheduled',
      nextMatchId: `R8_M${nextMatchNum}`,
      nextMatchSlot,
    };
  }

  // --- ROUND 2: 1/8 (4 matches) ---
  // M1, M2 on Left -> fed by R16_M1..4
  // M3, M4 on Right -> fed by R16_M5..8
  for (let i = 1; i <= 4; i++) {
    const isLeft = i <= 2;
    const matchId = `R8_M${i}`;
    const nextMatchNum = Math.ceil(i / 2);
    const nextMatchSlot = (i % 2 === 1 ? 1 : 2) as 1 | 2;

    const s1 = (i - 1) * 2 + 1;
    const s2 = s1 + 1;

    matches[matchId] = {
      id: matchId,
      roundId: 'R8',
      matchNumber: i,
      bracketSide: isLeft ? 'left' : 'right',
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winnerId: null,
      status: 'scheduled',
      nextMatchId: `R4_M${nextMatchNum}`,
      nextMatchSlot,
      sourceMatch1Id: `R16_M${s1}`,
      sourceMatch2Id: `R16_M${s2}`,
    };
  }

  // --- ROUND 3: 1/4 (2 matches) ---
  // M1 on Left -> fed by R8_M1, R8_M2
  // M2 on Right -> fed by R8_M3, R8_M4
  for (let i = 1; i <= 2; i++) {
    const isLeft = i === 1;
    const matchId = `R4_M${i}`;
    const s1 = (i - 1) * 2 + 1;
    const s2 = s1 + 1;

    matches[matchId] = {
      id: matchId,
      roundId: 'R4',
      matchNumber: i,
      bracketSide: isLeft ? 'left' : 'right',
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winnerId: null,
      status: 'scheduled',
      nextMatchId: 'FINAL',
      nextMatchSlot: (i === 1 ? 1 : 2) as 1 | 2,
      sourceMatch1Id: `R8_M${s1}`,
      sourceMatch2Id: `R8_M${s2}`,
    };
  }

  // --- ROUND 4: FINAL (1 match) ---
  matches['FINAL'] = {
    id: 'FINAL',
    roundId: 'FINAL',
    matchNumber: 1,
    bracketSide: 'center',
    team1: null,
    team2: null,
    score1: null,
    score2: null,
    winnerId: null,
    status: 'scheduled',
    nextMatchId: null,
    nextMatchSlot: null,
    sourceMatch1Id: 'R4_M1',
    sourceMatch2Id: 'R4_M2',
  };

  return {
    id: `tour_${Date.now()}`,
    title: tournamentName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matches,
    championId: null,
    settings: {
      ...DEFAULT_SETTINGS,
      name: tournamentName,
    },
  };
}

/**
 * Recursively clears downstream matches from a starting match ID.
 * If a match's winner changes or is cleared, all downstream matches
 * that depended on this match must reset scores, status, and downstream winners.
 */
export function clearDownstreamMatches(matches: Record<string, Match>, startMatchId: string): string | null {
  const currentMatch = matches[startMatchId];
  if (!currentMatch || !currentMatch.nextMatchId) {
    return null;
  }

  const nextMatchId = currentMatch.nextMatchId;
  const nextMatch = matches[nextMatchId];
  if (!nextMatch) return null;

  const slot = currentMatch.nextMatchSlot;

  // Clear team in slot of next match
  if (slot === 1) {
    nextMatch.team1 = null;
  } else if (slot === 2) {
    nextMatch.team2 = null;
  }

  // Clear scores & winner of next match
  const hadScoreOrWinner = nextMatch.score1 !== null || nextMatch.score2 !== null || nextMatch.winnerId !== null;
  nextMatch.score1 = null;
  nextMatch.score2 = null;
  nextMatch.winnerId = null;
  nextMatch.status = 'scheduled';

  // Recursively clear further downstream if the next match previously had progress
  if (hadScoreOrWinner) {
    clearDownstreamMatches(matches, nextMatchId);
  }

  return nextMatchId;
}

/**
 * Updates a match's score and recalculates winner & auto-advancement.
 * Implements cascading recursive clear when results change.
 */
export function updateMatchScore(
  state: TournamentState,
  matchId: string,
  score1: number | null,
  score2: number | null
): TournamentState {
  const newMatches = JSON.parse(JSON.stringify(state.matches)) as Record<string, Match>;
  const targetMatch = newMatches[matchId];
  if (!targetMatch) return state;

  const prevWinnerId = targetMatch.winnerId;

  // Set scores
  targetMatch.score1 = score1;
  targetMatch.score2 = score2;

  // Validate scores
  if (score1 === null || score2 === null || isNaN(score1) || isNaN(score2)) {
    targetMatch.winnerId = null;
    targetMatch.status = 'scheduled';

    // If there was a previous winner, cascade clear downstream
    if (prevWinnerId) {
      clearDownstreamMatches(newMatches, matchId);
    }
  } else if (score1 === score2) {
    // Playoff requires a winner. Highlight draw error / penalty tie required
    targetMatch.winnerId = null;
    targetMatch.status = 'draw_error';

    if (prevWinnerId) {
      clearDownstreamMatches(newMatches, matchId);
    }
  } else {
    // We have a winner
    const winningTeam = score1 > score2 ? targetMatch.team1 : targetMatch.team2;
    const newWinnerId = winningTeam ? winningTeam.id : null;

    targetMatch.winnerId = newWinnerId;
    targetMatch.status = 'completed';

    // Check if winner changed
    if (prevWinnerId !== newWinnerId) {
      // Cascade clear downstream matches first
      clearDownstreamMatches(newMatches, matchId);
    }

    // Auto-advance winner to next match if present
    if (winningTeam && targetMatch.nextMatchId) {
      const nextMatch = newMatches[targetMatch.nextMatchId];
      if (nextMatch && targetMatch.nextMatchSlot) {
        if (targetMatch.nextMatchSlot === 1) {
          nextMatch.team1 = { ...winningTeam };
        } else if (targetMatch.nextMatchSlot === 2) {
          nextMatch.team2 = { ...winningTeam };
        }
      }
    }
  }

  // Update Champion if FINAL match
  let newChampionId: string | null = null;
  const finalMatch = newMatches['FINAL'];
  if (finalMatch && finalMatch.status === 'completed' && finalMatch.winnerId) {
    newChampionId = finalMatch.winnerId;
  }

  return {
    ...state,
    matches: newMatches,
    championId: newChampionId,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates team name in Round 1 (1/16) and propagates to any advanced rounds.
 */
export function updateTeamName(
  state: TournamentState,
  teamId: string,
  newName: string
): TournamentState {
  const trimmed = newName.trim();
  if (!trimmed) return state;

  const newMatches = JSON.parse(JSON.stringify(state.matches)) as Record<string, Match>;

  // Loop through all matches and update team name wherever teamId matches
  Object.values(newMatches).forEach((match) => {
    if (match.team1 && match.team1.id === teamId) {
      match.team1.name = trimmed;
    }
    if (match.team2 && match.team2.id === teamId) {
      match.team2.name = trimmed;
    }
  });

  return {
    ...state,
    matches: newMatches,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Gets the winning team object if present
 */
export function getChampionTeam(state: TournamentState) {
  if (!state.championId) return null;
  const finalMatch = state.matches['FINAL'];
  if (!finalMatch || !finalMatch.winnerId) return null;
  if (finalMatch.team1 && finalMatch.team1.id === state.championId) return finalMatch.team1;
  if (finalMatch.team2 && finalMatch.team2.id === state.championId) return finalMatch.team2;
  return null;
}
