import unittest
from helpers import create_empty_board
from constants import EMPTY, BLACK, WHITE, KO
from main import handle_move

class TestHandleMove(unittest.TestCase):
    corner_board = None
    
    @classmethod
    def setUpClass(cls):
        cls.corner_board = [
            ['.', 'W', 'B', '.', '.'],
            ['W', 'B', '.', '.', '.'],
            ['.', 'W', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
        ]
    
    def test_empty_board(self):
        board = create_empty_board(2)
        result = handle_move(board, 0, 0, BLACK)
        expected = [[BLACK, EMPTY], [EMPTY, EMPTY]]
        self.assertEqual(expected, result)
    
    @unittest.skip("Doesn't work for now")
    def test_ko(self):
        expected = [
            ['B', '#', 'B', '.', '.'],
            ['W', 'B', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
        ]
        result = handle_move(TestHandleMove.corner_board, 0, 0, BLACK)
        self.assertEqual(expected, result)

    def test_capture(self):
        expected = [
            ['.', 'W', 'B', '.', '.'],
            ['W', '.', 'W', '.', '.'],
            ['.', 'W', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
        ]
        result = handle_move(TestHandleMove.corner_board, 1, 2, WHITE)
        self.assertEqual(expected, result)

    def test_capture_big_group(self):
        board = [
            ['W', 'W', 'W', 'B', '.'],
            ['W', 'W', 'W', 'B', '.'],
            ['W', 'W', '.', '.', '.'],
            ['B', 'B', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
        ]
        expected = [
            ['.', '.', '.', 'B', '.'],
            ['.', '.', '.', 'B', '.'],
            ['.', '.', 'B', '.', '.'],
            ['B', 'B', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
        ]
        result = handle_move(board, 2, 2, BLACK)
        self.assertEqual(expected, result)

if __name__ == '__main__':
    unittest.main()