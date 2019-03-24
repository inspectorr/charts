'use strict';

console.log(chartsData);

const root = document.getElementById('root');

const width = document.documentElement.clientWidth - 20;

const view = {
  mainChart: {
    width,
    height: 350,
    strokeWidth: 2,
  },
  chartMap: {
    width,
    height: 50,
    strokeWidth: 1.3,
    thumb: {
      days: 20,
      minDays: 12,
      minWidth: 70,
      width: 100,
      right: 0,
    },
  },
  timeScale: {
    width,
    height: 40,
  }
}

const chart = new Chart({ data: chartsData[0], view });

// console.log(chart.store.times);

root.append(chart.getElement());
chart.onMount();
