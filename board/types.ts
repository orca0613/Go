
export type Coordinate = [number, number]

export interface Move {
  coord: Coordinate
  color: string
}

export const test_problem: Move[] = [
  { color: 'black', coord: [2, 1] },
  { color: 'black', coord: [2, 2] },
  { color: 'black', coord: [2, 3] },
  { color: 'black', coord: [3, 3] },
  { color: 'black', coord: [3, 4] },
  { color: 'black', coord: [4, 4] },
  { color: 'black', coord: [5, 4] },
  { color: 'black', coord: [6, 4] },
  { color: 'black', coord: [6, 4] },
  { color: 'black', coord: [6, 4] },
  { color: 'black', coord: [7, 4] },
  { color: 'black', coord: [8, 4] },
  { color: 'black', coord: [9, 4] },
  { color: 'black', coord: [9, 3] },
  { color: 'black', coord: [9, 2] },
  { color: 'black', coord: [10, 2] },

  { color: 'white', coord: [3, 1] },
  { color: 'white', coord: [3, 2] },
  { color: 'white', coord: [4, 2] },
  { color: 'white', coord: [4, 3] },
  { color: 'white', coord: [5, 3] },
  { color: 'white', coord: [7, 3] },
  { color: 'white', coord: [8, 3] },
  { color: 'white', coord: [8, 2] },
  { color: 'white', coord: [9, 1] },
]