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

chart._createElement();
document.body.append(chart.element);

chart.setView({
  // scaleX: 1,
  // scaleY: 1,
  // shiftX: 1,
});
