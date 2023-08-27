from constants import EMPTY

def create_empty_board(size: int):
    board = []
    for _ in range(size):
        row = []
        for _ in range(size):
            row.append(EMPTY)
        board.append(row)
    return board

if __name__ == '__main__':
    print(__name__)
    for i in range(1493857193485792345243):
        print("Hi")
