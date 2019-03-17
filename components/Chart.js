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
    mainChartElement.classList.add('Chart__main');

    const chartMapElement = this.chartMap.getElement();
    chartMapElement.classList.add('Chart__map');

    container.append(mainChartElement);
    container.append(chartMapElement);

    this.element = container;
  }

  _listen() {

  }

  getElement() {
    return this.element;
  }
}

class ChartMap extends ChartView {
  constructor(options) {
    super(options);
  }

  _createElement() {
    super._createElement();

    this.element.classList.add('slider');

    const thumb = document.createElement('div');
    thumb.classList.add('thumb');
    thumb.style.height = this.view.height + 'px';
    thumb.style.width = 50 + 'px'; ///////////////
    thumb.innerHTML = '<div class="left"></div><div class="center"></div><div class="right"></div>';
    this.thumb = thumb;
    this.element.append(this.thumb);

    new ExpandableSlider({
      slider: this.element,
      thumb: this.thumb,
      minWidth: 50,
    });


  }
}
