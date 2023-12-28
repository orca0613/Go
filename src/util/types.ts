export type Board = string[][]

export type Coordinate = [number, number]

export type BoardInfo = {
  board: Board,
  color: string,
}

export type Variations = {
  [key: string]: string[]
};

export type ProblemInfo = {
  _id: string,
  initialState: Board,
  variations: Variations,
  answers: Variations,
  questions: Variations,
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
  questions: Variations,
  color: string,
  level: number,
  creator: string,
  comment: string,
}

export interface Dropdown {
  label?: string,
  value?: string
}

export type CreatorInfo = {
  _id: string,
  name: string,
}

export type ReplyForm = {
  name: string,
  comment: string,
  date: Date,
}

export type InformationOfProblem = {
  _id: string,
  problemId: string,
  view: number,
  like: number,
  dislike: number,
  correct: number,
  wrong: number,
  reply?: object[]
}