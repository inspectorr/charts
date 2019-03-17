class ChartStore {
  constructor(data) {
    let x;
    const lines = [];

    for (let i = 0; i < data.columns.length; i++) {
      const key = data.columns[i][0];
      if (data.types[key] === 'x') x = data.columns[i];
      if (data.types[key] === 'line') lines.push(data.columns[i]);
    }

    const N = x.length;

    const globalDX = this._getDX(x, 1, N-1);
    const globalPeak = this._getPeak(lines, 1, N-1);

    const outputLines = lines.map((line) => {
      return {
        name: data.names[line[0]],
        color: data.colors[line[0]],
        points: '',
      };
    });

    for (let i = 0; i < lines.length; i++) {
      for (let j = 1; j < N; j++) {
        const xCoord = (x[j] - x[1]) / globalDX;
        const yCoord = lines[i][j] / globalPeak;
        outputLines[i].points += `${xCoord} ${yCoord} `;
      }
    }

    this.lastIndex = N-2;
    this.x = x;
    this.lines = lines;
    this.globalDX = globalDX;
    this.globalPeak = globalPeak;

    this.outputLines = outputLines;
  }

  _getDX(xArr, startIndex, endIndex) {
    return xArr[endIndex] - xArr[startIndex];
  }

  _getPeak(lines, startIndex, endIndex) {
    let I = 0, J = startIndex;
    for (let i = 0; i < lines.length; i++) {
      for (let j = startIndex; j <= endIndex; j++) {
        if (lines[i][j] > lines[I][J]) {
          I = i;
          J = j;
        }
      }
    }
    return lines[I][J];
  }

  generateLocals(startIndex, endIndex) {
    this.localDX = this._getDX(this.x, startIndex+1, endIndex+1);
    this.localPeak = this._getPeak(this.lines, startIndex+1, endIndex+1);
  }

  getPoint(lineIndex, pointIndex) {
    return {
      x: this.x[pointIndex+1],
      y: this.lines[lineIndex][pointIndex+1],
    };
  }
}
