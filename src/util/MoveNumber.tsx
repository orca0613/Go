import { Board, Coordinate } from "./types";

function moveNumberComponent(coord: Coordinate, size: number, color: string, moveNumber: number) {
  return (
    <div style={{
      position: 'absolute',
      left: `${(coord[1]) * size}px`,
      top: `${(coord[0]) * size}px`,
      display: 'flex',
      alignItems: 'center',
      width: size,
      height: size,
      justifyContent: 'center',
      fontSize: size / 5 * 3,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      color: color,
    }}>{moveNumber}
    </div>
  )
}


interface MoveNumberProps{
  cellWidth: number;
  moves: string; 
  board: Board;
}

export function MoveNumber({ board, moves, cellWidth }: MoveNumberProps) {
    /* Receives the coordinates of the progressed steps in string format 
  and displays them one by one on the board */
  const boardSize = board.length
  const positions = moves.split('-').splice(1).reverse()
  let moveNumber = positions.length + 1
  const s = new Set()

  return (
    <div>
      {positions.map(position => {
        moveNumber -= 1 
        /* To prevent duplicate notation, 
        display in reverse order starting from the last number. */
        const p = Number(position)
        const y = Math.floor(p / boardSize), x = p % boardSize
        if (s.has(position) || board[y][x] === '.') {return}; // Check whether it exists on the board and whether it is duplicated //
        s.add(position)
        const color = moveNumber % 2 === 0? 'black' : 'white'
        return (
          moveNumberComponent([y, x], cellWidth, color, moveNumber)
        )
      })}
    </div>
  )
}
