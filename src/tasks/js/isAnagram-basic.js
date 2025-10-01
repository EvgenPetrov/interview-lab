/**
 * ЗАДАЧА: Проверить, являются ли две строки анаграммами.
 * Условия:
 *  - Игнорируем регистр и пробелы.
 *  - Буквы из Unicode обрабатываем как обычные символы.
 *  - Вернуть true/false.
 */
export function isAnagram(a, b) {
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "").split("").sort().join("");
  return norm(a) === norm(b);
}

export function demo() {
  const r1 = isAnagram("listen", "silent"); // true
  const r2 = isAnagram("Tom Marvolo Riddle", "I am Lord Voldemort"); // true
  const r3 = isAnagram("кот", "ток"); // true
  const r4 = isAnagram("abc", "abс"); // возможно false (другая «с»)

  console.log("isAnagram results:", r1, r2, r3, r4);
  return r1 && r2 && r3 && !r4 ? "OK" : "Check cases";
}
