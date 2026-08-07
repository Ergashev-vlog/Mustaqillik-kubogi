"""
Storage Service for PlayOff Manager
Handles reading and writing tournament state data to/from JSON files.
"""

import json
import os
from typing import Optional
from models.tournament import Tournament


class StorageService:
    """
    Service for persistent storage operations using JSON format.
    """

    @staticmethod
    def save_tournament(tournament: Tournament, file_path: str) -> bool:
        """
        Saves tournament instance to specified JSON file.
        Returns True on success, False on error.
        """
        try:
            data = tournament.to_dict()
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Error saving tournament to JSON: {e}")
            return False

    @staticmethod
    def load_tournament(file_path: str) -> Optional[Tournament]:
        """
        Loads tournament instance from specified JSON file.
        Returns Tournament instance or None if file error.
        """
        if not os.path.exists(file_path):
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return Tournament.from_dict(data)
        except Exception as e:
            print(f"Error loading tournament from JSON: {e}")
            return None
