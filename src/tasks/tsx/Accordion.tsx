/**
 * ЗАДАЧА (TSX): Аккордеон
 * - Принимает items: { title: string; content: React.ReactNode }[]
 * - Управляет одним открытым пунктом (uncontrolled)
 * - Внизу добавляем статическое свойство previewProps для демо
 */
import { useState, type FC, type ReactNode } from "react";

type Item = { title: string; content: ReactNode };
type Props = { items: Item[] };

type AccordionComponent = FC<Props> & { previewProps?: Props };

const Accordion: AccordionComponent = ({ items = [] }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx}>
            <button type="button" onClick={() => setOpen(isOpen ? null : idx)}>
              {it.title}
            </button>
            {isOpen && <div>{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

// 👇 статическое свойство с тестовыми данными
Accordion.previewProps = {
  items: [
    { title: "Что это?", content: "Мини-аккордеон на TSX." },
    { title: "Зачем?", content: "Типичная задача на состояние и типы пропсов." },
    { title: "Как?", content: "Открывается только один пункт за раз." },
  ],
};

export default Accordion;
