def handle_move(board, y, x, color):
    if board[y][x] != '.':
        return board
    if color == 'B':
        opponent = 'W'
    else:
        opponent = 'B'
    size = len(board)
    y_direction = [0, 1, 0, -1]
    x_direction = [1, 0, -1, 0]
    killed_group = 0

    def is_captured(y, x, color):
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
            elif board[y_pos][x_pos] == '.':
                return False
            else:
                group.pop(idx)
        return bool(group)
    
    def grouping(y, x, color):
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
    
    def remove_deadgroup(group):
        for coordinate in group:
            board[coordinate[0]][coordinate[1]] = '.'
    
    def add_move(y, x, color):
        board[y][x] = color

    def clear_ko_point():
        for i in range(size):
            for j in range(size):
                if board[i][j] == '#':
                    board[i][j] = '.'
                    return
    
    add_move(y, x, color)

    suicide = is_captured(y, x, color)

    for i in range(4):
        if is_captured(y + y_direction[i], x + x_direction[i], opponent):
            dead = grouping(y + y_direction[i], x + x_direction[i], opponent)
            killed_group += len(dead)
            remove_deadgroup(dead)
    
    if not suicide:
        clear_ko_point()
        return board
    else:
        if killed_group == 0:
            board[y][x] = '.'
            return board
        elif killed_group == 1:
            clear_ko_point()
            if len(grouping(y, x, color)) == 1:
                for i in range(4):
                    if board[y + y_direction[i]][x + x_direction[i]] == '.':
                        board[y + y_direction[i]][x + x_direction[i]] = '#' 
            return board
        else:
            clear_ko_point()
            return board





    
    
    
    


"# Go" 
