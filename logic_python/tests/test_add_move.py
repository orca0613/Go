from main import add_move
from helpers import create_empty_board
from constants import EMPTY, BLACK, WHITE

# def add_move(board, y, x, color):
#     board[y][x] = color
#     return board

import unittest

class TestAddMove(unittest.TestCase):
    def test_add_regular_move(self):
        board = create_empty_board(2)
        result = add_move(board, 0, 0, BLACK)
        expected = [[BLACK, EMPTY], [EMPTY, EMPTY]]
        self.assertEqual(expected, result)

if __name__ == '__main__':
    unittest.main()
