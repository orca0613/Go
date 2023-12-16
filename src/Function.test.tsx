import { addVariations, convertFromStringToTwoD, convertFromTwoDToString, divmod, makingEmptyBoard } from './util/functions';
import { Board } from './util/types';



test('makingEmptyBoard', () => {
  const board1: Board = [
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.']
  ]

  const board2: Board = [
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.']
  ]

  const case1 = makingEmptyBoard(5) // Not smaller than board size
  const case2 = makingEmptyBoard(8) // Smaller than zero

  expect(case1).toEqual(board1)
  expect(case2).toEqual(board2)
});

test('convertFromStringToTwoD', () => {
  const board1 = [
    ['.', 'b', 'b', 'w'],
    ['.', '.', 'w', '.'],
    ['.', 'b', 'w', 'b'],
    ['.', 'w', '.', '.'],
  ]

  const stringBoard1 = '.bbw..w..bwb.w..'

  const case1 = convertFromStringToTwoD(stringBoard1)

  expect(case1).toEqual(board1)
})

test('convertFromTwoDToString', () => {
  const board1 = [
    ['.', 'b', 'b', 'w'],
    ['.', '.', 'w', '.'],
    ['.', 'b', 'w', 'b'],
    ['.', 'w', '.', '.'],
  ]

  const stringBoard1 = '.bbw..w..bwb.w..'

  const case1 = convertFromTwoDToString(board1)

  expect(case1).toEqual(stringBoard1)
})

test('divmod', () => {
  const result1 = [5, 3]
  const result2 = [0, 0]

  const num1 = 23, num1_1 = 4
  const num2 = 0, num2_2 = 9

  const case1 = divmod(num1, num1_1)
  const case2 = divmod(num2, num2_2)

  expect(case1).toEqual(result1)
  expect(case2).toEqual(result2)
})

test('addVariations', () => {
  const variations1 = {
    '0': ['1', '2'],
    '0-1': ['2'],
    '0-1-2': [],
    '0-2': ['1'],
    '0-2-1': [],
  }

  const newVariation1 = '0-3-4-5'
  const l1 = ['0', '3', '4', '5']

  const finalVariations1 = {
    '0': ['1', '2', '3'],
    '0-1': ['2'],
    '0-1-2': [],
    '0-2': ['1'],
    '0-2-1': [],
    '0-3-4-5': [],
    '0-3-4': ['5'],
    '0-3': ['4'],
  }

  const case1 = addVariations(newVariation1, variations1, l1)

  expect(case1).toEqual(finalVariations1)

})