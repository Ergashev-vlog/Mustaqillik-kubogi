"""
Match Model for PlayOff Manager
Represents a single playoff match between two teams with scores and status.
"""

from typing import Optional, Dict, Any
from .team import Team


class Match:
    """
    Class representing a single playoff match in a round.
    
    Attributes:
        id (str): Unique match identifier (e.g., 'R16_M1', 'FINAL').
        round_id (str): Name of the round ('1/16', '1/8', '1/4', 'FINAL').
        match_number (int): Sequential match number in round.
        bracket_side (str): 'left', 'right', or 'center'.
        team1 (Optional[Team]): First competing team.
        team2 (Optional[Team]): Second competing team.
        score1 (Optional[int]): Goals scored by team 1.
        score2 (Optional[int]): Goals scored by team 2.
        winner_id (Optional[str]): ID of the winning team.
        next_match_id (Optional[str]): ID of the downstream match winner advances to.
        next_match_slot (Optional[int]): Slot 1 or 2 in the next match.
    """

    def __init__(
        self,
        match_id: str,
        round_id: str,
        match_number: int,
        bracket_side: str,
        team1: Optional[Team] = None,
        team2: Optional[Team] = None,
        score1: Optional[int] = None,
        score2: Optional[int] = None,
        winner_id: Optional[str] = None,
        next_match_id: Optional[str] = None,
        next_match_slot: Optional[int] = None
    ):
        self.id = match_id
        self.round_id = round_id
        self.match_number = match_number
        self.bracket_side = bracket_side
        self.team1 = team1
        self.team2 = team2
        self.score1 = score1
        self.score2 = score2
        self.winner_id = winner_id
        self.next_match_id = next_match_id
        self.next_match_slot = next_match_slot

    def evaluate_winner(self) -> Optional[Team]:
        """
        Evaluate and set the winner based on scores.
        Returns the winning Team instance or None if draw/unplayed.
        """
        if self.score1 is None or self.score2 is None:
            self.winner_id = None
            return None

        if self.score1 > self.score2:
            self.winner_id = self.team1.id if self.team1 else None
            return self.team1
        elif self.score2 > self.score1:
            self.winner_id = self.team2.id if self.team2 else None
            return self.team2
        else:
            # Draw - requires tie breaker in playoffs
            self.winner_id = None
            return None

    def reset_scores(self) -> None:
        """Reset scores and winner determination."""
        self.score1 = None
        self.score2 = None
        self.winner_id = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert match instance to dictionary."""
        return {
            "id": self.id,
            "round_id": self.round_id,
            "match_number": self.match_number,
            "bracket_side": self.bracket_side,
            "team1": self.team1.to_dict() if self.team1 else None,
            "team2": self.team2.to_dict() if self.team2 else None,
            "score1": self.score1,
            "score2": self.score2,
            "winner_id": self.winner_id,
            "next_match_id": self.next_match_id,
            "next_match_slot": self.next_match_slot
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Match":
        """Create a Match instance from a dictionary."""
        t1_data = data.get("team1")
        t2_data = data.get("team2")
        return cls(
            match_id=data["id"],
            round_id=data.get("round_id", "1/16"),
            match_number=data.get("match_number", 1),
            bracket_side=data.get("bracket_side", "left"),
            team1=Team.from_dict(t1_data) if t1_data else None,
            team2=Team.from_dict(t2_data) if t2_data else None,
            score1=data.get("score1"),
            score2=data.get("score2"),
            winner_id=data.get("winner_id"),
            next_match_id=data.get("next_match_id"),
            next_match_slot=data.get("next_match_slot")
        )
