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

  _getPeakForNextIndexes(period) {
    let peak;
    switch (period.movementType) {
      case 'move-right':
        if (this.indexEnd === this.store.lastIndex) peak = null;
        else peak = this.store.getLocalPeak(this.indexStart+1, this.indexEnd+1);
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
    // if (steps < 1) {
    //   this.mainChart.setView({ scaleY: this.store.globalPeak / this.currentLocalPeak });
    //   return;
    // }

    const startScaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.currentLocalPeak;
    const dY = Math.abs(this.lastLocalPeak - this.currentLocalPeak) / this.store.globalPeak;
    // const K = 500;
    const duration = 100 + 600*dY + 100*steps;
    console.log(dY, steps, duration);
    const timing = (time) => time;
    // const timing = steps > 2 ? (time) => time : (time) => Math.pow(time, 0.2);

    animate({
      context: this,
      duration,
      timing,
      draw: (progress) => {
        this.mainChart.setView({ scaleY: startScaleY + (newScaleY - startScaleY)*progress });
      }
    });

    console.log(`animation id=${this.currentAnimationId} started`);
  }

  _cancelMainChartAlignment() {
    console.log(`animation id=${this.currentAnimationId} canceled`);
    cancelAnimationFrame(this.currentAnimationId);
    this.currentAnimationId = null;
  }

  _scrollMainChart(period) {
    const {scaleX, shiftX} = this.mainChart.view;
    const newScaleX = (this.chartMap.view.width / period.width);
    const newShiftX = period.left * newScaleX;

    // this.mainChart.setView({ scaleX: newScaleX });

    animate({
      // context: this,
      duration: 5000,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          shiftX: shiftX + (newShiftX - shiftX)*progress,
          scaleX: scaleX + (newScaleX - scaleX)*progress,
        });
      }
    });

    // this.mainChart.setView({ scaleX, shiftX });
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      this._scrollMainChart(e.detail.period);

      this._calculateIndexes(e.detail.period);
      this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);
      this.mainChart.setView({ scaleY: this.store.globalPeak / this.currentLocalPeak });

      // const peakForNextIndexes = this._getPeakForNextIndexes(e.detail.period);
      //
      // if (this.lastPeriodMovementType !== e.detail.period.movementType) {
      //   this.predictStageSteps = 0;
      // }
      //
      // if (this.currentLocalPeak !== peakForNextIndexes) {
      //   this.predictStageSteps++;
      // }

      // console.log(e.detail.period.movementType, this.lastLocalPeak, this.currentLocalPeak, peakForNextIndexes);

      // if (this.lastLocalPeak && this.currentLocalPeak !== this.lastLocalPeak) { // момент изменения пика
      //   this._cancelMainChartAlignment();
      //   this._alignMainChart(this.predictStageSteps);
      //   this.predictStageSteps = 0;
      // }


      // this.lastLocalPeak = this.currentLocalPeak;
      // this.lastPeriodMovementType = e.detail.period.movementType;
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
