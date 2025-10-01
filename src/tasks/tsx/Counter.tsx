import { useState } from "react";

type Props = {
  initial?: number; // начальное значение (опционально)
};

/** Мини-счётчик на TSX с типами пропсов и состояния */
export default function Counter({ initial = 0 }: Props) {
  const [n, setN] = useState<number>(initial);

  return (
    <div>
      <div>Count: <b>{n}</b></div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => setN((x) => x + 1)}>+1</button>
        <button onClick={() => setN((x) => x - 1)}>-1</button>
        <button onClick={() => setN(0)}>reset</button>
      </div>
    </div>
  );
}
