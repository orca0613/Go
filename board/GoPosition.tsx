import { GoBoard } from "./GoBoard";
import { GoStone } from "./GoStone";
import { Move } from "./types";


interface GoPositionProps {
  lineSpacing: number;
  lines: number;
  moves: Move;
}

export function GoPosition({ lineSpacing, lines, moves }: GoPositionProps) {
  return (
    <GoBoard spacingInPixels={lineSpacing} n={lines}>
      {moves.white.map(move => (
        <GoStone
          key={JSON.stringify(move)}
          size={lineSpacing}
          color={'white'}
          coord={move}
        />
      ))}
      {moves.black.map(move => (
        <GoStone
          key={JSON.stringify(move)}
          size={lineSpacing}
          color={'black'}
          coord={move}
        />
      ))}      
    </GoBoard>
  )
}
