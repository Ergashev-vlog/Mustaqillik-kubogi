"""
Tournament Model for PlayOff Manager
Manages the complete 16-team bracket lifecycle, auto-advancement, and cascading recursive reset.
"""

from typing import Dict, List, Optional, Any
from .team import Team
from .match import Match


DEFAULT_TEAMS = [
    "Navbahor", "Neftchi", "Paxtakor", "Nasaf",
    "Sog‘diyona", "OKMK", "Dinamo", "Andijon",
    "Bunyodkor", "Surxon", "Qizilqum", "Lokomotiv",
    "Metallurg", "Xorazm", "Turon", "Buxoro"
]


class Tournament:
    """
    Main Tournament model class holding all 15 matches (8 in 1/16, 4 in 1/8, 2 in 1/4, 1 in Final).
    """

    def __init__(self, name: str = "PlayOff Manager Tournament", team_names: Optional[List[str]] = None):
        self.name = name
        self.matches: Dict[str, Match] = {}
        self.champion_id: Optional[str] = None
        self.initialize_bracket(team_names or DEFAULT_TEAMS)

    def initialize_bracket(self, team_names: List[str]) -> None:
        """Build the full 15-match tree structure with initial teams."""
        self.matches.clear()
        teams = [Team(id=f"team_{i+1}", name=team_names[i] if i < len(team_names) else f"Jamoa {i+1}") for i in range(16)]

        # --- 1/16 Round (8 matches: M1..M4 Left, M5..M8 Right) ---
        for i in range(1, 9):
            is_left = i <= 4
            match_id = f"R16_M{i}"
            next_num = (i + 1) // 2
            next_slot = 1 if i % 2 != 0 else 2
            t1_idx = (i - 1) * 2
            t2_idx = t1_idx + 1

            self.matches[match_id] = Match(
                match_id=match_id,
                round_id="1/16",
                match_number=i,
                bracket_side="left" if is_left else "right",
                team1=teams[t1_idx],
                team2=teams[t2_idx],
                next_match_id=f"R8_M{next_num}",
                next_match_slot=next_slot
            )

        # --- 1/8 Round (4 matches: M1..M2 Left, M3..M4 Right) ---
        for i in range(1, 5):
            is_left = i <= 2
            match_id = f"R8_M{i}"
            next_num = (i + 1) // 2
            next_slot = 1 if i % 2 != 0 else 2

            self.matches[match_id] = Match(
                match_id=match_id,
                round_id="1/8",
                match_number=i,
                bracket_side="left" if is_left else "right",
                next_match_id=f"R4_M{next_num}",
                next_match_slot=next_slot
            )

        # --- 1/4 Round (2 matches: M1 Left, M2 Right) ---
        for i in range(1, 3):
            is_left = i == 1
            match_id = f"R4_M{i}"
            next_slot = 1 if i == 1 else 2

            self.matches[match_id] = Match(
                match_id=match_id,
                round_id="1/4",
                match_number=i,
                bracket_side="left" if is_left else "right",
                next_match_id="FINAL",
                next_match_slot=next_slot
            )

        # --- FINAL Round (1 match) ---
        self.matches["FINAL"] = Match(
            match_id="FINAL",
            round_id="FINAL",
            match_number=1,
            bracket_side="center"
        )

    def cascade_clear_downstream(self, match_id: str) -> None:
        """
        Recursively clears downstream matches when a score or winner changes.
        """
        current_match = self.matches.get(match_id)
        if not current_match or not current_match.next_match_id:
            return

        next_match = self.matches.get(current_match.next_match_id)
        if not next_match:
            return

        # Clear team from next match slot
        if current_match.next_match_slot == 1:
            next_match.team1 = None
        elif current_match.next_match_slot == 2:
            next_match.team2 = None

        # Reset scores & winner of next match
        had_progress = next_match.score1 is not None or next_match.score2 is not None or next_match.winner_id is not None
        next_match.reset_scores()

        if next_match.id == "FINAL":
            self.champion_id = None

        # Recursively clear further downstream if there was progress
        if had_progress:
            self.cascade_clear_downstream(next_match.id)

    def update_match_score(self, match_id: str, score1: Optional[int], score2: Optional[int]) -> bool:
        """
        Updates score for a match, evaluates winner, auto-advances, and performs
        cascading recursive resets on downstream matches if winner changes.
        """
        match = self.matches.get(match_id)
        if not match:
            return False

        prev_winner_id = match.winner_id

        match.score1 = score1
        match.score2 = score2
        winning_team = match.evaluate_winner()
        new_winner_id = match.winner_id

        # If winner changed or was cleared, cascade clear downstream
        if prev_winner_id != new_winner_id:
            self.cascade_clear_downstream(match_id)

        # Auto-advance new winner if available
        if winning_team and match.next_match_id:
            next_match = self.matches.get(match.next_match_id)
            if next_match:
                if match.next_match_slot == 1:
                    next_match.team1 = winning_team
                elif match.next_match_slot == 2:
                    next_match.team2 = winning_team

        # Check for Champion
        final_match = self.matches.get("FINAL")
        if final_match and final_match.winner_id:
            self.champion_id = final_match.winner_id
        else:
            self.champion_id = None

        return True

    def update_team_name(self, team_id: str, new_name: str) -> None:
        """Update a team name across all matches."""
        trimmed = new_name.strip()
        if not trimmed:
            return

        for match in self.matches.values():
            if match.team1 and match.team1.id == team_id:
                match.team1.name = trimmed
            if match.team2 and match.team2.id == team_id:
                match.team2.name = trimmed

    def to_dict(self) -> Dict[str, Any]:
        """Convert tournament state to dict for JSON export."""
        return {
            "name": self.name,
            "champion_id": self.champion_id,
            "matches": {mid: m.to_dict() for mid, m in self.matches.items()}
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Tournament":
        """Reconstruct tournament from JSON dict."""
        tournament = cls(name=data.get("name", "PlayOff Manager Tournament"))
        tournament.champion_id = data.get("champion_id")
        matches_data = data.get("matches", {})

        for mid, mdata in matches_data.items():
            tournament.matches[mid] = Match.from_dict(mdata)

        return tournament
