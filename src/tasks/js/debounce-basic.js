/**
 * ЗАДАЧА: Реализовать debounce(fn, wait).
 *  - Возвращает обёртку, которая откладывает вызов fn на wait мс.
 *  - Если обёртка вызывается повторно до истечения таймера — таймер перезапускается.
 *  - this и аргументы должны проксироваться в fn.
 *  - Вернуть вспомогательные методы .cancel() и .flush()
 */
export function debounce(fn, wait = 200) {
  let t = null;
  let lastArgs;
  let lastThis;

  function wrapper(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn.apply(lastThis, lastArgs);
    }, wait);
  }

  wrapper.cancel = () => {
    clearTimeout(t);
    t = null;
  };

  wrapper.flush = () => {
    if (t !== null) {
      clearTimeout(t);
      t = null;
      fn.apply(lastThis, lastArgs);
    }
  };

  return wrapper;
}

export function demo() {
  const log = debounce((v) => console.log("debounced:", v), 100);
  log(1);
  log(2);
  log(3); // будет только "debounced: 3"
  return "Call debounced logs in console";
}
