console.log(chartsData);

// const el = document.createElement('div');
// el.addEventListener('op', (e) => console.log(e.detail));
// el.dispatchEvent(new CustomEvent('op', {detail: 1}));

const store = new ChartStore(chartsData[4]);

const chart = new ChartView({
  lines: store.lines,
  view: {
    width: 500,
    height: 300,
    strokeWidth: 1,
  },
});

chart.render();
