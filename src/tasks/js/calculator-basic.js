/**
 * ЗАДАЧА: Реализовать функцию calculator(a, b, operation)
 * -----------------------------------------------
 * Требования:
 * 1) Поддержать операции: "+", "-", "*", "/".
 * 2) Операнды a и b приводим к числу через Number(...).
 * 3) Если operation не из списка — вернуть строку "Неверная операция".
 * 4) Если ОДИН из операндов не приводится к числу — считаем,
 *    и результат может быть NaN (это окей, см. пример с "abc").
 * 5) Если ОБА операнда не приводятся к числу — вернуть "Неверная операция".
 * 6) Деление на ноль должно возвращать 0.
 */

export function calculator(a, b, operation) {
  // нормализуем операцию к строке без пробелов
  const op = String(operation ?? "").trim();

  // допустимые операции
  const ok = new Set(["+", "-", "*", "/"]);
  if (!ok.has(op)) return "Неверная операция";

  // приводим операнды к числам
  const numA = Number(a);
  const numB = Number(b);

  // если оба не являются числами — считаем это ошибкой постановки задачи
  if (Number.isNaN(numA) && Number.isNaN(numB)) return "Неверная операция";

  // обработка деления на ноль по условию задачи
  if (op === "/" && numB === 0) return 0;

  // считаем результат
  switch (op) {
    case "+":
      return numA + numB;
    case "-":
      return numA - numB;
    case "*":
      return numA * numB;
    case "/":
      return numA / numB;
    // default не нужен — выше уже отфильтровали
  }
}

console.log(calculator(10, 5, "+")); // 15
console.log(calculator(10, "5", "*")); // 50
console.log(calculator("Hello", "World", "+")); // Неверная операция
console.log(calculator(10, 0, "/")); // 0
console.log(calculator(-10, 0, "/")); // 0
console.log(calculator("abc", 5, "+")); // NaN
console.log(calculator(10, "5", "%")); // Неверная операция
