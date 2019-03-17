function ExpandableSlider(options) {
  const {slider, thumb, minWidth} = options;

  const outLeft = slider.querySelector('out-left');
  const outRight = slider.querySelector('out-right');

  const center = thumb.querySelector('.center');
  const right = thumb.querySelector('.right');
  const left = thumb.querySelector('.left');

  let sliderCoords, thumbCoords;

  function updateCoords() {
    thumbCoords = thumb.getBoundingClientRect();
    sliderCoords = slider.getBoundingClientRect();
  }

  let startWidth, startExpand, startLeft, startRight, shiftX;

  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleMouseDown(e.target, e.clientX);
  });

  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchStart(e.target, e.targetTouches[0].clientX);
  }, {passive: true});

  function handleMouseDown(target, xStart) {
    switch (target) {
      case center:
        startDrag(xStart);
        document.addEventListener('mousemove', onMouseDragMove);
        document.addEventListener('mouseup', onMouseDragEnd);
        break;
      case right:
        startExpandRight(xStart);
        document.addEventListener('mousemove', onMouseExpandRightMove);
        document.addEventListener('mouseup', onMouseExpandRightEnd);
        break;
      case left:
        startExpandLeft(xStart);
        document.addEventListener('mousemove', onMouseExpandLeftMove);
        document.addEventListener('mouseup', onMouseExpandLeftEnd);
        break;
    }
  };

  function handleTouchStart(target, xStart) {
    switch (target) {
      case center:
        startDrag(xStart);
        document.addEventListener('touchmove', onTouchDragMove);
        document.addEventListener('touchend', onTouchDragEnd);
        break;
      case right:
        startExpandRight(xStart);
        document.addEventListener('touchmove', onTouchExpandRightMove);
        document.addEventListener('touchend', onTouchExpandRightEnd);
        break;
      case left:
        startExpandLeft(xStart);
        document.addEventListener('touchmove', onTouchExpandLeftMove);
        document.addEventListener('touchend', onTouchExpandLeftEnd);
        break;
    }
  };

  function startDrag(xStart) {
    updateCoords();
    shiftX = xStart - thumbCoords.left;
  }

  function startExpandRight(xStart) {
    updateCoords();
    startExpand = xStart;
    startWidth = thumbCoords.width;
  }

  function startExpandLeft(xStart) {
    updateCoords();
    startExpand = xStart;
    startWidth = thumbCoords.width;
    startLeft = thumbCoords.left - sliderCoords.left;
    startRight = thumbCoords.right - sliderCoords.left;
  }

  function moveTo(clientX) {
    let newLeft = clientX - shiftX - sliderCoords.left;
    if (newLeft < 0) newLeft = 0;

    let rightEdge = slider.offsetWidth - thumb.offsetWidth;
    if (newLeft > rightEdge) newLeft = rightEdge;

    thumb.style.left = newLeft + 'px';
  }

  function expandRightTo(clientX) {
    const shift = clientX - startExpand;

    let newWidth = startWidth + shift;

    if (newWidth < minWidth) newWidth = minWidth;

    if (thumbCoords.left + newWidth > sliderCoords.right) {
      newWidth = sliderCoords.right - thumbCoords.left;
    }

    thumb.style.width = newWidth + 'px';
  }

  function expandLeftTo(clientX) {
    let shift = startExpand - clientX;

    if (shift > startLeft) shift = startLeft;

    if (startLeft - shift > startRight - minWidth) {
      shift = startLeft + minWidth - startRight;
    }

    const newWidth = startWidth + shift;
    const newLeft = startLeft - shift;

    thumb.style.width = newWidth + 'px';
    thumb.style.left = newLeft + 'px';
  }

  function onMouseDragMove(e) {
    moveTo(e.clientX);
  }
  function onTouchDragMove(e) {
    moveTo(e.targetTouches[0].clientX);
  }

  function onMouseExpandLeftMove(e) {
    expandLeftTo(e.clientX);
  }
  function onTouchExpandLeftMove(e) {
    expandLeftTo(e.targetTouches[0].clientX);
  }

  function onMouseExpandRightMove(e) {
    expandRightTo(e.clientX);
  }
  function onTouchExpandRightMove(e) {
    expandRightTo(e.targetTouches[0].clientX);
  }

  function onMouseDragEnd() {
    document.removeEventListener('mousemove', onMouseDragMove);
    document.removeEventListener('mouseup', onMouseDragEnd);
  }
  function onTouchDragEnd() {
    document.removeEventListener('touchmove', onTouchDragMove);
    document.removeEventListener('touchend', onTouchDragEnd);
  }

  function onMouseExpandRightEnd() {
    document.removeEventListener('mousemove', onMouseExpandRightMove);
    document.removeEventListener('mouseup', onMouseExpandRightEnd);
  }
  function onTouchExpandRightEnd() {
    document.removeEventListener('touchmove', onTouchExpandRightMove);
    document.removeEventListener('touchend', onTouchExpandRightEnd);
  }

  function onMouseExpandLeftEnd() {
    document.removeEventListener('mousemove', onMouseExpandLeftMove);
    document.removeEventListener('mouseup', onMouseExpandLeftEnd);
  }
  function onTouchExpandLeftEnd() {
    document.removeEventListener('touchmove', onTouchExpandLeftMove);
    document.removeEventListener('touchend', onTouchExpandLeftEnd);
  }

}
