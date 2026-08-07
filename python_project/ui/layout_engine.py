"""
Layout Engine for PlayOff Manager
Calculates responsive coordinates, match widget dimensions, offsets, and connector line paths.
"""

from typing import Dict, Tuple, List


class LayoutEngine:
    """
    Calculates 2D positions for matches in a 16-team PlayOff bracket.
    Layout:
      Left side:  R16 (x0) -> R8 (x1) -> R4 (x2)
      Center:     FINAL (xC)
      Right side: R16 (x6) <- R8 (x5) <- R4 (x4)
    """

    CARD_WIDTH = 210
    CARD_HEIGHT = 115
    ROUND_GAP = 50
    BASE_VERTICAL_GAP = 20

    @classmethod
    def calculate_positions(cls, total_width: int, total_height: int) -> Dict[str, Tuple[int, int]]:
        """
        Calculates center (x, y) coordinates for all 15 matches.
        """
        positions: Dict[str, Tuple[int, int]] = {}
        center_x = total_width // 2
        center_y = total_height // 2

        col_left_r16 = center_x - 3 * (cls.CARD_WIDTH + cls.ROUND_GAP)
        col_left_r8 = center_x - 2 * (cls.CARD_WIDTH + cls.ROUND_GAP)
        col_left_r4 = center_x - 1 * (cls.CARD_WIDTH + cls.ROUND_GAP)

        col_center = center_x

        col_right_r4 = center_x + 1 * (cls.CARD_WIDTH + cls.ROUND_GAP)
        col_right_r8 = center_x + 2 * (cls.CARD_WIDTH + cls.ROUND_GAP)
        col_right_r16 = center_x + 3 * (cls.CARD_WIDTH + cls.ROUND_GAP)

        # R16 Left (M1..M4)
        r16_step = cls.CARD_HEIGHT + cls.BASE_VERTICAL_GAP
        start_y_r16 = center_y - (1.5 * r16_step)

        for i in range(1, 5):
            y = int(start_y_r16 + (i - 1) * r16_step)
            positions[f"R16_M{i}"] = (col_left_r16, y)

        # R16 Right (M5..M8)
        for i in range(5, 9):
            y = int(start_y_r16 + (i - 5) * r16_step)
            positions[f"R16_M{i}"] = (col_right_r16, y)

        # R8 Left (M1..M2) - centered between child R16 matches
        positions["R8_M1"] = (col_left_r8, (positions["R16_M1"][1] + positions["R16_M2"][1]) // 2)
        positions["R8_M2"] = (col_left_r8, (positions["R16_M3"][1] + positions["R16_M4"][1]) // 2)

        # R8 Right (M3..M4)
        positions["R8_M3"] = (col_right_r8, (positions["R16_M5"][1] + positions["R16_M6"][1]) // 2)
        positions["R8_M4"] = (col_right_r8, (positions["R16_M7"][1] + positions["R16_M8"][1]) // 2)

        # R4 Left (M1)
        positions["R4_M1"] = (col_left_r4, (positions["R8_M1"][1] + positions["R8_M2"][1]) // 2)

        # R4 Right (M2)
        positions["R4_M2"] = (col_right_r4, (positions["R8_M3"][1] + positions["R8_M4"][1]) // 2)

        # FINAL Center
        positions["FINAL"] = (col_center, center_y)

        return positions

    @classmethod
    def get_connector_lines(cls, positions: Dict[str, Tuple[int, int]]) -> List[Tuple[Tuple[int, int], Tuple[int, int]]]:
        """
        Generate line segments connecting match cards.
        Returns pairs of ((x1, y1), (x2, y2)).
        """
        lines = []
        connections = [
            ("R16_M1", "R8_M1"), ("R16_M2", "R8_M1"),
            ("R16_M3", "R8_M2"), ("R16_M4", "R8_M2"),
            ("R16_M5", "R8_M3"), ("R16_M6", "R8_M3"),
            ("R16_M7", "R8_M4"), ("R16_M8", "R8_M4"),
            ("R8_M1", "R4_M1"), ("R8_M2", "R4_M1"),
            ("R8_M3", "R4_M2"), ("R8_M4", "R4_M2"),
            ("R4_M1", "FINAL"), ("R4_M2", "FINAL")
        ]

        for src, dst in connections:
            if src in positions and dst in positions:
                x1, y1 = positions[src]
                x2, y2 = positions[dst]
                lines.append(((x1, y1), (x2, y2)))

        return lines
