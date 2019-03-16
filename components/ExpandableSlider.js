function Slider(options) {
  const {slider, thumb, minWidth} = options;

  const center = thumb.querySelector('.center');
  const right = thumb.querySelector('.right');
  const left = thumb.querySelector('.left');

  let sliderCoords, thumbCoords;

  function updateCoords() {
    thumbCoords = thumb.getBoundingClientRect();
    sliderCoords = slider.getBoundingClientRect();
  }

  let startWidth, startExpand, startLeft, shiftX, shiftY;

  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleMouseDown(e.target, e.clientX);
  });

  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchStart(e.target, e.targetTouches[0].clientX);
  });

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
        document.addEventListener('mousemove', onMouseExpandRightMove);
        document.addEventListener('mouseup', onMouseExpandRightEnd);
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
        document.addEventListener('touchmove', onTouchExpandRightMove);
        document.addEventListener('touchend', onTouchExpandRightEnd);
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
  }

  function moveTo(clientX) {
    let newLeft = clientX - shiftX - sliderCoords.left;
    if (newLeft < 0) newLeft = 0;

    let rightEdge = slider.offsetWidth - thumb.offsetWidth;
    if (newLeft > rightEdge) newLeft = rightEdge;

    thumb.style.left = newLeft + 'px';
  }

  function expandRightTo(clientX) {
    let newWidth = startWidth + clientX - startExpand;

    if (newWidth < minWidth) newWidth = minWidth;

    if (thumbCoords.left + newWidth > sliderCoords.right) {
      newWidth = sliderCoords.right - thumbCoords.left;
    }

    thumb.style.width = newWidth + 'px';
  }

  function expandLeftTo(clientX) {
    let shift = startExpand - clientX;
    if (shift > startLeft) shift = startLeft;

    let newWidth = startWidth + shift;
    let newLeft = startLeft - shift;

    if (newWidth < minWidth) {
      newWidth = minWidth;
      newLeft = startRightBorderX - minWidth;
    }

    thumb.style.width = newWidth + 'px';
    thumb.style.left = newLeft + 'px';
  }

  function onMouseDragMove(e) {
    moveTo(e.clientX);
  }

  function onMouseExpandLeftMove(e) {
    expandLeftTo(e.clientX);
  }

  function onMouseExpandRightMove(e) {
    expandRightTo(e.clientX);
  }

  function onMouseDragEnd() {
    document.removeEventListener('mousemove', onMouseDragMove);
    document.removeEventListener('mouseup', onMouseDragEnd);
  }

  function onMouseExpandRightEnd() {
    document.removeEventListener('mousemove', onMouseExpandRightMove);
    document.removeEventListener('mouseup', onMouseExpandRightEnd);
  }

  function onMouseExpandLeftEnd() {
    document.removeEventListener('mousemove', onMouseExpandLeftMove);
    document.removeEventListener('mouseup', onMouseExpandLeftEnd);
  }

}

//
//
// <!DOCTYPE html>
// <html>
//
// <head>
//   <meta charset="utf-8">
//   <script src="https://cdn.polyfill.io/v1/polyfill.js?features=Element.prototype.closest"></script>
//
//   <style>
//     .slider {
//       margin: 25px;
//       width: 310px;
//       height: 15px;
//       border-radius: 5px;
//       background: #E0E0E0;
//       background: -moz-linear-gradient(left top, #E0E0E0, #EEEEEE) repeat scroll 0 0 transparent;
//       background: -webkit-gradient(linear, left top, right bottom, from(#E0E0E0), to(#EEEEEE));
//       background: linear-gradient(left top, #E0E0E0, #EEEEEE);
//     }
//
//     .thumb {
//       position: relative;
//       top: -5px;
//       left: 10px;
//       width: 60px;
//       height: 25px;
//       /*border: 1px solid black;*/
//       cursor: pointer;
//       display: flex;
//     }
//
//     .left, .right {
//       border: 1px solid red;
//       width: 15px;
//       flex: none;
//       position: relative;
//     }
//
//     .center {
//       border: 1px solid blue;
//       flex: 1;
//       position: relative;
//     }
//
//     .left {
//       border-left-width: 5px;
//       left: 0;
//     }
//
//     .right {
//       border-right-width: 5px;
//       right: 0;
//     }
//   </style>
// </head>
//
// <body>
//   <div id="slider" class="slider">
//     <div class="thumb">
//       <div class="left"></div>
//       <div class="center"></div>
//       <div class="right"></div>
//     </div>
//   </div>
//   <script>
//     var slider = new Slider({
//       elem: document.getElementById('slider')
//     });
//
//
//   </script>
// </body>
//
// </html>
