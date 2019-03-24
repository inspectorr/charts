'use strict';

console.log(chartsData);

const root = document.getElementById('root');

const clientWidth = document.documentElement.clientWidth;

const view = {
  mainChart: {
    width: clientWidth,
    height: 300,
    strokeWidth: 2,
  },
  chartMap: {
    width: clientWidth,
    height: 50,
    strokeWidth: 1.3,
    thumb: {
      minWidth: 70,
      width: 100,
      right: 0,
    },
  },
}

const chart = new Chart({ data: chartsData[0], view });
root.append(chart.getElement());
chart.onMount();
