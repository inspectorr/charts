class ChartStore {
  constructor(data) {
    // this.data = data;

    let x;
    const lines = [];

    for (let i = 0; i < data.columns.length; i++) {
      const key = data.columns[i][0];
      if (data.types[key] === 'x') x = data.columns[i];
      if (data.types[key] === 'line') lines.push(data.columns[i]);
    }

    const N = x.length;

    const xS = x[1];
    const xE = x[N-1];
    const dX = xE - xS;

    const linePeaks = lines.map((line) => {
      let peak = -Infinity;
      for (let i = 1; i < line.length; i++) {
        if (line[i] > peak) peak = line[i];
      }
      return peak;
    });

    const peak = Math.max(...linePeaks);

    const outputLines = lines.map((line) => {
      return {
        name: data.names[line[0]],
        color: data.colors[line[0]],
        points: '',
      };
    });

    for (let i = 0; i < lines.length; i++) {
      for (let j = 1; j < N; j++) {
        const xCoord = (x[j] - xS) / dX;
        const yCoord = lines[i][j] / peak;
        outputLines[i].points += `${xCoord} ${yCoord} `;
      }
    }

    this.lines = outputLines;
  }

  controlPoints() {
    //
  }
}
