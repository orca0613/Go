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
        result = Board.ko_spot
        self.assertEqual(result, (3, 2))
    
    def test2_change_ko_spot(self):
        Board(5, [])
        change_ko_spot()
        result = Board.ko_spot
        self.assertEqual(result, (-1, -1))

class TestBoard(unittest.TestCase):

    def test_making_empty_board(self): # Situation when passing an empty list as a parameter when creating the board class
        board = Board(5, [])
        result = board.board
        expect = [[Status.empty] * 5 for _ in range(5)]
        self.assertEqual(result, expect)
    
    def test_making_situation(self): # When creating a board class and conveying a specific situation
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]
        board = Board(3, my_board)
        result = board.board
        expect = my_board
        self.assertEqual(result, expect)

    def test_is_outside(self):
        board = Board(5, [])
        self.assertTrue(board.is_outside(-1, 2))
        self.assertFalse(board.is_outside(0, 4))
        
    def test_get_status(self):
        board = Board(5, [])
        board.board[1][1] = Status.black
        result = board.get_status(1, 1)
        self.assertEqual(result, Status.black)

    def test_change(self):
        board = Board(5, [])
        board.change(0, 1, Status.white)
        result = board.get_status(0, 1)
        self.assertEqual(result, Status.white)

    def test_remove_dead_group(self):
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'B'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        board.remove_dead_group([(1, 1), (0, 2)])
        result = board.board
        expect = [
            ['.', 'B', '.'],
            ['B', '.', 'B'],
            ['.', 'B', '.']
        ]  
        self.assertEqual(result, expect)
    
    def test_get_dead_group(self):
        '''If the group containing the coordinates passed as a parameter dies, 
        the coordinates of the entire group are returned.'''
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'W'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = sorted(board.get_dead_group(1, 1))
        expect = [(0, 2), (1, 1), (1, 2)]
        self.assertEqual(result, expect)

    def test2_get_dead_group(self):
        '''If the group containing the coordinates passed 
        as a parameter is not dead, an empty list is returned.'''
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = board.get_dead_group(1, 1)
        self.assertEqual(result, [])

    def test_get_killed_by_move(self):
        '''If it is actually a killing move, the coordinates of 
        the stones that died due to the move are returned.'''
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', 'B'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        result = sorted(board.get_killed_by_move(1, 2))
        expect = [(0, 2), (1, 1)]
        self.assertEqual(result, expect)
        
    def test2_get_killed_by_move(self):
        '''If the coordinates passed as a parameter are 
        not a killing move, an empty list is returned.'''
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        result = board.get_killed_by_move(2, 2)
        self.assertEqual(result, [])

    def test_find_ko_spot(self):
        '''Returns the coordinates that will be the ko spot from the 
        adjacent coordinates of the coordinates passed as parameters.
        This function is called only in situations where ko spot is to be created.'''
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
        '''Check whether the board situation and ko spot 
        change as player takes one point of opponent.'''
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(0, 0, Status.white)
        ko_spot = board.ko_spot
        expect_ko_spot = (0, 1)
        result = board.board
        expect = [
            ['W', '.', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', 'B']
        ] 
        self.assertEqual(result, expect)
        self.assertEqual(ko_spot, expect_ko_spot)
    
    def test2_handle_move(self): # When the player plays a suicide move
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
    
    def test3_handle_move(self): # When a player takes multiple opponent's stones with one move
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

    def test4_handle_move(self): # If the player plays where another stone has already been placed
        my_board = [
            ['.', 'B', 'W'],
            ['B', 'W', '.'],
            ['.', 'B', '.']
        ]  
        board = Board(3, my_board)
        go = Go(3, board.board)
        go.handle_move(0, 1, Status.white)
        result = board.board
        expect = my_board
        self.assertEqual(result, expect)



if __name__ == '__main__':
    unittest.main()