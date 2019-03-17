function ExpandableSlider(options) {
  const {slider, thumb, minWidth} = options;

  const outLeft = slider.querySelector('.out-left');
  const outRight = slider.querySelector('.out-right');

  const center = thumb.querySelector('.center');
  const right = thumb.querySelector('.right');
  const left = thumb.querySelector('.left');

  let startX, startLeft, startRight, maxOut;

  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleMouseDown(e.target, e.clientX);
  });

  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchStart(e.target, e.targetTouches[0].clientX);
  }, {passive: true});

  function handleMouseDown(target, x) {
    switch (target) {
      case center:
        startDrag(x);
        document.addEventListener('mousemove', onMouseDragMove);
        document.addEventListener('mouseup', onMouseDragEnd);
        break;
      case right:
        startExpandRight(x);
        document.addEventListener('mousemove', onMouseExpandRightMove);
        document.addEventListener('mouseup', onMouseExpandRightEnd);
        break;
      case left:
        startExpandLeft(x);
        document.addEventListener('mousemove', onMouseExpandLeftMove);
        document.addEventListener('mouseup', onMouseExpandLeftEnd);
        break;
    }
  };

  function handleTouchStart(target, x) {
    switch (target) {
      case center:
        startDrag(x);
        document.addEventListener('touchmove', onTouchDragMove);
        document.addEventListener('touchend', onTouchDragEnd);
        break;
      case right:
        startExpandRight(x);
        document.addEventListener('touchmove', onTouchExpandRightMove);
        document.addEventListener('touchend', onTouchExpandRightEnd);
        break;
      case left:
        startExpandLeft(x);
        document.addEventListener('touchmove', onTouchExpandLeftMove);
        document.addEventListener('touchend', onTouchExpandLeftEnd);
        break;
    }
  };

  function startDrag(x) {
    startX = x;
    startLeft = outLeft.offsetWidth;
    startRight = outRight.offsetWidth;
    maxOut = slider.offsetWidth - thumb.offsetWidth;
  }

  function startExpandRight(x) {
    startX = x;
    startRight = outRight.offsetWidth;
    maxOut = slider.offsetWidth - outLeft.offsetWidth - minWidth;
  }

  function startExpandLeft(x) {
    startX = x;
    startLeft = outLeft.offsetWidth;
    maxOut = slider.offsetWidth - outRight.offsetWidth - minWidth;
  }

  function moveTo(clientX) {
    shiftX = clientX - startX;

    let newLeft = startLeft + shiftX;
    let newRight = startRight - shiftX;

    if (newLeft < 0) {
      newLeft = 0;
      newRight = maxOut;
    } else if (newRight < 0) {
      newRight = 0;
      newLeft = maxOut;
    }

    outLeft.style.width = newLeft + 'px';
    outRight.style.width = newRight + 'px';
  }

  function expandRightTo(clientX) {
    shiftX = clientX - startX;
    let newRight = startRight - shiftX;
    if (newRight < 0) newRight = 0;
    if (newRight > maxOut) newRight = maxOut;
    outRight.style.width = newRight + 'px';
  }

  function expandLeftTo(clientX) {
    shiftX = clientX - startX;
    let newLeft = startLeft + shiftX;
    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxOut) newLeft = maxOut;
    outLeft.style.width = newLeft + 'px';
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
