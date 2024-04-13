export type Board = string[][]

export type Coordinate = [number, number]

export type Variations = {
  [key: string]: string[]
};

export type ProblemAndVariations = {
  _id: string,
  problemIdx: number,
  initialState: Board,
  variations: Variations,
  answers: Variations,
  questions: Variations,
  color: string,
  level: number,
  creator: string,
  comment: string,
  time: Date,
}

export type CreatorInfo = {
  _id: string,
  name: string,
}

export type ProblemInformation = {
  _id: string,
  problemId: string,
  problemIndex: number,
  initialState: Board,
  level: number,
  creator: string,
  view: number,
  liked: string[],
  disliked: string[],
  correctUser: string[],
  wrong: number,
  reply?: object[]
  totalCorrectUserLevel: number,
  totalWrongUserLevel: number,
  time: Date,
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
  created: number[],
  withQuestions: number[],
  tried: number[],
  solved: number[],
  liked: number[],
  disliked: number[],
  asked: number[],
  language: number,
  auto: boolean,
}

export type UserDetailFromServer = {
  _id: string,
  name: string,
  point: number,
  created: number[],
  withQuestions: number[],
  tried: number[],
  solved: number[],
  liked: number[],
  disliked: number[],
  asked: number[],
  myFollowers: string[],
  followList: string[],
  loginTime: Date,
  language: number,
  auto: boolean,
}

export type Filter = {
  tier: number,
  low: number,
  high: number,
  creator: string,
}

export type ReplyForm = {
  _id: string,
  problemId: string,
  name: string,
  comment: string,
  time: Date,
  deleted: boolean,
  deletedTime?: Date,
  modified: boolean,
  modifiedTime?: Date,
}

export type MessageForm = {
  _id: string,
  sender: string,
  receiver: string,
  title: string,
  contents: string,
  quotation: string,
  time: Date,
  checked: boolean,
  hideToReceiver: boolean,
  hideToSender: boolean,
  includeUrl: boolean,
  url?: string,
}