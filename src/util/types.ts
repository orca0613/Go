

export type Board = string[][]

export type BoardInfo = {
  board: Board,
  color: string,
}

export type Coordinate = [number, number]

export type Variations = {
  [key: string]: string[]
};

export type ProblemInfo = {
  problem: Board,
  variations: Variations,
  color: string,
  level: number,
  creator: string,
  comment: string,
}