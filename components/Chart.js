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

    const {width, height, minWidth=70} = this.view;

    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.style.height = height + 'px';
    slider.style.width = width + 'px';

    const outLeft = document.createElement('div');
    outLeft.classList.add('out-left');
    slider.append(outLeft);

    const thumb = document.createElement('div');
    thumb.classList.add('thumb');
    thumb.style.height = height + 'px';
    // thumb.style.width = minWidth + 'px';
    thumb.innerHTML = '<div class="left"></div><div class="center"></div><div class="right"></div>';
    slider.append(thumb);

    const outRight = document.createElement('div');
    outRight.classList.add('out-right');
    slider.append(outRight);

    this.element.append(slider);

    new ExpandableSlider({
      slider,
      thumb,
      minWidth,
    });

  }
}
