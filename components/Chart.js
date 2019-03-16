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

    const thumb = document.createElement('div');
    thumb.classList.add('thumb');

    let mapCoords = this.element.getBoundingClientRect();
  }
}

function Slider(options) {
      var elem = options.elem;
      var thumbElem = elem.querySelector('.thumb');

      var sliderCoords, thumbCoords, shiftX, shiftY;

      elem.ondragstart = function() {
        return false;
      };

      elem.onmousedown = function(event) {
        if (event.target.closest('.thumb')) {
          startDrag(event.clientX, event.clientY);
          return false; // disable selection start (cursor change)
        }
      }

      function startDrag(startClientX, startClientY) {
        thumbCoords = thumbElem.getBoundingClientRect();
        shiftX = startClientX - thumbCoords.left;
        shiftY = startClientY - thumbCoords.top;

        sliderCoords = elem.getBoundingClientRect();

        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mouseup', onDocumentMouseUp);
      }



      function moveTo(clientX) {
        // вычесть координату родителя, т.к. position: relative
        var newLeft = clientX - shiftX - sliderCoords.left;

        // курсор ушёл вне слайдера
        if (newLeft < 0) {
          newLeft = 0;
        }
        var rightEdge = elem.offsetWidth - thumbElem.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        thumbElem.style.left = newLeft + 'px';
      }


      function onDocumentMouseMove(e) {
        moveTo(e.clientX);
      }

      function onDocumentMouseUp() {
        endDrag();
      }


      function endDrag() {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
      }

    }
