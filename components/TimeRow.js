class TimeRow {
  constructor(options) {
    this.options = options;
    this.times = options.times;

    this._calculateIndexes(options.indexStart, options.indexEnd)

    console.log(this.times);

    this._createElement();
  }

  _calculateIndexes(indexStart, indexEnd) {
    this.indexStart = Math.ceil(indexStart*(this.options.times.length-1)/this.options.lastIndex);
    this.indexEnd = Math.round(indexEnd*(this.options.times.length-1)/this.options.lastIndex);
  }

  _createElement() {
    const element = document.createElement('div');
    const {width, height} = this.options.view;
    element.style.height = height + 'px';
    element.style.width = width + 'px';

    const distIndex = this.indexEnd - this.indexStart;
    let step;
    while (!step) {
      if (distIndex % 5 === 0) step = distIndex/5;
      else if (distIndex % 4 === 0) step = distIndex/4;
      else if (distIndex % 3 === 0) step = distIndex/3;
      else distIndex++;
    }

    for (let i = this.indexStart; i <= this.indexStart + distIndex; i+=step) {
      const time = document.createElement('div');
      time.classList.add('time');
      time.style.width = width / (step+1) + 'px';
      time.style.height = height + 'px';
      time.textContent = `${this.times[i].month} ${this.times[i].date}`;
      element.append(time);
    }

    this.element = element;
  }

  getElement() {
    return this.element;
  }
}
