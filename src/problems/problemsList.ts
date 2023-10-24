import { Board } from "../util/types"
import { variations1, variations10, variations2, variations3, variations4, variations5, variations6 } from "./variationsList"

const problem1: Board = [
  ['.', 'b', 'w', '.', '.', '.', '.', '.', 'w', '.', '.', ],
  ['.', 'b', 'w', 'w', '.', '.', '.', 'w', 'b', 'b', '.', ],
  ['.', 'b', 'b', 'w', 'w', '.', 'w', 'w', 'b', '.', '.', ],
  ['.', '.', 'b', 'b', 'b', 'b', 'b', 'b', 'b', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', ],
]

const problem2: Board = [
  ['.', '.', '.', 'w', 'w', 'b', '.', '.', '.'],
  ['.', '.', '.', 'w', 'w', 'b', '.', '.', '.'],
  ['.', '.', '.', '.', 'b', 'b', '.', '.', '.'],
  ['.', 'w', 'w', 'w', 'b', '.', '.', '.', '.'],
  ['w', 'w', 'b', 'b', 'b', '.', '.', '.', '.'],
  ['b', 'b', 'b', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
]

const problem3: Board = [
  ['.', '.', '.', '.', 'b', 'b', 'w', 'w', '.', '.', '.', 'w', 'b', 'b', 'b', 'w', 'w', 'w', '.'],
  ['.', '.', '.', '.', 'b', 'w', 'w', '.', 'w', '.', '.', 'w', 'w', 'b', 'b', 'w', 'b', 'b', 'w'],
  ['.', '.', 'b', '.', 'b', 'b', 'b', 'w', '.', '.', '.', '.', 'w', 'w', 'b', 'b', 'b', 'b', 'w'],
  ['.', '.', 'b', 'w', '.', 'b', 'w', 'w', 'w', '.', '.', '.', 'w', 'w', 'w', 'b', 'b', 'w', '.'],
  ['.', '.', 'b', '.', 'w', 'w', 'b', 'b', 'w', '.', '.', '.', 'w', 'w', 'b', 'b', 'w', 'w', 'w'],
  ['.', 'w', 'b', '.', '.', 'b', 'b', 'b', 'w', '.', '.', 'b', 'w', 'b', '.', 'b', 'w', '.', '.'],
  ['b', 'b', 'w', '.', 'w', 'b', 'b', 'w', 'w', '.', 'w', 'w', 'b', '.', '.', 'b', 'b', 'w', '.'],
  ['w', 'b', 'b', 'b', 'b', 'b', 'w', 'b', '.', 'w', 'b', 'b', 'b', '.', '.', 'b', 'w', '.', '.'],
  ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', '.', 'w', 'b', 'w', '.', '.', 'b', 'w', '.', '.'],
  ['w', 'b', '.', '.', '.', 'w', 'b', 'b', 'w', 'w', 'w', 'b', '.', '.', '.', 'b', 'w', 'w', '.'],
  ['w', '.', 'b', 'b', 'b', 'b', '.', '.', 'b', 'b', 'b', '.', '.', '.', 'b', 'w', 'w', '.', '.'],
  ['.', 'b', '.', 'b', '.', 'b', 'b', 'b', 'w', 'b', '.', '.', '.', '.', '.', 'b', 'b', 'w', '.'],
  ['.', 'b', 'b', '.', 'b', '.', 'w', 'w', 'w', 'w', 'b', '.', '.', '.', '.', 'b', 'w', '.', '.'],
  ['.', '.', 'w', 'b', 'b', 'b', 'w', 'w', 'b', 'b', '.', '.', 'b', '.', 'b', 'b', 'w', '.', '.'],
  ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'b', 'b', '.', '.', '.', '.', 'b', 'w', 'b', 'w', '.', '.'],
  ['.', 'b', 'b', 'w', '.', '.', 'w', 'w', 'b', 'b', 'b', 'b', 'b', 'w', 'w', 'b', 'w', '.', '.'],
  ['b', 'b', '.', 'b', 'w', '.', 'w', 'b', 'b', 'w', 'b', 'w', 'w', 'w', 'b', 'w', 'b', 'w', '.'],
  ['.', 'w', 'b', 'b', 'w', 'w', '.', 'w', 'w', 'w', 'w', '.', '.', '.', '.', 'w', '.', '.', '.'],
  ['.', 'b', '.', 'b', 'b', 'w', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
]

const problem4: Board = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', 'b', 'b', 'b', '.', '.', '.', '.', '.', ],
  ['b', '.', '.', '.', 'b', 'b', '.', '.', '.', ],
  ['.', 'w', 'w', 'w', 'w', 'b', '.', 'b', 'b', ],
  ['.', '.', '.', '.', '.', '.', '.', 'b', 'w', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', ],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', ],
]

const problem5: Board = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', 'w', '.', '.'],
  ['.', '.', '.', 'b', 'w', 'w', 'w', 'w', 'b', '.', '.'],
  ['.', '.', '.', 'b', 'w', 'b', 'b', 'b', '.', 'b', '.'],
  ['.', '.', 'b', '.', 'b', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
]

const problem6: Board = [
  ['.', '.', '.', '.', '.', ],
  ['.', '.', 'b', '.', '.', ],
  ['.', '.', 'w', 'b', '.', ],
  ['.', '.', 'b', '.', '.', ],
  ['.', '.', '.', '.', '.', ],
]

const problem7: Board = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', 'b', 'b', 'b', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'w', 'w', 'w', 'b', '.', '.', '.', '.', '.', '.', '.',],
  ['.', 'w', '.', '.', '.', 'w', 'b', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', 'w', 'b', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', 'w', 'w', 'b', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', '.', 'b', 'b', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
]

const problem8: Board = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', 'w', 'b', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', 'b', 'b', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', 'w', 'b', 'w', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', 'w', 'b', 'b', '.', 'b', '.', '.', '.'],
  ['.', '.', '.', 'w', 'w', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', 'w', 'b', 'b', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.'],
]

const problem9: Board = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', 'b', 'w', '.', '.', '.', '.', '.', '.',],
  ['.', '.', 'b', '.', '.', 'w', '.', 'w', 'w', '.', 'b', '.', '.',],
  ['.', '.', '.', '.', 'b', 'w', '.', '.', '.', '.', '.', '.', '.',],
  ['.', 'w', 'b', 'b', '.', 'b', 'w', '.', '.', '.', '.', '.', '.',],
  ['.', 'w', 'w', 'w', 'w', 'w', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
]

const problem10: Board = [
  ['.', '.', 'w', 'b', '.', ],
  ['.', 'b', 'w', 'b', 'w', ],
  ['.', 'b', 'w', 'b', 'w', ],
  ['.', 'w', 'b', 'w', '.', ],
  ['.', '.', '.', '.', '.', ],
]

export const ProblemsList = {
  problem1: {
    problem: problem1,
    variations: variations1,
  },
  problem2: {
    problem: problem2,
    variations: variations2,
  },
  problem3: {
    problem: problem3,
    variations: variations3,
  },
  problem4: {
    problem: problem4,
    variations: variations4,
  },
  problem5: {
    problem: problem5,
    variations: variations5,
  },
  problem6: {
    problem: problem6,
    variations: variations6,
  },
  problem10: {
    problem: problem10,
    variations: variations10,
  }
  
  
  
}
