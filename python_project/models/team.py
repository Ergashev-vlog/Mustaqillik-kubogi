"""
Team Model for PlayOff Manager
Represents a football team participating in the tournament.
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class Team:
    """
    Class representing a single football team.
    
    Attributes:
        id (str): Unique identifier for the team.
        name (str): Full display name of the team.
        logo_path (Optional[str]): Path to the team logo image if available.
    """
    id: str
    name: str
    logo_path: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert team instance to a dictionary for JSON serialization."""
        return {
            "id": self.id,
            "name": self.name,
            "logo_path": self.logo_path
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Team":
        """Create a Team instance from a dictionary."""
        return cls(
            id=data.get("id", ""),
            name=data.get("name", "Noma'lum Jamoa"),
            logo_path=data.get("logo_path")
        )
