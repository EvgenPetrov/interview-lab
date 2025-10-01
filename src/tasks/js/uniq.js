// Вернуть уникальные значения массива (JS)
export function uniq(arr) {
  return Array.from(new Set(arr));
}

let arr = [1, 1, 2, 3, 3];

console.log(uniq(arr));
