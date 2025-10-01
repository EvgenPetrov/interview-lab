// Вернуть уникальные значения массива (JS)
export function uniq(arr) {
  return Array.from(new Set(arr));
}

// Пример:
// uniq([1,1,2,3,3]) -> [1,2,3]
