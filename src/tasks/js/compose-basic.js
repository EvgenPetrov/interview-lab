/**
 * ЗАДАЧА: Реализовать compose(...fns)
 *  - compose(f, g, h)(x) === f(g(h(x)))
 *  - Если функций нет — вернуть идентичность (x => x).
 */
export function compose(...fns) {
  if (fns.length === 0) return (x) => x;
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

const double = (x) => x * 2;
const inc = (x) => x + 1;
const square = (x) => x * x;

const calc = compose(square, inc, double); // square(inc(double(x)))
console.log("compose(calc, 3) =", calc(3)); // (3*2)+1=7; 7^2=49
