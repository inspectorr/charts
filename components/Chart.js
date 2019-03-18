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

  _alignMainChart(speed) {
    // console.log(speed);

    const startScaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.store.localPeak;

    let duration = 100 / speed;
    if (duration > 5000) duration = 5000;
    if (duration < 500) duration = 500;

    let n = 0.1 / speed;
    if (n > 0.9) n = 0.9;
    if (n < 0.1) n = 0.1;


    // if (speed === null || speed >= 1) {
    //   duration = 500;
    //   n = 0.1;
    // } else if (speed === 0) {
    //   duration = 5000;
    //   n = 0.9;
    // } else {
    //   duration = 500 / speed;
    //   n = 0.1 / speed;
    // }

    // duration = 500;
    // n = 0.1;

    let animationInProgress;
    if (!animationInProgress) animate({
      duration,
      timing: (timeFraction) => Math.pow(timeFraction, n),
      draw: (progress) => {
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
      this._alignMainChart(e.detail.period.speed);
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
