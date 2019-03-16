console.log(chartsData);

const store = new ChartStore(chartsData[4]);

const chart = new MainChart({
  lines: store.lines,
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
