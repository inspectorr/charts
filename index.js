'use strict';

console.log(chartsData);

const view = {
  mainChart: {
    width: 600,
    height: 300,
    strokeWidth: 1.5,
  },
  chartMap: {
    width: 600,
    height: 50,
    strokeWidth: 1,
  },
}

const chart = new Chart({ data: chartsData[1], view });
document.getElementById('root').append(chart.getElement());

// chart.setMode('night');

// https://github.com/nwinkler/atom-keyboard-shortcuts

// const store = new ChartStore(chartsData[0]);
//
// const chart = new ChartView({
//   lines: store.outputLines,
//   view: {
//     width: 500,
//     height: 300,
//     strokeWidth: 1.5,
//   },
// });

// chart._createElement();
// document.body.append(chart.getElement());

// chart.setView({
  // scaleX: 1,
  // scaleY: 1,
  // shiftX: 1,
// });

// console.log(store.getPoint(0, 0));
// console.log('globalPeak', store.globalPeak);
// store.generateLocals(0, store.N-1);
// console.log('localPeak', store.localPeak);
