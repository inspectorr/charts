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

  // _animationQueue = [];
  //
  // _addToAnimationQueue(func) {
  //   this._animationQueue.push(func);
  //   if (!this._processingAnimationQueue) {
  //     this._processAnimationQueue();
  //   }
  // }
  //
  // _processingAnimationQueue = false;
  //
  // _processAnimationQueue() {
  //   if (!this._animationQueue[0]) {
  //     this._processingAnimationQueue = false;
  //     return;
  //   }
  //
  //   this._processingAnimationQueue = true;
  //
  //   this._animationQueue[0] = new Promise((done) => {
  //     this._animationQueue[0](done);
  //   });
  //
  //   this._animationQueue[0].then(() => {
  //     this._animationQueue.shift();
  //     this._processAnimationQueue();
  //   });
  // }

  // _currentAnimation = null;

  _alignMainChart(steps) {
    const startScaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / this.currentLocalPeak;
    const duration = 300 + 100*steps;

    animate({
      requestId: this.currentAnimationId,
      duration,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        this.mainChart.setView({ scaleY: startScaleY + (newScaleY - startScaleY)*progress });
      }
    });



    //
    // // if (this.store.localPeak === this.lastLocalPeak) return;
    // if (this.currentLocalPeak === this.lastLocalPeak) return;
    //
    // const lastScaleY = this.lastScaleY ? this.lastScaleY : this.mainChart.view.scaleY;
    // // const newScaleY = this.store.globalPeak / this.store.localPeak;
    // const newScaleY = this.store.globalPeak / this.currentLocalPeak;
    // // const scaleDiff = Math.abs(lastScaleY - newScaleY);
    // // const heightDiff = this.mainChart.view.height * scaleDiff;
    // // const duration = period.speed ? heightDiff / period.speed : 100; // !!!! внимание хак
    // const duration = 300 + 30*cnt;
    //
    // this._addToAnimationQueue((done) => {
    //   animate({
    //     duration,
    //     timing: (timeFraction) => timeFraction,
    //     draw: (progress) => {
    //       this.mainChart.setView({ scaleY: lastScaleY + (newScaleY - lastScaleY)*progress });
    //       if (progress === 1) done();
    //     }
    //   });
    // });
    //
    // this.lastScaleY = newScaleY;
    // // this.lastLocalPeak = this.store.localPeak;
    // this.lastLocalPeak = this.currentLocalPeak;
  }

  _cancelMainChartAlignment() {
    if (this.currentAnimation === null) return;
    cancelAnimationFrame(this.currentAnimationId);
    this.currentAnimationId = null;
  }

  _scrollMainChart(period) {
    const scaleX = (this.chartMap.view.width / period.width);
    const shiftX = period.left * scaleX;
    this.mainChart.setView({ scaleX, shiftX });
  }

  // predictStageSteps = 0;

  _listen() {
    this.chartMap.setPeriodEventTarget(this.element);
    this.element.addEventListener('period', (e) => {
      this._scrollMainChart(e.detail.period);

      this._calculateIndexes(e.detail.period);

      this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);
      const peakForNextIndexes = this._getPeakForNextIndexes(e.detail.period);

      if (this.lastPeriodMovementType !== e.detail.period.movementType) {
        this.predictStageSteps = 0;
      }

      if (this.currentLocalPeak !== peakForNextIndexes) {
        this.predictStageSteps++;
      }

      console.log(e.detail.period.movementType, this.lastLocalPeak, this.currentLocalPeak, peakForNextIndexes);

      if (this.currentLocalPeak !== this.lastLocalPeak) { // в момент изменения
        this._cancelMainChartAlignment();
        this._alignMainChart(this.predictStageSteps);
        this.predictStageSteps = 0;
        this.lastLocalPeak = this.currentLocalPeak;
      }



      // console.log(this.predictStageSteps);

      this.lastPeriodMovementType = e.detail.period.movementType;
    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
