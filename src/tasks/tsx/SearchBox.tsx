/**
 * ЗАДАЧА (TSX): Поле поиска с дебаунсом.
 *  - Принять onSearch(term: string) и delay?: number
 *  - Вызвать onSearch спустя delay мс после последнего ввода.
 */
import { useEffect, useState } from "react";

type Props = {
  onSearch: (term: string) => void;
  delay?: number;
};

export default function SearchBox({ onSearch, delay = 250 }: Props) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(term), delay);
    return () => clearTimeout(t);
  }, [term, delay, onSearch]);

  return (
    <div>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Поиск…"
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 8,
          background: "#0a0f1a",
          color: "inherit",
          border: "1px solid #1f2937",
        }}
      />
      <small style={{ opacity: 0.8 }}>Дебаунс: {delay} мс</small>
    </div>
  );
}

export const Preview = () => <SearchBox onSearch={(q) => console.log("search:", q)} delay={300} />;
