import { GoBoard } from "./GoBoard";
import { GoStone } from "./GoStone";
import { Move } from "./types";

interface GoPositionProps {
  lineSpacing: number;
  lines: number;
  moves?: Move[];
}

export function GoPosition({ lineSpacing, lines, moves }: GoPositionProps) {
  return (
    <GoBoard spacingInPixels={lineSpacing} n={lines}>
      {moves?.map(move => (
        <GoStone
          key={JSON.stringify(move.coord)}
          size={lineSpacing}
          color={move.color}
          coord={move.coord}
        />
      ))}
    </GoBoard>
  )
}
