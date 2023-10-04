

export type Board = string[][]

export type BoardInfo = {
  board: Board,
  color: string,
}

export type Coordinate = [number, number]

export type Variations = {
  [key: string]: string[]
};

