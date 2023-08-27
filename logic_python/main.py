from constants import x_direction, y_direction


def is_captured(board, y, x, color):
    '''Check whether the liberty of this stone is blocked or not.
    At first, it checks the condition of four adjacent places of the first stone, 
    and if it is the same color as this stone, it expands the range again. 
    Returns false immediately if at least one path is found in the middle, 
    and returns true if no path is found during the loop. 
    In order not to fall into an infinite loop, 
    check whether a place has been visited once as a visited set.'''
    size = len(board)
    group = [(y, x)] 
    visited = set()
    idx = 0
    while idx < len(group):
        coordinate = group[idx]
        if coordinate in visited:
            idx += 1
            continue
        y_pos = coordinate[0]
        x_pos = coordinate[1]
        if not (0 <= y_pos < size and 0 <= x_pos < size): 
            group.pop(idx)
            continue
        if board[y_pos][x_pos] == color: 
            group.append((y_pos + 1, x_pos))
            group.append((y_pos - 1, x_pos))
            group.append((y_pos, x_pos + 1))
            group.append((y_pos, x_pos - 1))
            visited.add((y_pos, x_pos))
        elif board[y_pos][x_pos] == '.' or board[y_pos][x_pos] == '#':
            return False
        else:
            group.pop(idx)
    return bool(group)

# 1 Breadth-first search to get both the coordinates of the group
# and neighbor coordinates and colors
def grouping(board, y, x, color):
    '''Returns a group of stones of the same color adjacent to this stone. 
    At first, I put this stone and four places adjacent to it into a group, 
    check their state, and if they are not the same color, 
    I remove them from the group. If it is confirmed as the same color, 
    add four adjacent places to the group from there and repeat the same operation. 
    This also eliminates the possibility of infinite loops and duplication through the visited set.'''
    size = len(board)
    group = [(y, x)]
    visited = set()
    idx = 0
    while idx < len(group):
        coordinate = group[idx]
        if coordinate in visited:
            group.pop(idx)
            continue
        y_pos = coordinate[0]
        x_pos = coordinate[1]
        if not (0 <= y_pos < size and 0 <= x_pos < size):
            group.pop(idx)
            continue
        if board[y_pos][x_pos] != color:
            group.pop(idx)
            continue
        else:
            group.append((y_pos + 1, x_pos))
            group.append((y_pos - 1, x_pos))
            group.append((y_pos, x_pos + 1))
            group.append((y_pos, x_pos - 1))
            visited.add((y_pos, x_pos))
            idx += 1
    return group

def add_move(board, y, x, color):
    board[y][x] = color
    return board

def remove_deadgroup(board, group: list[list[int]]):
    '''This function receives the location of the group that is considered 
    dead as an argument and changes the state of that location to an empty space.'''
    for coordinate in group:
        board[coordinate[0]][coordinate[1]] = '.'

def clear_ko_spot(board):
    '''This function changes the place marked with '#' to an empty space in the previous situation.'''
    size = len(board)
    for i in range(size):
        for j in range(size):
            if board[i][j] == '#':
                board[i][j] = '.'
                return
    return board

def handle_move(board, y, x, color):
    '''This function receives the current state of the board and 
    the color of the x-coordinate and y-coordinate of the place 
    you want to play as arguments, processes the move appropriately, 
    and returns the newly changed board. There are four states on 
    the board: 'B', 'W', '.', '#'. 'B' is 'black', 'W' is white, 
    '.' is an empty space '#' means a place where you cannot play temporarily because of a ko.'''
    if board[y][x] != '.': # If the received coordinates are not empty on the board or 
        return board       # are unplayable due to KO, the board is returned immediately.
    opponent = 'W' if color == 'B' else 'B'

    killed_group = 0
    
    board = add_move(board, y, x, color)

    suicide = is_captured(board, y, x, color) # Checks if the move the player is trying to play has liberty.

    for x_dir, y_dir in zip(x_direction, y_direction):
        if is_captured(board, y + y_dir, x + x_dir, opponent):
            dead = grouping(board, y + y_dir, x + x_dir, opponent)
            killed_group += len(dead)
            remove_deadgroup(board, dead)
    
    if not suicide:
        board = clear_ko_spot(board)
        return board

    if killed_group == 0:
        board[y][x] = '.'
    elif killed_group == 1:
        board = clear_ko_spot(board)
        if len(grouping(board, y, x, color)) == 1:
            for i in range(4):
                if board[y + y_direction[i]][x + x_direction[i]] == '.':
                    board[y + y_direction[i]][x + x_direction[i]] = '#' 
    else:
        board = clear_ko_spot()

    return board
