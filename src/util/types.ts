export type Board = string[][]

export type Coordinate = [number, number]

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

export type ProblemFromServer = {
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

export type CreatorInfo = {
  _id: string,
  name: string,
}

export type ReplyForm = {
  name: string,
  comment: string,
  date: Date,
}

export type ProblemInformation = {
  _id: string,
  problemId: string,
  view: number,
  liked: string[],
  disliked: string[],
  correctUser: string[],
  wrong: number,
  reply?: object[]
  totalCorrectUserLevel: number,
  totalWrongUserLevel: number,
}

export type BoardInfo = {
  board: Board,
  color: string,
  key: string,
}

export type UserInfo = {
  name: string,
  token: string,
  level: number,
  point: number,
  created: string[],
  withQuestions: string[],
  tried: string[],
  solved: string[],
  liked: string[],
  disliked: string[],
}

export type UserDetailFromServer = {
  _id: string,
  name: string,
  point: number,
  created: string[],
  withQuestions: string[],
  tried: string[],
  solved: string[],
  liked: string[],
  disliked: string[],
  asked: string[],
  myFollowers: string[],
  followList: string[],
  loginTime: Date,
}