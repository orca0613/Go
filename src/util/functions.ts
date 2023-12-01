import { getDeadGroup, handleMove } from "../gologic/logic"
import { Board, Coordinate, ProblemInfoFromServer, Variations } from "./types"
import _ from 'lodash'
import { API_URL } from "./constants"

export function playMoveAndReturnNewBoard(board: Board, coord: Coordinate, color: string) {
    let newBoard = _.cloneDeep(board)
    newBoard = handleMove(
      {
        board: newBoard,
        color: color,
        currentMove: coord
      }
    )
    return newBoard
}

export function makeRandomNumber(n: number) {
    return Math.floor(Math.random() * n)
  }

export function getCoordinate(e: React.MouseEvent, lineSpacing: number) {
  const x = Math.floor(e.clientX / lineSpacing)
  const y = Math.floor(e.clientY / lineSpacing)
  const coord: Coordinate = [y, x]
  return coord
}

export function makingEmptyBoard(size: number): Board {
  const board: Board = []
  for (let i = 0; i < size; i++) {
    board.push([])
    for (let j = 0; j < size; j++) {
      board[i].push('.')
    }
  }
  return board
}

export function convertFromStringToTwoD(board: string): Board {
  const boardSize = Math.round(board.length ** 0.5)
  if (boardSize !== board.length ** 0.5) {
    throw Error("bad board!")
  }

  const newBoard: Board = []
  for (let i = 0; i < boardSize; i++) {
    const line = board.slice(0, boardSize).split("")
    newBoard.push(line)
    board = board.slice(boardSize)
  }
  return newBoard
}

export function convertFromTwoDToString(board: Board): string {
  let newBoard = ""
  for (let i = 0; i < board.length; i++) {
    newBoard += board[i].join("")
  }
  return newBoard
}

export function divmod(num1: number, num2: number): Coordinate {
  const share = Math.floor(num1 / num2)
  const remainder = num1 % num2
  return [share, remainder]
}

export function getProblemById(problemId: string): object {
  return fetch(`${API_URL}/problems/get-problems-by-id/${problemId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data
    })
    .catch(error => {
      throw (error)
    })
}

export async function getProblems(): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}/problems/get-all-problems`)
  const problems = await response.json()
  return problems 
}

export async function getProblemByCreator(creator: string): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}/problems/get-problems-by-creator/${creator}`)
  const problems = await response.json()
  return problems
}

export async function getProblemByLevel(level: number): Promise<ProblemInfoFromServer[]> {
  const response = await fetch(`${API_URL}/problems/get-problems-by-level/${level}`)
  const problems = await response.json()
  return problems
}

export function checkMail(email: string) {
  // 이메일 중복여부 확인. 문자열이 이메일의 포맷에 맞는지 확인하는 기능은 아직 없음.
  return fetch(`${API_URL}/users/check-email/${email}`)
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
    console.log('Space characters are not valid characters.')
    return false
  }
  return fetch(`${API_URL}/users/check-name/${name}`)
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

export function createUser(email: string, password: string, name: string, level:number) {
  // 회원가입. 이메일, 패스워드, 네임의 체크가 완료되지 않으면 바로 리턴됨. 회원가입 
  fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, level}),
  })
    .then(response => alert('success'))
    .catch(error => console.error('Error: ', error))
}

export function createProblem(comment: string, problem: Board, creator: string | null, level: number, color: string) {
  const initialState = convertFromTwoDToString(problem);
  const variations = {"0": []}

  fetch(`${API_URL}/problems/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({initialState, creator, variations, level, comment, color}),
  })
    .then(response => response.json())
    .then(data => alert("success"))
    .catch(error => console.error('Error:', error));
}

export function removeProblem(id: string) {
  fetch(`${API_URL}/problems/delete/${id}`, {
    method: "DELETE"
  })
    .then(response => alert(response))
    .catch(error => {console.log("Error", error)})
}

export function updateVariations(problemId: string, variations: object) {
  fetch(`${API_URL}/problems/update-variations`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({problemId, variations}),
  })
    .then(response => alert(response))
    .catch(error => console.error('Error: ', error))
}

export function addVariations(currentKey: string, variations: Variations, l: string[]) {
  if (currentKey in variations) {
    console.log('exist this variation')
    return variations
  }
  const newVariations = _.cloneDeep(variations)
  newVariations[currentKey] = []
  let key = currentKey
  for (let i = l.length - 1; i > 0; i--) {
    const value = l[i]
    key = key.slice(0, key.length - (value.length + 1))
    if (key in newVariations) {
      newVariations[key].push(value)
    } else {
      newVariations[key] = [value]
    }
    if (key in variations) {
      break
    }
  }
  return newVariations
}

export function removeVariations(currentKey: string, variations: Variations) {
  const newVariations = _.cloneDeep(variations)
  let key = currentKey
  const l = currentKey.split("-")
  while (true) {
    if (newVariations[key].length === 0 && key !== '0') {
      delete newVariations[key]
      const lastMove = l.pop()
      key = lastMove? key.slice(0, key.length - (lastMove.length + 1)) : key
      newVariations[key] = newVariations[key].filter(element => element !== lastMove)
    } else {
      break
    }
  }
  return newVariations
}

export function isLegalBoard(board: Board) {
  const size = board.length
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const color = board[i][j]
      if (color !== ".") {
        const opponentColor = color === "b"? "w" : "b"
        const deadGroup = getDeadGroup(board, [i, j], color, opponentColor)
        if (deadGroup.length > 0) {
          return false
        }
      }
    }
  }
  return true
}