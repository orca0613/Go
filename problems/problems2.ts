import { Board, Variations } from "../util/board/types"

export const problem2: Board = [
    ['.', '.', '.', 'w', 'w', 'b', '.', '.', '.'],
    ['.', '.', '.', 'w', 'w', 'b', '.', '.', '.'],
    ['.', '.', '.', '.', 'b', 'b', '.', '.', '.'],
    ['.', 'w', 'w', 'w', 'b', '.', '.', '.', '.'],
    ['w', 'w', 'b', 'b', 'b', '.', '.', '.', '.'],
    ['b', 'b', 'b', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
]

export const variations2: Variations = {
    '0': ['21', '10'],
    '0-21': ['10'],
    '0-21-10': ['11'],
    '0-21-10-11': ['20'],
    '0-21-10-11-20': ['1'],
    '0-21-10-11-20-1': ['2'],
    '0-21-10-11-20-1-2': ['9', '11'],
    '0-21-10-11-20-1-2-9': [],
    '0-21-10-11-20-1-2-11': ['12'],
    '0-21-10-11-20-1-2-11-12': ['3', '9'],
    '0-21-10-11-20-1-2-11-12-3': ['18'],
    '0-21-10-11-20-1-2-11-12-3-18': [],
    '0-21-10-11-20-1-2-11-12-9': ['2'],
    '0-21-10-11-20-1-2-11-12-9-2': [],
    '0-10': ['21'],
    '0-10-21': ['19'],
    '0-10-21-19': ['1'],
    '0-10-21-19-1': ['2'],
    '0-10-21-19-1-2': ['11'],
    '0-10-21-19-1-2-11': ['0'],
    '0-10-21-19-1-2-11-0': ['18'],
    '0-10-21-19-1-2-11-0-18': []
} 