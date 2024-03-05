import { API_URL, LANGUAGE_IDX, USERINFO, USER_DB_PATH, initialUserInfo } from "../util/constants"
import { menuWords } from "../util/menuWords"
import { UserInfo } from "../util/types"

export async function checkMail(email: string) {
  // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-email/${email}`)
  const data = await response.json()
  if (data.duplicate) {
    return false
  } else {
    return true
  }
}

export async function checkUserName(name: string) {
  // 유저 네임의 중복여부 확인. 이 역시 네임의 포맷이 적합한지 여부는 확인하지 않음.
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  if (name.includes(' ')) {
    console.log(menuWords.nameFormWarning[languageIdx])
    return false
  }
  const response = await fetch(`${API_URL}${USER_DB_PATH}/check-name/${name}`)
  const data = await response.json()
  if (data.duplicate) {
    return false
  } else {
    return true
  }
}

export async function createUser(email: string, password: string, name: string, level: number) {
  // 회원가입. 이메일, 패스워드, 네임의 체크가 완료되지 않으면 바로 리턴됨. 회원가입 
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const response = await fetch(`${API_URL}${USER_DB_PATH}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, level}),
  })
  if (response) {
    alert(menuWords.checkMailWarning[languageIdx])
  }
}

export async function logIn(email: string, password: string): Promise<string> {
  // 이메일과 패스워드를 통해 로그인 시도. 로그인에 성공하면 서버로부터 유저의 정보가 리턴됨.
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  const userData = await response.json()
  if (userData.name) {
    alert(`${menuWords.hi[languageIdx]} ${userData.name}`)
    const newUserInfo: UserInfo = {
      ...userInfo,
      name: userData.name,
      level: userData.level,
      token: userData.token,
    }
    localStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
    return userData.name
  } else {
    alert(userData.response)
    return "" 
  }
}

export async function verifyMail(userId: string): Promise<boolean> {
  // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
  const response = await fetch(`${API_URL}${USER_DB_PATH}/verify/${userId}`, {method: 'PATCH'})
  const result = await response.json()
  if (result.verify) {
    return true
  } else {
    return false
  }
}
