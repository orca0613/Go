def add_neighbors(group: [(int, int)], y: int, x: int) -> [(int, int)]:
    group.append((y, x + 1))
    group.append((y, x - 1))
    group.append((y + 1, x))
    group.append((y - 1, x))
    return group


class Status:

    empty = '.'
    ko = '#'
    black = 'B'
    white = 'W'

    def __init__(self, status) -> None:
        self.status = status

class Board:
    def __init__(self, size: int) -> None:
        self.coordinate_status = [[Status.empty] * size for _ in range(size)]
        self.size = size
    
    def is_outside(self, y: int, x: int) -> bool:
        return not (0 <= y < self.size and 0 <= x < self.size)
    
    def get_status(self, y: int, x: int) -> Status:
        return self.coordinate_status[y][x]
    
    def change(self, y: int, x: int, status: Status):
        self.coordinate_status[y][x] = status

    def remove_dead_group(self, group: [(int, int)]):
        for coord in group:
            y, x = coord[0], coord[1]
            self.coordinate_status[y][x] = Status.empty
    
    def get_dead_group(self, y: int, x: int) -> [(int, int)]:
        state = self.get_status(y, x)
        if state == Status.empty or state == Status.ko:
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
                group = add_neighbors(group, y_pos, x_pos)
                visited.add(coord)
                idx += 1
                continue
            elif status == opponent:
                group.pop(idx)
                continue
            else:
                return []
        return group
    
    def get_killed_by_move(self, y: int, x: int) -> [(int, int)]:
        neighbors = add_neighbors([], y, x)
        color = self.get_status(y, x)
        dead = []
        for neighbor in neighbors:
            y_pos, x_pos = neighbor[0], neighbor[1]
            if not self.is_outside(y_pos, x_pos) and self.get_status(y_pos, x_pos) != color:
                dead += self.get_dead_group(y_pos, x_pos)
        return dead

    def clear_ko_spot(self):
        for i in range(self.size):
            for j in range(self.size):
                if self.get_status(i, j) == Status.ko:
                    self.change(i, j, Status.empty)
                    return
        return
    
    def find_ko_spot(self, y: int, x: int) -> (int, int):
        group = add_neighbors([], y, x)
        for coord in group:
            y, x = coord[0], coord[1]
            if not self.is_outside(y, x) and self.get_status(y, x) == Status.empty:
                return (y, x)
    
class Go():
    def __init__(self, size) -> None:
        self.board = Board(size)

    def handle_move(self, y: int, x: int, color: Status):
        if self.board.get_status(y, x) != Status.empty:
            return
        self.board.change(y, x, color)
        suicideGroup = self.board.get_dead_group(y, x)
        print('suicide: ', suicideGroup)
        killed = self.board.get_killed_by_move(y, x)
        print('killed: ', killed)
        self.board.remove_dead_group(killed)
        if len(suicideGroup) == 0:
            self.board.clear_ko_spot()
        else:
            if len(killed) == 0:
                self.board.change(y, x, Status.empty)
            elif len(killed) == 1 and len(suicideGroup) == 1:
                self.board.clear_ko_spot()
                new_ko_spot = self.board.find_ko_spot(y, x)
                y_ko, x_ko = new_ko_spot[0], new_ko_spot[1]
                self.board.change(y_ko, x_ko, Status.ko)
            else:
                self.board.clear_ko_spot()
        return
            
