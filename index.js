'use strict';

console.log(chartsData);

const root = document.getElementById('root');

const clientWidth = document.documentElement.clientWidth;

const view = {
  mainChart: {
    width: 500,
    height: 300,
    strokeWidth: 2,
  },
  chartMap: {
    width: 500,
    height: 50,
    strokeWidth: 1,
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
