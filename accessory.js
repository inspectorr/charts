function bench(func) {
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    func();
  }
  const end = performance.now();
  console.log(end - start);
}
