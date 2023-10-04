
export function changeDimension(twoD: string[][]) {
    let oneD: string[] = []
    for (let i = 0; i < twoD.length; i++) {
        oneD = oneD.concat(twoD[i])
    }

  return oneD
}

function classify(idx: number, size: number) {
    let row = Math.floor(idx / size)
    let col = idx % size
    switch (row) {
      case 0:
        switch (col) {
          case 0:
            return 'lt'
          case size - 1:
            return 'rt'
          default:
            return 'top'
        }
      case size - 1:
        switch (col) {
          case 0:
            return 'lb'
          case size - 1:
            return 'rb'
          default:
            return 'bot'
        }
      default:
        switch (col) {
          case 0:
            return 'left'
          case size - 1:
            return 'right'
          default:
            return 'cell'
        }
    }
  }

export function changeEdge(oneDimensionData: Array<string>) {
    let size = oneDimensionData.length ** 0.5
    for (let i = 0; i < oneDimensionData.length; i++) {
        if (oneDimensionData[i] === '.') {
            oneDimensionData[i] = classify(i, size)
        }
    }
    return oneDimensionData
}

export function makingEmptyBoard(size: number) {
    let board: Array<Array<string>> = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            board[i].push('.')
        }
    }
    return board
}

const getCoordinate = (event: any) => {
    const x = Math.ceil(event.clientX / 70);
    const y = Math.ceil(event.clientY / 70);
    return [y, x]
  }
