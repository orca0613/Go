def add_neighbors(y: int, x: int) -> list:
    '''Receives a list and coordinates, appends coordinates adjacent to 
    the received coordinates to the list, and then returns the list.'''
    group = [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    return group

def change_ko_spot(y= -1, x= -1):
    '''When a ko spot is created, the ko spot is changed to the received coordinates.
    When no coordinates are entered, the default value is -1, -1.'''

    Board.ko_spot = (y, x)
    return

class Status:

    empty = '.'
    black = 'B'
    white = 'W'

    def __init__(self, status) -> None:
        self.status = status

class Board:

    ko_spot = (-1, -1)

    def __init__(self, size: int, board: list) -> None:
        '''Create a board by receiving the size and list. 
        If an empty list comes in, an empty board of size * size is created.'''
        self.size = size
        self.board = [[Status.empty] * size for _ in range(size)] if not board else board

    def is_outside(self, y: int, x: int) -> bool:
        # Check if the coordinates are outside the boundaries of the board.
        return not (0 <= y < self.size and 0 <= x < self.size)
    
    def get_status(self, y: int, x: int) -> Status:
        # Returns the board status at coordinates.
        return self.board[y][x]
    
    def change(self, y: int, x: int, status: Status):
        # changes the board status at coordinates.
        self.board[y][x] = status

    def remove_dead_group(self, group: list):
        # Receives a list and changes the board status of the coordinates in the list to empty.
        for coord in group:
            y, x = coord[0], coord[1]
            self.board[y][x] = Status.empty
    
    def get_dead_group(self, y: int, x: int) -> list:
        '''It receives a coordinate and returns a list of dead stones containing those coordinates. 
        If not, an empty list is returned.'''
        state = self.get_status(y, x)
        if state == Status.empty:
            return []
        opponent = Status.black if state == Status.white else Status.white
        group = [(y, x)]
        idx = 0
        visited = set()

        while idx < len(group):
            coord = group[idx]
            y_pos, x_pos = coord[0], coord[1]
            if coord in visited or self.is_outside(y_pos, x_pos):
                group.pop(idx)
                continue

            status = self.get_status(y_pos, x_pos)
            if status == state:
                group += add_neighbors(y_pos, x_pos)
                visited.add(coord)
                idx += 1
                continue
            elif status == opponent:
                group.pop(idx)
                continue
            else:
                return []
        return group
    
    def get_killed_by_move(self, y: int, x: int) -> list:
        '''Returns a list of groups of opponents killed by playing at the coordinates. 
        If it doesn't exist, an empty list is returned.'''
        neighbors = add_neighbors(y, x)
        color = self.get_status(y, x)
        dead = []
        for neighbor in neighbors:
            y_pos, x_pos = neighbor[0], neighbor[1]
            if not self.is_outside(y_pos, x_pos) and self.get_status(y_pos, x_pos) != color:
                dead += self.get_dead_group(y_pos, x_pos)
        return dead

    def find_ko_spot(self, y: int, x: int) -> tuple:
        # Finds the location to be changed to ko spot and returns its coordinates.
        group = add_neighbors(y, x)
        for coord in group:
            y, x = coord[0], coord[1]
            if not self.is_outside(y, x) and self.get_status(y, x) == Status.empty:
                return (y, x)
    
class Go():
    def __init__(self, size: int, board: list) -> None:
        '''You can create the initial state of the board by entering 
        the size and state of the desired board.'''
        self.board = Board(size, board)

    def handle_move(self, y: int, x: int, color: Status):
        '''When you enter coordinates and colors, 
        the state of the board changes according to the logic of Go.'''
        if self.board.get_status(y, x) != Status.empty or (y, x) == Board.ko_spot:
            return
        self.board.change(y, x, color)
        suicideGroup = self.board.get_dead_group(y, x)
        killed = self.board.get_killed_by_move(y, x)
        self.board.remove_dead_group(killed)
        if len(suicideGroup) == 0:
            change_ko_spot()
        else:
            if len(killed) == 0:
                self.board.change(y, x, Status.empty)
            elif len(killed) == 1 and len(suicideGroup) == 1:
                change_ko_spot()
                new_ko_spot = self.board.find_ko_spot(y, x)
                change_ko_spot(new_ko_spot[0], new_ko_spot[1])
            else:
                change_ko_spot()
        return
            
'''I tried to create a class and simplify the functions, 
but I still think functions like get_dead_group are long. 
I think it would be good to think together about whether 
there is a good way to do this. Also, would it be a good 
idea to create separate classes to manage the two functions at the top?'''