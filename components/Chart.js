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
    this.bringAnimation = {
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
    let currentPeak = this.currentLocalPeak;
    let closestPeak = currentPeak, n = 0;
    let indexStart, indexEnd, lastIndex = this.store.lastIndex;

    switch (movementType) {
      case 'move-right':
        indexStart = this.indexStart + shiftIndex;
        indexEnd = this.indexEnd + shiftIndex;

        while (closestPeak === currentPeak && indexEnd < lastIndex) {
          closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
          indexStart += shiftIndex;
          indexEnd += shiftIndex;
          n++;
        }

        if (closestPeak === currentPeak) {
          indexEnd = lastIndex;
          indexStart = indexEnd - widthIndex;
          closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
          n++;
        }

        console.log(currentPeak, closestPeak, n);

        break;
      case 'move-left':
        // if (this.indexStart === 0) peak = null;
        // else peak = this.store.getLocalPeak(this.indexStart-1, this.indexEnd-1);
        break;
      case 'expand-right-plus':
        // if (this.indexEnd === this.store.lastIndex) peak = null;
        // else peak = this.store.getLocalPeak(this.indexStart, this.indexEnd+1);
        break;
      case 'expand-right-minus':
        // peak = this.store.getLocalPeak(this.indexStart, this.indexEnd-1);
        break;
      case 'expand-left-plus':
        // if (this.indexStart === 0) peak = null;
        // else peak = this.store.getLocalPeak(this.indexStart-1, this.indexEnd);
        break;
      case 'expand-left-minus':
        // peak = this.store.getLocalPeak(this.indexStart+1, this.indexEnd);
        break;
    }
    return {
      peak: closestPeak,
      n
    };
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

  _bringMainChart() {
    const scaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.currentLocalPeak;

    animate({
      context: this.bringAnimation,
      duration: 400,
      timing: time => Math.pow(time, 0.2),
      draw: (progress) => {
        this.mainChart.setView({
          scaleY: scaleY + (newScaleY - scaleY)*progress,
        });
      }
    });

  }

  _alignMainChart(shift, nextLocalPeak, n, done) {
    // cancelAnimationFrame(this.alignAnimation.id);
    const newScaleY = this.store.globalPeak / nextLocalPeak;
    // if (newScaleY === this.lastScaleY) return;
    // if (shift < 10) return;

    const scaleY = this.mainChart.view.scaleY;

    const duration = 200;

    animate({
      context: this.alignAnimation,
      duration,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          scaleY: scaleY + (newScaleY - scaleY)*progress,
        });
        if (progress === 1) done();
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

      const treshold = this.mainChart.view.width * 0.01;

      if (period.shift > treshold) {
        const shiftIndex = this._mapPxToIndex(period.shift);
        const widthIndex = this._mapPxToIndex(period.width);
        const closestPeakData = this._getClosestPeakData(shiftIndex, widthIndex, period.movementType);
        if (period.movementType === 'move-right' && this.currentLocalPeak !== this.predictedPeak) {
          this.predictedPeak = closestPeakData.peak;
          const promise = new Promise((done) => {
            this._alignMainChart(shiftIndex, closestPeakData.peak, closestPeakData.n, done);
          });
          promise.then(() => {
            
          });
        }
        console.log(period.movementType, shiftIndex, closestPeakData.peak, closestPeakData.n);
      }

      this._scrollMainChart(period);
      // this.mainChart.setView({ scaleY: this.store.globalPeak / this.currentLocalPeak });

    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
