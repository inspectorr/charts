'use strict';

console.log(chartsData);
// https://github.com/nwinkler/atom-keyboard-shortcuts

const store = new ChartStore(chartsData[0]);

const chart = new MainChart({
  lines: store.outputLines,
  view: {
    width: 500,
    height: 300,
    strokeWidth: 1.5,
  },
});

// chart._createElement();
document.body.append(chart.getElement());

chart.setView({
  // scaleX: 1,
  // scaleY: 1,
  // shiftX: 1,
});

// console.log(store.getPoint(0, 0));
// console.log('globalPeak', store.globalPeak);
// store.generateLocals(0, store.N-1);
// console.log('localPeak', store.localPeak);
