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
    const scaleX = (this.chartMap.view.width / period.width);
    const shiftX = period.left * scaleX;
    this.mainChart.setView({ scaleX, shiftX });
  }

  _alignMainChart(period) {
    const startScaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.store.localPeak;

    // console.log(period.speed);

    animate({
      duration: 500,
      timing: (timeFraction) => Math.pow(timeFraction, 0.1),
      draw: (progress) => {
        // console.log(progress);
        this.mainChart.setView({ scaleY: startScaleY + (newScaleY-startScaleY)*progress });
      }
    });
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      this._scrollMainChart(e.detail.period);

      this._calculateIndexes(e.detail.period);
      this.store.generateLocals(this.indexStart, this.indexEnd);
      this._alignMainChart(e.detail.period);
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
