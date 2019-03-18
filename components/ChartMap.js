class ChartMap extends ChartView {
  constructor(options) {
    super(options);
  }

  _createElement() {
    super._createElement();

    const {width, height} = this.view;
    const {width:thumbWidth=100, minWidth:thumbMinWidth=70, right=0} = this.view.thumb;
    const outLeftWidth = width - right - thumbWidth;

    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.style.height = height + 'px';
    slider.style.width = width + 'px';

    const outLeft = document.createElement('div');
    outLeft.classList.add('out-left');
    outLeft.style.width = outLeftWidth + 'px';
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

    this.period = {
      left: outLeftWidth,
      width: thumbWidth,
      right: width - outLeftWidth - thumbWidth,
      speed: null, 
    };

    // !!! осторожно: слайдера еще нет в DOM.
    new PeriodSlider({
      slider, width,
      outLeft, outLeftWidth,
      outRight,
      thumb, thumbWidth, thumbMinWidth,
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
    this._onPeriodChange(this.period);
  }

  setPeriodEventTarget(target) {
    this.periodEventTarget = target;
  }

}
