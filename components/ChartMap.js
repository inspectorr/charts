class ChartMap extends ChartView {
  constructor(options) {
    super(options);

    this.period = {
      width: options.view.thumb.width,
      minWidth: options.view.thumb.minWidth,
      left: options.view.width - options.view.thumb.width,
      right: 0,
      shift: null,
      movementType: null,
    };
    console.log(this.period);

    this._createSlider();
  }

  _createSlider() {
    const {width, height} = this.view;
    const {width:thumbWidth, left, right} = this.period;

    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.style.height = height + 'px';
    slider.style.width = width + 'px';

    const outLeft = document.createElement('div');
    outLeft.classList.add('out-left');
    outLeft.style.width = left + 'px';
    slider.append(outLeft);

    const thumb = document.createElement('div');
    thumb.classList.add('thumb');
    thumb.style.width = thumbWidth + 'px';
    thumb.style.height = height + 'px';
    thumb.innerHTML = '<div class="left"></div><div class="center"></div><div class="right"></div>';
    slider.append(thumb);

    const outRight = document.createElement('div');
    outRight.classList.add('out-right');
    outRight.style.width = right + 'px';
    slider.append(outRight);

    this.element.append(slider);

    // !!! осторожно: слайдера еще нет в DOM.
    new PeriodSlider({
      slider, width,
      outLeft,
      outRight,
      thumb,
      period: this.period,
      onPeriodChange: this._onPeriodChange.bind(this),
    });
  }

  _onPeriodChange(period) {
    const periodEvent = new CustomEvent('period', {
      detail: {
        period,
      },
    });

    this.periodEventTarget.dispatchEvent(periodEvent);
  }

  onMount() {
  }

  setPeriodEventTarget(target) {
    this.periodEventTarget = target;
  }

}
