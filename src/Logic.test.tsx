import { addNeighbors, changeStatus, getDeadGroup, getStatus, handleMove, isOutside, removeDeadGroup } from './gologic/logic';
import { Board, Coordinate } from './util/types/types';



test('isOutside', () => {
  const coord1: Coordinate = [3, 5]
  const coord2: Coordinate = [-1, 5]
  const coord3: Coordinate = [0, 8]
  
  const case1 = isOutside(coord1, 5) // Not smaller than board size
  const case2 = isOutside(coord2, 8) // Smaller than zero
  const case3 = isOutside(coord3, 9) // inside of board

  expect(case1).toBe(true);
  expect(case2).toBe(true)
  expect(case3).toBe(false)
});

test('addNeighbors', () => {
  const coord1: Coordinate = [2, 3]
  const case1 = addNeighbors(coord1)
  const expectedResult: Coordinate[] = [[3, 3], [1, 3], [2, 4], [2, 2]]

  expect(case1).toEqual(expectedResult)
})

test('getStatus', () => {
  const board: Board = [
    ['.', 'w'],
    ['b', '.'],
  ]
  const coord1: Coordinate = [0, 0]
  const coord2: Coordinate = [0, 1]
  const coord3: Coordinate = [1, 0]

  const case1 = getStatus(board, coord1)
  const case2 = getStatus(board, coord2)
  const case3 = getStatus(board, coord3)

  const expectedCase1 = '.'
  const expectedCase2 = 'w'
  const expectedCase3 = 'b'

  expect(case1).toBe(expectedCase1)
  expect(case2).toBe(expectedCase2)
  expect(case3).toBe(expectedCase3)
})

test('changeStatus', () => {
  const board: Board = [
    ['.', 'w'],
    ['b', '.'],
  ]
  const coord1: Coordinate = [0, 0]
  const case1 = changeStatus(board, coord1, 'b')
  const expectedCase1: Board = [
    ['b', 'w'],
    ['b', '.'],
  ]

  expect(case1).toEqual(expectedCase1)
})

test('removeDeadGroup', () => {
  const board1: Board = [
    ['b', 'w'],
    ['.', '.'],
  ]

  const board2: Board = [
    ['b', 'w'],
    ['.', 'b'],
  ]

  const group1: Coordinate[] = []
  const group2: Coordinate[] = [[0, 1]]

  const case1 = removeDeadGroup(board1, group1)
  const case2 = removeDeadGroup(board2, group2)

  const expectedCase1: Board = board1
  const expectedCase2: Board = [
    ['b', '.'],
    ['.', 'b'],
  ] 

  expect(case1).toEqual(expectedCase1)
  expect(case2).toEqual(expectedCase2)
})

test('getDeadGroup', () => {
  const board: Board = [
    ['b', 'w'],
    ['.', 'b'],
  ]
  const coord1: Coordinate = [0, 1]
  const coord2: Coordinate = [1, 0]

  const case1 = getDeadGroup(board, coord1, 'w', 'b')
  const case2 = getDeadGroup(board, coord2, 'w', 'b')

  const expectedCase1: Coordinate[] = [[0, 1]]
  const expectedCase2: Coordinate[] = []

  expect(case1).toEqual(expectedCase1)
  expect(case2).toEqual(expectedCase2)
})

test('handleMove', () => {
  const board1: Board = [
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
  ]

  const coord1: Coordinate = [1, 2]
  const case1 = handleMove({
    board: board1,
    color: 'b',
    currentMove: coord1,
  })

  const expectedCase1: Board = [
    ['.', '.', '.', '.'],
    ['.', '.', 'b', '.'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
  ] 

  expect(case1).toEqual(expectedCase1)
})

test('handleMove', () => {
  const board1: Board = [
    ['.', 'w', '.', '.'],
    ['.', 'b', 'w', '.'],
    ['.', 'w', '.', '.'],
    ['.', '.', '.', '.'],
  ]

  const coord1: Coordinate = [1, 0]
  const case1 = handleMove({
    board: board1,
    color: 'w',
    currentMove: coord1,
  })

  const expectedCase1: Board = [
    ['.', 'w', '.', '.'],
    ['w', '.', 'w', '.'],
    ['.', 'w', '.', '.'],
    ['.', '.', '.', '.'],
  ] 

  expect(case1).toEqual(expectedCase1)
})

test('handleMove', () => {
  const board1: Board = [
    ['w', 'w', 'w', 'b'],
    ['w', '.', 'w', 'b'],
    ['w', 'w', 'w', 'b'],
    ['b', 'b', 'b', '.'],
  ]

  const coord1: Coordinate = [1, 1]
  const case1 = handleMove({
    board: board1,
    color: 'b',
    currentMove: coord1,
  })

  const expectedCase1: Board = [
    ['.', '.', '.', 'b'],
    ['.', 'b', '.', 'b'],
    ['.', '.', '.', 'b'],
    ['b', 'b', 'b', '.'],
  ] 

  expect(case1).toEqual(expectedCase1)
})

