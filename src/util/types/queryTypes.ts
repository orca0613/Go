import { Board, Variations } from "./types"

export type HandleLikedForm = {
  problemIndex: number,
  name: string,
  creator: string,
  add: boolean,
}

export type SendRequestForm = {
  problemIdx: number,
  creator: string,
  client: string,
  key:string,
  language: number,
}

export type CheckRequestForm = {
  problemIdx: number,
  creator: string,
  key: string,
}

export type SendMessageForm = {
  sender: string,
  receiver: string,
  title: string, 
  contents: string, 
  quotation: string,
}

export type CheckMessageForm = {
  id: string,
  name: string,
}

export type HideMessageForm = {
  idList: string,
  name: string,
  where: string,
}

export type AddProblemIndexForm = {
  problemIndex: number,
  name: string,
}

export type ChangeSettingForm = {
  name: string,
  language: number,
  level: number,
  auto: boolean,
}

export type UserDetailResponse = {
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

export type CreateAccountForm = {
  email: string,
  password: string,
  name: string,
  level: number,
  language: number,
}

export type LoginRequest = {
  email: string,
  password: string,
}

export type LoginResponse = {
  success: boolean,
  name: string,
  level: number;
  token: string;
  language: number;
}

export type AddUserForm = {
  problemIndex: number,
  name: string,
  level: number,
  problemLevel: number
}

export type ChangeCountForm = {
  problemIdx: number,
  name: string,
}

export type CreateProblemForm = {
  comment: string,
  initialState: Board,
  creator: string,
  level: number,
  color: string,
}

export type DeleteProblemForm = {
  problemIdx: number,
  creator: string, 
  level: number,
}

export type ModifyProblemForm = {
  creator: string,
  problemIdx: number, 
  initialState: Board,
  comment: string,
  level: number, 
  color: string,
}

export type UpdateVariationsForm = {
  problemIdx: number,
  name: string,
  creator: string,
  variations?: Variations,
  answers?: Variations,
  questions?: Variations
}

export type AddReplyForm = {
  problemId: string,
  comment: string,
  name: string,
}

export type HideReplyForm = {
  id: string,
  name: string,
}

export type ChangePasswordForm = {
  id: string,
  password: string,
}

export type DeleteAccountForm = {
  name: string,
  email: string,
  password: string,
}

export type CheckPasswordResponse = {
  match: boolean,
  id: string,
  reason: string
}
