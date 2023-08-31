import unittest
from logic_by_python import *

class TestAddNeighbors(unittest.TestCase):
    def test_add_neighbors(self):
        result = add_neighbors(2, 2)
        self.assertEqual(result, [(3, 2), (1, 2), (2, 3), (2, 1)])

class TestChangeKoSpot(unittest.TestCase):
    def test_change_ko_spot(self):
        Board(5, [])
        change_ko_spot(3, 2)
        result = (3, 2)
        self.assertEqual(result, Board.ko_spot)
    
    def test2_change_ko_spot(self):
        Board(5, [])
        change_ko_spot()
        result = (-1, -1)
        self.assertEqual(result, Board.ko_spot)

class TestBoard(unittest.TestCase):

    def test_making_empty_board(self):
        board = Board(5, [])
        result = [['.'] * 5 for _ in range(5)]
        self.assertEqual(result, board.board)
    
    def test_making_situation(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]
        board = Board(3, my_board)
        result = my_board
        self.assertEqual(result, board.board)

    def test_is_outside(self):
        board = Board(5, [])
        self.assertTrue(board.is_outside(-1, 2))
        self.assertFalse(board.is_outside(0, 4))
        
    def test_get_status(self):
        board = Board(5, [])
        board.board[1][1] = Status.black
        self.assertEqual(board.get_status(1, 1), Status.black)

    def test_change(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        board.change(0, 1, 'W')
        result = [
            ['.', 'W', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]  
        self.assertEqual(result, board.board)

    def test_remove_dead_group(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'B'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        board.remove_dead_group([(1, 1), (0, 2)])
        result = [
            ['.', 'B', '.'],
            ['B', '.', 'B'],
            ['.', 'B', '.']
        ]  
        self.assertEqual(result, board.board)
    
    def test_get_dead_group(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'W'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = sorted(board.get_dead_group(1, 1))
        self.assertEqual(result, [(0, 2), (1, 1), (1, 2)])

    def test2_get_dead_group(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = board.get_dead_group(1, 1)
        self.assertEqual(result, [])

    def test_get_killed_by_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'B'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        result = sorted(board.get_killed_by_move(1, 2))
        self.assertEqual(result, [(0, 2), (1, 1)])
        
    def test2_get_killed_by_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = board.get_killed_by_move(2, 2)
        self.assertEqual(result, [])

    def test_find_ko_spot(self):
        my_board = [
            ['W', '.', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = board.find_ko_spot(0, 0)
        self.assertEqual(result, (0, 1))
        
class TestGo(unittest.TestCase):
    def test_handle_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(0, 0, Status.white)
        result = board.board
        expect = [
            ['W', '.', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ] 
        self.assertEqual(result, expect)

    def test2_handle_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(0, 0, Status.white)
        result = board.ko_spot
        self.assertEqual(result, (0, 1))
    
    def test3_handle_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(1, 2, Status.white)
        result = board.board
        expect = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        self.assertEqual(result, expect)
    
    def test4_handle_move(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(1, 2, Status.black)
        result = board.board
        expect = [
            ['.', 'B', '.'],
            ['B', '.', 'B'],
            ['.', 'B', '.']
        ]
        self.assertEqual(result, expect)



if __name__ == '__main__':
    unittest.main()