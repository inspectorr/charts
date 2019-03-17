class Chart {
  constructor(options) {
    this.store = new ChartStore(options.data);

    this.mainChart = new ChartView({
      lines: this.store.outputLines,
      view: options.view.mainChart,
    });

    this.chartMap = new ChartMap({
      lines: this.store.outputLines,
      view: options.view.chartMap,
    });

    this._createElement();
    this._listen();
  }

  _createElement() {
    const container = document.createElement('div');
    container.classList.add('Chart');

    const mainChartElement = this.mainChart.getElement();
    mainChartElement.classList.add('main');

    const chartMapElement = this.chartMap.getElement();
    chartMapElement.classList.add('map');

    container.append(mainChartElement);
    container.append(chartMapElement);

    this.element = container;
  }

  _calculateIndexes(period) {
    this.indexStart = Math.ceil(period.left*this.store.lastIndex / this.chartMap.view.width);
    this.indexEnd = Math.floor((period.left+period.width)*this.store.lastIndex / this.chartMap.view.width);
  }

  _scrollMainChart(period) {
    const scaleX = this.chartMap.view.width / period.width;
    // const scaleY = this.store.globalPeak / this.store.localPeak;
    const shiftX = period.left * scaleX;
    console.log(period.left, scaleX.toFixed(2), shiftX.toFixed(2));
    // this.mainChart.setView({ scaleX, scaleY, shiftX });
    this.mainChart.setView({ scaleX, shiftX });
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      this._calculateIndexes(e.detail.period);
      this.store.generateLocals(this.indexStart, this.indexEnd);
      this._scrollMainChart(e.detail.period);
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
