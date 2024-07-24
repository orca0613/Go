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
  correctUser: string[],
  wrong: number,
  reply?: object[]
  totalCorrectUserLevel: number,
  totalWrongUserLevel: number,
  time: Date,
  liked: number,
}

export type BoardInfo = {
  board: Board,
  color: string,
  key: string,
}

export type UserInfo = {
  name: string,
  level: number,
  point: number,
  created: number[],
  withQuestions: number[],
  tried: number[],
  solved: number[],
  liked: number[],
  language: number,
  auto: boolean,
  totalLike: number,
  wrong: object,
  wrongPerLevel: object,
  totalWrong: number,
  correctPerLevel: object,
  totalCorrect: number
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
  loginTime: Date,
  language: number,
  auto: boolean,
  level: number,
  totalLike: number,
  wrong: object,
  wrongPerLevel: object,
  totalWrong: number,
  correctPerLevel: object,
  totalCorrect: number
}

export type FilterForm = {
  tier: number,
  level: number,
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

export type SampleProblemInformation = {
  _id: string,
  problemIndex: number,
  initialState: Board,
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

export type LoginRequest = {
  email: string,
  password: string,
}

export type LoginResponse = {
  name: string,
  level: number;
  token: string;
  language: number;
}

export type CreateProblemForm = {
  comment: string,
  initialState: Board,
  creator: string,
  level: number,
  color: string,
}

export type DeleteProblemFrom = {
  problemIdx: number,
  creator: string, 
  level: number,
}

export type ChangeSettingForm = {
  name: string,
  language: number,
  level: number,
  auto: boolean,
}

export type AddProblemIndexForm = {
  problemIndex: number,
  name: string,
}

export type ChangeCountForm = {
  problemIdx: number,
  where: string,
  name: string,
  count: number,
}

export type UpdateVariationsForm = {
  problemIdx: number,
  name: string,
  creator: string,
  variations?: Variations,
  answers?: Variations,
  questions?: Variations
}

export type ModifyProblemForm = {
  creator: string,
  problemIdx: number, 
  initialState: Board,
  comment: string,
  level: number, 
  color: string,
}

export type CreateAccountForm = {
  email: string,
  password: string,
  name: string,
  level: number,
  language: number,
}
