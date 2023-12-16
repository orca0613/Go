import { setUserCreated, setUserSolved, setUserTried } from "../redux/actions"
import problemStore from "../store/problemStore"
import userStore from "../store/userStore"
import { API_URL, LANGUAGE_IDX, PROBLEMINFO_DB_PATH, PROBLEM_DB_PATH, USERDETAIL_DB_PATH, USERNAME, USERPOINT, USER_DB_PATH, initialVariations } from "./constants"
import { convertFromTwoDToString } from "./functions"
import { menuWords } from "./menuWords"
import { Board, ProblemInfoFromServer } from "./types"

const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

export async function getProblemById(problemIdList: string): Promise<ProblemInfoFromServer[]> {
  console.log(problemIdList)
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

export function createUser(email: string, password: string, name: string, level: number, point: number) {
  // 회원가입. 이메일, 패스워드, 네임의 체크가 완료되지 않으면 바로 리턴됨. 회원가입 
  console.log(point)
  fetch(`${API_URL}${USER_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, level, point}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error: ', error))
}

export function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem);
  const variations = initialVariations
  const answers = initialVariations

  fetch(`${API_URL}${PROBLEM_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({initialState, creator, variations, answers, level, comment, color}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error:', error));
}

export function removeProblem(id: string) {
  fetch(`${API_URL}${PROBLEM_DB_PATH}/delete/${id}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => {console.log("Error", error)})
}

export function removeProblemInformation(problemId: string) {
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/delete/${problemId}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(data => {
      addCreated(data.id)
      alert(data.response)
    })
    .catch(error => {console.log("Error", error)})
}

export function updateVariations(problemId: string, variations: object) {
  fetch(`${API_URL}${PROBLEM_DB_PATH}/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, variations}),
  })
    .then(response => response.json())
    .catch(error => console.error('Error: ', error))
}

export function updateAnswers(problemId: string, answers: object) {
  fetch(`${API_URL}${PROBLEM_DB_PATH}/update-answers`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, answers}),
  })
    .then(response => response.json())
    .then(data => alert(data.response))
    .catch(error => console.error('Error: ', error))
}

export function modifyProblem(problemId: string, problem: Board, comment: string, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem)
  fetch(`${API_URL}${PROBLEM_DB_PATH}/modify-problem`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
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
  localStorage.setItem(USERPOINT, String(newPoint))
  console.log(newPoint)
  fetch(`${API_URL}${USER_DB_PATH}/add-point`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, point})
  })
    .catch(error => console.error("Error: ", error))
}

export function deductPoint(point: number) {
  const name = localStorage.getItem(USERNAME)
  const curPoint = Number(localStorage.getItem(USERPOINT))
  const newPoint = curPoint - point
  localStorage.setItem(USERPOINT, String(newPoint))
  console.log(newPoint)
  fetch(`${API_URL}${USER_DB_PATH}/deduct-point`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, point})
  })
    .catch(error => console.error("Error: ", error))
}

export function addView() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-view`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addLike() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-like`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}

export function deductLike() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/deduct-like`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}


export function addDislike() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-dislike`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}

export function deductDislike() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/deduct-dislike`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}


export function addCorrect() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-correct`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addWrong() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/add-wrong`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addTried() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const name = localStorage.getItem(USERNAME)
  const tried = userStore.getState().userTried
  const newTried = tried.concat([problemId])
  userStore.dispatch(setUserTried(newTried))
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-tried`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, name}),
  })
    .catch(error => console.error("Error: ", error))
}


export function addSolved() {
  const idx = problemStore.getState().curIndex
  const problemId = problemStore.getState().problemList[idx]._id
  const name = localStorage.getItem(USERNAME)
  const solved = userStore.getState().userSolved
  const newSolved = solved.concat([problemId])
  userStore.dispatch(setUserSolved(newSolved))
  fetch(`${API_URL}${USERDETAIL_DB_PATH}/add-solved`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, name}),
  })
    .catch(error => console.error("Error: ", error))
}

export function addCreated(problemId: string) {
  const created = userStore.getState().userCreated
  const newCreated = created.concat([problemId])
  userStore.dispatch(setUserCreated(newCreated))
}

export async function getUserDetail(name: string | null) {
  if (name === null) {
    return
  }
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get/${name}`)
  const detail = await response.json()
  return detail
}

export async function getQuestion(problemId: string) {
  const response = await fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/get-question/${problemId}`)
  const question = await response.json()
  return question
}

export async function updateQuestion(problemId: string, questions: object) {
  fetch(`${API_URL}${PROBLEMINFO_DB_PATH}/update-question`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, questions}),
  })
    .catch(error => console.error("Error: ", error))
}

export async function getAllCreators(): Promise<string[]> {
  const response = await fetch(`${API_URL}${USERDETAIL_DB_PATH}/get-creators`)
  const creators = await response.json()
  return creators 
}


