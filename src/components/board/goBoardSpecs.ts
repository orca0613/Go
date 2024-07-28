export class GoBoardSpecs {
  private size: number;
  private cellSize: number;
  private stoneSize: number;
  private starPointSize: number;

  private lines: number;
  private lineWidth: number;
  private lineGap: number;

  private stoneOffset: number;

  constructor(size: number, lines: number) {
    this.size = size;
    this.lines = lines;
    this.lineWidth = size / 400;
    this.cellSize = (size * 0.99) / lines;
    this.stoneSize = this.cellSize * 0.98;
    this.starPointSize = Math.min(5, this.cellSize * 0.1);
    this.lineGap = size / 200 + this.cellSize * 0.5;
    this.stoneOffset = this.lineGap - 0.5 * this.stoneSize;
  }

  getAllSpecs() {
    return {
      size: this.size,
      cellSize: this.cellSize,
      starPointSize: this.starPointSize,
      lines: this.lines,
      lineWidth: this.lineWidth,
      lineGap: this.lineGap,
      stoneSize: this.stoneSize,
    };
  }

  /**
   * Gets the absolute stone position on the board taking into account cell and stone offsets
   * @param x 0-indexed x-position from the left of the board
   * @param y 0-indexed y-position from the top of the board
   */
  getPosition(x: number, y: number) {
    return {
      top: this.stoneOffset + y * this.cellSize,
      left: this.stoneOffset + x * this.cellSize,
    };
  }
}
