
// import React, { CSSProperties, useEffect, useRef, useState } from 'react';
// import { Board, Coordinate } from '../../util/types';
// import { divmod } from '../../util/functions';
// import _ from 'lodash';
// import { resolution } from '../../util/constants';

// interface SmallPiecesProps {
//   boardWidth: number
//   board: Board
//   style?: CSSProperties
//   moves?: string // A value that links the positions of the moves played ex)"0-28-47-38"
//   variations?: string[]
//   answers?: string[]
//   questions?: string[]
//   onClick?: (c: Coordinate) => void
// }

// const SmallPieces = ({boardWidth, board, style, moves, variations, answers, questions, onClick}: SmallPiecesProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const answerColor = "green"
//   const wrongColor = "red"
//   const questionColor = "blue"
//   const lines = board.length
//   const lineWidth = boardWidth / 400
//   const offset = boardWidth / 200
//   const cellSize = (boardWidth - (offset * 2)) / lines
//   const stoneSize = cellSize / 2.1
//   const gap = offset + cellSize / 2
//   const numberSize = stoneSize

//   function handleClick(e: React.MouseEvent) {
//     const canvas = canvasRef.current
//     if (onClick && canvas) {
//       const rect = canvas.getBoundingClientRect() 
//       const x = Math.floor((e.clientX - rect.left) / cellSize)
//       const y = Math.floor((e.clientY - rect.top) / cellSize)
//       onClick([y, x])
//     }
//   }

//   function drawCircle(ctx: CanvasRenderingContext2D, size: number, coordinate: Coordinate, color: string) {
//     const y = cellSize * (coordinate[0]) + gap;
//     const x = cellSize * (coordinate[1]) + gap;

//     ctx.fillStyle = color;
//     ctx.lineWidth = lineWidth
//     ctx.strokeStyle = 'black'
//     ctx.stroke()
//     ctx.beginPath();
//     ctx.arc(x, y, size, 0, Math.PI * 2);
//     ctx.fill();
//   }

//   function drawMoveNumber(ctx: CanvasRenderingContext2D, coord: Coordinate, color: string, moveNumber: string) {
//     const x = cellSize * coord[1] + gap;
//     const y = cellSize * coord[0] + gap + numberSize / 3;

//     ctx.font = `normal normal bolder ${stoneSize}px sans-serif`;
//     ctx.fillStyle = color === 'b'? 'white' : 'black';
//     ctx.textAlign = "center";
//     ctx.fillText(moveNumber, x, y)
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');

//     if (ctx && canvas) {
  
//       const canvasSize = boardWidth + "px"

//       canvas.style.width = canvasSize
//       canvas.style.height = canvasSize

//       canvas.width = boardWidth * resolution;
//       canvas.height = boardWidth * resolution;


//       ctx.scale(resolution, resolution)

//       // Draw move numbers
//       if (moves) {
//         const positions = moves.split('-').splice(1).reverse()
//         let len = positions.length + 1
//         const s = new Set()
//         positions.map(position => {
//           len -= 1
//           if (_.isEqual(position, "p")) {
//             return
//           }
//           const coord = divmod(Number(position), lines)
//           const y = coord[0], x = coord[1]
//           if (s.has(position) || board[y][x] === '.') {
//             return
//           }
//           s.add(position)
//           drawMoveNumber(ctx, coord, board[y][x], String(len))
//         })
//       }

//       //Draw variations points

//       if (variations) {
//         variations.map(position => {
//           const coord = divmod(Number(position), lines)
//           drawCircle(ctx, stoneSize / 3, coord, wrongColor)
//         })
//       }

//       if (answers) {
//         answers.map(position => {
//           const coord = divmod(Number(position), lines)
//           drawCircle(ctx, stoneSize / 3, coord, answerColor)
//         })
//       }

//       if (questions) {
//         questions.map(position => {
//           const coord = divmod(Number(position), lines)
//           drawCircle(ctx, stoneSize / 3, coord, questionColor)
//         })
//       }
//       ctx.stroke()
//     }
//   }, [board, moves, variations, answers, boardWidth, lines]);
  
//   return (
//     <canvas style={{...style, width: boardWidth, height: boardWidth}} id="stones" ref={canvasRef} onClick={handleClick}></canvas>
//   );
// };

// export default SmallPieces

