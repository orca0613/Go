export type handleLikedForm = {
  problemIndex: number,
  name: string,
  creator: string,
  add: boolean,
}

export type sendRequestForm = {
  problemIdx: number,
  creator: string,
  client: string,
  key:string,
  language: number,
}

export type checkRequestForm = {
  problemIdx: number,
  creator: string,
  key: string,
}