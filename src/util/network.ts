
import problemStore from "../store/problemStore"
import { API_URL, CREATED, LANGUAGE_IDX, PROBLEMINFO_DB_PATH, PROBLEM_DB_PATH, SOLVED, TOKEN, TRIED, USERDETAIL_DB_PATH, USERNAME, USERPOINT, USER_DB_PATH, initialVariations } from "./constants"
import { convertFromTwoDToString } from "./functions"
import { menuWords } from "./menuWords"
import { Board, CreatorInfo, InformationOfProblem, ProblemInfoFromServer, ReplyForm } from "./types"

const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

export async function getProblemById(problemIdList: string): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-id/${problemIdList}`)
  const problem = await response.json()
  return problem
}

export async function getAllProblems(): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-all`)
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string | null): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-creator/${creator}`)
  const problems = await response.json()
  return problems
}

export async function getProblemByLevel(level: number): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}${PROBLEM_DB_PATH}/get-by-level/${level}`)
  const problems = await response.json()
  return problems
}

export function checkMail(email: string) {
  // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
  return fetch(`${API_URL}${USER_DB_PATH}/check-email/${email}`)
    .then(response => response.json())
    .then(data => {
      if (data.duplicate) {
        return false
      } else {
        return true
      }
    })
    .catch(error => console.error('Error', error))
}

export function checkUserName(name: string) {
  // 유저 네임의 중복여부 확인. 이 역시 네임의 포맷이 적합한지 여부는 확인하지 않음.

  if (name.includes(' ')) {
    console.log(menuWords.nameFormWarning[languageIdx])
    return false
  }
  return fetch(`${API_URL}${USER_DB_PATH}/check-name/${name}`)
    .then(response => response.json())
    .then(data => {
      if (data.duplicate) {
        return false
      } else {
        return true
      }
    })
    .catch(error => console.error('Error', error))
}

export function createUser(email: string, password: string, name: string, level: number) {
  // 회원가입. 이메일, 패스워드, 네임의 체크가 완료되지 않으면 바로 리턴됨. 회원가입 

  fetch(`${API_URL}${USER_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, level}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error: ', error))
}

export function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem);
  const variations = initialVariations
  const answers = initialVariations
  const questions = initialVariations
  const token = localStorage.getItem(TOKEN)

  fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`

    },
    body: JSON.stringify({initialState, creator, variations, answers, questions, level, comment, color}),
  })
    .then(response => response.json())
    .then(data => {
      const created = localStorage.getItem(CREATED)
      localStorage.setItem(CREATED, created + "&" + data.id)
      alert(data.response)
    })
    .catch(error => console.error('Error:', error));
}

export function removeProblem(id: string, creator: string) {
  const created = localStorage.getItem(CREATED)?.split("&")?? []
  const idx = created.indexOf(id)
  if (idx < 0) {
    return
  }
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({id, creator}),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.response)
      created.splice(idx, 1)
      localStorage.setItem(CREATED, created.join("&"))
    })
    .catch(error => {console.log("Error", error)})
}

export function updateVariations(problemId: string, variations: object, where: string, creator?: string) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, variations, where, creator}),
  })
    .then(response => response.json())
    .then(r => console.log(r.response))
    .catch(error => console.error('Error: ', error))
}

export function modifyProblem(problemId: string, problem: Board, comment: string, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem)
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, initialState, comment, level, color}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error: ', error))
}

export function addPoint(point: number) {
  const name = localStorage.getItem(USERNAME)
  const curPoint = Number(localStorage.getItem(USERPOINT))
  const newPoint = curPoint + point
  const token = localStorage.getItem(TOKEN)
  localStorage.setItem(USERPOINT, String(newPoint))
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-point`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({name, point})
  })
    .catch(error => console.error("Error: ", error))
}

export function deductPoint(point: number) {
  const name = localStorage.getItem(USERNAME)
  const curPoint = Number(localStorage.getItem(USERPOINT))
  const newPoint = curPoint - point
  const token = localStorage.getItem(TOKEN)
  localStorage.setItem(USERPOINT, String(newPoint))
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/deduct-point`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({name, point})
  })
    .catch(error => console.error("Error: ", error))
}

export function addCount(where: string) {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, where}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addElement(where: string) {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const name = localStorage.getItem(USERNAME)
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-element`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, name, where}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function getUserDetail(name: string | null) {
  if (name === null) {
    return
  }
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get/${name}`)
  const detail = await response.json()
  return detail
}

export async function getAllCreators(): Promise<string[]> {
  const result: string[] = []
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get-creators`)
  const creators: CreatorInfo[] = await response.json()
  creators.map(c => {
    result.push(c.name)
  })
  return result 
}

export async function getProblemInformations(problemId: string): Promise<InformationOfProblem> {
  const info = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get/${problemId}`)
  const informations: InformationOfProblem = await info.json()
  return informations
}

export function addReply(problemId: string, reply: ReplyForm) {
  const token = localStorage.getItem(TOKEN)
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-reply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({problemId, reply}),
  })
    .then(response => response.json())
    .then(r => {
      alert(r.response)
    })
    .catch(error => console.error("Error: ", error))
}

export async function getReply(problemId: string): Promise<ReplyForm[]> {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-reply/${problemId}`)
  const replies: ReplyForm[] = await response.json()
  return replies
}
