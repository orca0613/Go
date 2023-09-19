
export type Coordinate = [number, number]

export interface Move {
  white: Coordinate[]
  black: Coordinate[]
}

export const test_problem: Move = {
  white: [
    [3, 1],
    [3, 2],
    [4, 2],
    [4, 3],
    [5, 3],
    [7, 3],
    [8, 3],
    [8, 2],
    [9, 1],
  ],
  black: [
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 3],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
    [8, 4],
    [9, 4],
    [9, 3],
    [9, 2],
    [10, 2],
  ]
}
