function Slider(options) {
  var elem = options.elem;
  var thumbElem = elem.querySelector('.thumb');

  var sliderCoords, thumbCoords, shiftX, shiftY;
  var startWidth, startExpandRightX, startExpandLeftX, startLeftBorderX;
  const minWidth = 60;

  elem.ondragstart = function() {
    return false;
  };

  elem.onmousedown = function(event) {
    if (event.target.closest('.left')) {
      startExpandLeft(event.clientX, event.clientY);
      return false;
    }

    if (event.target.closest('.right')) {
      startExpandRight(event.clientX, event.clientY);
      return false;
    }

    if (event.target.closest('.center')) {
      startDrag(event.clientX, event.clientY);
      return false; // disable selection start (cursor change)
    }
  }

  function startDrag(startClientX, startClientY) {
    thumbCoords = thumbElem.getBoundingClientRect();
    sliderCoords = elem.getBoundingClientRect();

    shiftX = startClientX - thumbCoords.left;
    shiftY = startClientY - thumbCoords.top;

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  function startExpandRight(startClientX, startClientY) {
    thumbCoords = thumbElem.getBoundingClientRect();
    sliderCoords = elem.getBoundingClientRect();

    startExpandRightX = startClientX;
    startWidth = thumbCoords.width;

    document.addEventListener('mousemove', onDocumentMouseMoveExpandRight);
    document.addEventListener('mouseup', onDocumentMouseUpExpandRight);
  }

  function startExpandLeft(startClientX, startClientY) {
    thumbCoords = thumbElem.getBoundingClientRect();
    sliderCoords = elem.getBoundingClientRect();

    startExpandLeftX = startClientX;
    startWidth = thumbCoords.width;
    startLeftBorderX = thumbCoords.left - sliderCoords.left;

    document.addEventListener('mousemove', onDocumentMouseMoveExpandLeft);
    document.addEventListener('mouseup', onDocumentMouseUpExpandLeft);
  }

  function moveTo(clientX) {
    var newLeft = clientX - shiftX - sliderCoords.left;

    if (newLeft < 0) {
      newLeft = 0;
    }

    var rightEdge = elem.offsetWidth - thumbElem.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    thumbElem.style.left = newLeft + 'px';
  }

  function expandRightTo(clientX) {
    let newWidth = startWidth + clientX - startExpandRightX;

    if (newWidth < minWidth) newWidth = minWidth;
    if (thumbCoords.left + newWidth > sliderCoords.right) {
      newWidth = sliderCoords.right - thumbCoords.left;
    }

    thumbElem.style.width = newWidth + 'px';
  }

  function expandLeftTo(clientX) {
    let shift = startExpandLeftX - clientX;

    if (shift > startLeftBorderX) shift = startLeftBorderX;

    let newWidth = startWidth + shift;
    let newLeft = startLeftBorderX - shift;

    if (newWidth < minWidth) {
      newWidth = minWidth;
      newLeft = startRightBorderX - minWidth;
    }

    thumbElem.style.width = newWidth + 'px';
    thumbElem.style.left = newLeft + 'px';
  }


  function onDocumentMouseMove(e) {
    moveTo(e.clientX);
  }

  function onDocumentMouseUp() {
    endDrag();
  }

  function onDocumentMouseMoveExpandRight(e) {
    expandRightTo(e.clientX);
  }

  function onDocumentMouseUpExpandRight() {
    endExpandRight();
  }

  function onDocumentMouseMoveExpandLeft(e) {
    expandLeftTo(e.clientX);
  }

  function onDocumentMouseUpExpandLeft() {
    endExpandLeft();
  }

  function endDrag() {
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  }

  function endExpandRight() {
    document.removeEventListener('mousemove', onDocumentMouseMoveExpandRight);
    document.removeEventListener('mouseup', onDocumentMouseUpExpandRight);
  }

  function endExpandLeft() {
    document.removeEventListener('mousemove', onDocumentMouseMoveExpandLeft);
    document.removeEventListener('mouseup', onDocumentMouseUpExpandLeft);
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
