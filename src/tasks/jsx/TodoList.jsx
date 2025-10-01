/**
 * ЗАДАЧА (JSX): Простой список дел.
 *  - Принять проп items: string[]
 *  - Показать элементы и счётчик внизу.
 */
export default function TodoList({ items = [] }) {
  return (
    <div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <small style={{ opacity: 0.8 }}>Всего: {items.length}</small>
    </div>
  );
}

export const previewProps = {
  items: ["Развернуть проект", "Сделать задачи", "Залить на Vercel"],
};
