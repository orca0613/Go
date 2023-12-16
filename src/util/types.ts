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
  _id: string,
  initialState: Board,
  variations: Variations,
  answers: Variations,
  color: string,
  level: number,
  creator: string,
  comment: string,
}

export type ProblemInfoFromServer = {
  _id: string,
  initialState: string,
  variations: Variations,
  answers: Variations
  color: string,
  level: number,
  creator: string,
  comment: string,
}