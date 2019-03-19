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

  _animationQueue = [];

  _addToAnimationQueue(func) {
    this._animationQueue.push(func);
    if (!this._processingAnimationQueue) {
      this._processAnimationQueue();
    }
  }

  _processingAnimationQueue = false;

  _processAnimationQueue() {
    if (!this._animationQueue[0]) {
      this._processingAnimationQueue = false;
      return;
    }

    this._processingAnimationQueue = true;

    this._animationQueue[0] = new Promise((done) => {
      this._animationQueue[0](done);
    });

    this._animationQueue[0].then(() => {
      this._animationQueue.shift();
      this._processAnimationQueue();
    });
  }

  _alignMainChart(period) {
    if (this.store.localPeak === this.lastLocalPeak) return;

    const lastScaleY = this.lastScaleY ? this.lastScaleY : this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.store.localPeak;
    const scaleDiff = Math.abs(lastScaleY - newScaleY);
    const heightDiff = this.mainChart.view.height * scaleDiff;
    const duration = period.speed ? heightDiff / period.speed : 100; // !!!! внимание хак

    this._addToAnimationQueue((done) => {
      animate({
        duration,
        timing: (timeFraction) => timeFraction,
        draw: (progress) => {
          this.mainChart.setView({ scaleY: lastScaleY + (newScaleY - lastScaleY)*progress });
          if (progress === 1) done();
        }
      });
    });

    this.lastScaleY = newScaleY;
    this.lastLocalPeak = this.store.localPeak;
  }

  _scrollMainChart(period) {
    const scaleX = (this.chartMap.view.width / period.width);
    const shiftX = period.left * scaleX;
    this.mainChart.setView({ scaleX, shiftX });
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      this._scrollMainChart(e.detail.period);

      this._calculateIndexes(e.detail.period);
      this.store.getLocals(this.indexStart, this.indexEnd);
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
