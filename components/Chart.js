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

    this.scrollAnimation = {
      id: null,
    };
    this.alignAnimation = {
      id: null,
    };

    this.lastShiftX = null;
    this.lastScaleX = null;
    this.lastScaleY = null;

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

  _getClosestPeakData(shiftIndex, widthIndex, movementType) {
    let closestPeak, currentPeak = this.currentLocalPeak;
    let indexStart = this.indexStart, indexEnd = this.indexEnd, lastIndex = this.store.lastIndex;

    switch (movementType) {
      case 'right':
        indexEnd += shiftIndex;
        if (indexEnd > lastIndex) indexEnd = lastIndex;
        closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
        break;
      case 'left':
        indexEnd -= shiftIndex;
        if (indexStart < 0) indexStart = 0;
        closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
        break;
    }

    return closestPeak;
  }

  _scrollMainChart(period) {
    cancelAnimationFrame(this.scrollAnimation.id);

    if (this.lastShiftX !== null) {
      this.mainChart.setView({
        scaleX: this.lastScaleX,
        shiftX: this.lastShiftX,
      });
    }

    const {scaleX, shiftX, scaleY} = this.mainChart.view;
    const newScaleX = (this.chartMap.view.width / period.width);
    const newShiftX = period.left * newScaleX;

    animate({
      context: this.scrollAnimation,
      duration: 100,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          shiftX: shiftX + (newShiftX - shiftX)*progress,
          scaleX: scaleX + (newScaleX - scaleX)*progress,
        });
      }
    });

    this.lastShiftX = newShiftX;
    this.lastScaleX = newScaleX;
  }

  _mapPxToIndex(px) {
    return Math.round(px*this.store.lastIndex/this.chartMap.view.width);
  }

  _alignMainChart(shift, nextLocalPeak, done) {
    cancelAnimationFrame(this.alignAnimation.id);
    const scaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / nextLocalPeak;

    const scaleDiff = Math.abs(newScaleY - scaleY);

    // let duration = scaleDiff * 200 + (shift ? 350 / shift : 0); ////////
    let duration = shift ? 500 / shift : 0; ////////
    duration = Math.round(duration);

    console.log(duration);

    animate({
      context: this.alignAnimation,
      duration,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          scaleY: scaleY + (newScaleY - scaleY)*progress,
        });
        if (progress === 1 && done) done();
      }
    });

    this.lastScaleY = newScaleY;
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      const period = e.detail.period;

      this._calculateIndexes(period);
      this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);

      if (period.shift === null) {
        const scaleY = this.store.globalPeak / this.currentLocalPeak.peak;
        const scaleX = (this.chartMap.view.width / period.width);
        const shiftX = period.left * scaleX;
        this.mainChart.setView({ scaleX, shiftX, scaleY });
        return;
      }

      this._scrollMainChart(period);

      const shiftIndex = this._mapPxToIndex(period.shift);
      const widthIndex = this._mapPxToIndex(period.width);
      const closestPeakData = this._getClosestPeakData(shiftIndex, widthIndex, period.movementType);

      let predictionChanged = !this.animationInProgress && this.predictedPeakIndex !== closestPeakData.index;
      let newRequired = this.animationInProgress && this.predictedPeakIndex !== this.currentLocalPeak.index;
      let targetPeak = closestPeakData;

      console.log(period.movementType, this.currentLocalPeak.index, period.shift, this.predictedPeakIndex, closestPeakData.index, this.animationInProgress);

      if (predictionChanged || newRequired) {
        this.animationInProgress = true;
        new Promise((done) => {
          console.log(`animation to ${targetPeak.index}`);
          this._alignMainChart(period.shift, targetPeak.peak, done);
        }).then(() => {
          this.animationInProgress = false;
        });

        this.predictedPeakIndex = closestPeakData.index;
      }
      
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
