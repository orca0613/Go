import { API_URL, LANGUAGE_IDX, TOKEN, USERLEVEL, USERNAME, USER_DB_PATH } from "../util/constants"
import { menuWords } from "../util/menuWords"

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
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
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

export function logIn(email: string, password: string): Promise<string> {
  // 이메일과 패스워드를 통해 로그인 시도. 로그인에 성공하면 서버로부터 유저의 정보가 리턴됨.
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  return fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(response => response.json())
    .then(user => {
      if (user.name !== undefined) {
        alert(`${menuWords.hi[languageIdx]} ${user.name}`)
        localStorage.setItem(USERNAME, user.name)
        localStorage.setItem(USERLEVEL, user.level)
        localStorage.setItem(TOKEN, user.token)
        return user.name
      } else {
        alert(user.response)
        return ""
      }
    })
    .catch(error => console.error('Error: ', error))
}