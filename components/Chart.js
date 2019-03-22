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

    this.currentAnimation = null;
    this.predictStageSteps = 0;

    this.lastShiftX = null;
    this.lastScaleX = null;

    this._createElement();
    this._listen();this.store.getLocalPeak(indexStart, indexEnd);
          n = 1;
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
    let closestPeak = this.currentLocalPeak, n = 0;
    let indexStart, indexEnd, lastIndex = this.store.lastIndex;

    function getClosestPeak(indexStart, indexEnd, indexStartChangeFunc, indexEndChangeFunc) {
      let closestPeak, peak, n = 0;
      while (peak === this.currentLocalPeak && indexEnd <= this.store.lastIndex) {

        peak = this.store.getLocalPeak(indexStart, indexEnd);
        // if (peak > maxPeak) maxPeak = peak;
        indexStart +=
      }
    }

    switch (movementType) {
      case 'move-right':
        indexStart = this.indexStart + shiftIndex;
        indexEnd = this.indexEnd + shiftIndex;

        if (indexEnd > lastIndex) {
          indexEnd = lastIndex;
          indexStart = indexEnd - indexWidth;
          closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
          n = 1;
          break;
        }

        while (closestPeak === this.currentLocalPeak && indexEnd < lastIndex) {
          indexStart += shiftIndex;
          indexEnd += shiftIndex;
          closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
        }
        // if (this.indexEnd === this.store.lastIndex) {
        //   peak = null;
        // } else {
        //   let closestPeak = this.store.getLocalPeak(this.indexStart+s, this.indexEnd+1)
        //   while ()
        //   // peak = this.store.getLocalPeak(this.indexStart+1, this.indexEnd+1);
        // }
        break;
      case 'move-left':
        if (this.indexStart === 0) peak = null;
        else peak = this.store.getLocalPeak(this.indexStart-1, this.indexEnd-1);
        break;
      case 'expand-right-plus':
        if (this.indexEnd === this.store.lastIndex) peak = null;
        else peak = this.store.getLocalPeak(this.indexStart, this.indexEnd+1);
        break;
      case 'expand-right-minus':
        peak = this.store.getLocalPeak(this.indexStart, this.indexEnd-1);
        break;
      case 'expand-left-plus':
        if (this.indexStart === 0) peak = null;
        else peak = this.store.getLocalPeak(this.indexStart-1, this.indexEnd);
        break;
      case 'expand-left-minus':
        peak = this.store.getLocalPeak(this.indexStart+1, this.indexEnd);
        break;
    }
    return peak;
  }

  _alignMainChart(steps) {

  }

  _cancelMainChartAlignment() {

  }

  _scrollMainChart(period) {
    cancelAnimationFrame(this.currentAnimationId);

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
      context: this,
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
    Math.round(px*this.store.lastIndex/this.chartMap.view.width);
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      const period = e.detail.period;

      this._calculateIndexes(period);
      this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);

      if (period.shift) {
        const shiftIndex = this._mapPxToIndex(period.shift);
        const widthIndex = this._mapPxToIndex(period.width);
        const closestPeakData = this._getClosestPeakData(shiftIndex, widthIndex, period.movementType);
      }

      console.log(period.movementType, period.shift);


      this._scrollMainChart(period);
      this.mainChart.setView({ scaleY: this.store.globalPeak / this.currentLocalPeak });

    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
