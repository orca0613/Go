
// import { CSSProperties } from 'react';
// import { Board } from '../../util/types';
// import { getPositions } from '../../util/functions';
// import _ from 'lodash';

// interface StoneImagesProps {
//   boardWidth: number
//   board: Board
//   style?: CSSProperties
// }

// const StoneImages = ({boardWidth, board, style}: StoneImagesProps) => {
//   let blackStoneList = getPositions(board, "b")
//   let whiteStoneList = getPositions(board, "w")
//   const lines = board.length
//   const offset = boardWidth / 200
//   const cellSize = (boardWidth - (offset * 2)) / lines
//   const stoneSize = cellSize / 2.1
//   const gap = offset + cellSize / 2

//   return (
//     <div style={{width: boardWidth, height: boardWidth}}>
//       {blackStoneList.map((b, idx) => {
//         const y = b[0] * cellSize + gap - stoneSize
//         const x = b[1] * cellSize + gap - stoneSize
//         return (
//           <img src="/images/black.svg.png"
//           key={idx}style={{position: "absolute", top: y, left:x}}
//           alt="black" width={stoneSize * 2} height={stoneSize * 2}/>
//         )
//       })}
//       {whiteStoneList.map((w, idx) => {
//         const y = w[0] * cellSize + gap - stoneSize
//         const x = w[1] * cellSize + gap - stoneSize
//         return (
//           <img src="/images/white.svg.png"
//           key={idx}style={{position: "absolute", top: y, left:x}}
//           alt="black" width={stoneSize * 2} height={stoneSize * 2}/>
//         )
//       })}
//     </div>
//   );
// };

// export default StoneImages

