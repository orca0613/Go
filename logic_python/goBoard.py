from enum import Enum

        



class State(Enum):
    BLACK = 'B'
    WHITE = 'W'
    EMPTY = '.'
    KO = '#'


class Coord:
    def __init__(self) -> None:
        pass



def get_opposite_state(state: State):
    if state not in [State.BLACK, State.WHITE]:
        raise ValueError("Can only get opposite color of black or white")
    return State.BLACK if state == State.WHITE else State.WHITE

def get_group_and_neighbors(board, c, color) -> tuple[list[Coord], tuple[State, Coord]]:
    """Return all coordinates inside the group and its neighbors"""


class GoBoard:
    def __init__(self) -> None:
        self.board = None
        self.group = None
        self.neighbors = None
        
    def add_move(self, c: Coord, color: State):
        """Add a move at x, y with color"""
        # get the current group and all of its neighbors for later use
        self.group, self.neighbors = get_group_and_neighbors(self.board, c, color)
        if self.is_legal(c, color):
            # Change self.board to add the move
            self._add_move(c, color)
        else:
            raise ValueError("Cannot play a move that is illegal")
        
    def is_legal(self, c, color):
        """Return true if playing color can play a move at c"""
        if self._is_ko(c):
            return False
        
        if self._find_capture(c, color): # maybe
            return True
        
        if self._is_suicide(color):
            return False
        
        return True
    
    def _add_move(self, c, color):
        """Play the move. Remove dead groups if necessary and mark kos for future moves"""
        self.board[c] = color
        group_to_be_captured = self._find_capture(c, color)
        if group_to_be_captured:
            self._remove_captured_group(group_to_be_captured)
        if (len(group_to_be_captured) == 1 and len(group_to_be_captured[0]) == 1 \
            and len(self.group) == 1 and self._is_suicide(color)):
            self._mark_ko(c)
        
    def _remove_captured_group(self, groups: list[list[Coord]]):
        """Removes the captured group from the board"""
        for group in groups:
            for c in group:
                self.board[c] = State.EMPTY
        
    def _find_capture(self, c, color) -> list[list[Coord]]:
        """Checks if a move captures any neighboring opponent's groups"""
        opponents_groups_this_move_captures: list[list[Coord]] = []
        for state, c in self.neighbors:
            if state == State.EMPTY:
                pass
            elif state == get_opposite_state(color):
                # check neighboring opponent's groups to see if they are captured
                group, neighbors = get_group_and_neighbors(self.board, c, state)
                if all([n == state for n in neighbors]):
                    opponents_groups_this_move_captures.append(group)
        return opponents_groups_this_move_captures
        
    def _is_suicide(self, color) -> bool:
        """Checks if playing a move at c is a suicide move"""
        return all([n == get_opposite_state(color) for n in self.neighbors])
        
    def _mark_ko(self, c):
        """Marks the coordinate a ko"""
        self.board[c] = State.KO
        
    def _is_ko(self, c) -> bool:
        """Checks if the move at c is capturing a ko"""
        if self.board[c] == State.KO:
            return True
        return False
