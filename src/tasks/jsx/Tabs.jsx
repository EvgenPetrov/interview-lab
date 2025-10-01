/**
 * ЗАДАЧА (JSX): Вкладки.
 *  - Принять проп tabs: {label: string, content: React.ReactNode}[]
 *  - Отрисовать шапку и активную вкладку.
 */
import { useState } from "react";

export default function Tabs({ tabs = [] }) {
  const [i, setI] = useState(0);
  const active = tabs[i] ?? null;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setI(idx)}
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              border: "1px solid #1f2937",
              background: idx === i ? "#0d172b" : "#0b1220",
              color: "inherit",
              cursor: "pointer",
            }}>
            {t.label}
          </button>
        ))}
      </div>
      <div>{active ? active.content : <em>Нет вкладок</em>}</div>
    </div>
  );
}

export const Preview = () => (
  <Tabs
    tabs={[
      { label: "JS", content: <div>Vanilla JS</div> },
      { label: "JSX", content: <div>React (JSX)</div> },
      { label: "TSX", content: <div>React + TS</div> },
    ]}
  />
);
