'use strict';

class Chart {
  constructor(options) {
    this.store = new ChartStore(options.data);

    const mainChart = new MainChart({
      data: this.store, // передать текущий
      view: {

      }
    });

    const chartMap = new ChartMap({
      data: this.store, // передать весь промежуток
      view: {

      },
    });

    this.mainChartElem = mainChart.render();
    this.chartMapElem = chartMap.render();

    this.elem = this._createElement(options.view);
    // this._listen(this.elem);
  }

  _listen(elem) { // обработчики

  }

  _createElement(view) { // разметка
    const container = document.createElement('div');
    container.append(this.mainChartElem);
    container.append(this.chartMap);
    return container;
  }

  render() {
    return this.elem;
  }
}

class ChartView { // создание тупого графика по параметрам
  constructor(options) {
    this.lines = options.lines;
    this.view = options.view;
  }

  _createSVG() {
    let svg = `<svg
      version="1.2"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      width="${this.view.width}"
      height="${this.view.height}"
    >`;

    this.lines.forEach((line) => {
      svg += `<polyline
        points="${line.points}"
        stroke="${line.color}"
        fill="transparent"
        transform="translate(0, ${this.view.height}) scale(${this.view.width}, ${-this.view.height})"
        vector-effect="non-scaling-stroke"
        stroke-width="${this.view.strokeWidth}"
        stroke-linejoin="round"
      />`
    });

    svg += '</svg>';

    return svg;
  }

  render() {
    const svg = this._createSVG();
    const container = document.createElement('div');
    container.innerHTML = svg;
    document.body.append(container);
  }
}

class MainChart extends ChartView {

}

class ChartMap extends ChartView {

}
