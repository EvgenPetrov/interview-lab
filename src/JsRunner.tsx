import { useEffect, useState, type ReactElement } from "react";

type JsModule = {
  demo?: () => React.ReactNode | string | number;
  sum?: (a: number, b: number) => unknown;
};

export default function JsRunner({ loader }: { loader: () => Promise<JsModule> }) {
  const [view, setView] = useState<ReactElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    loader().then((mod) => {
      if (cancelled) return;

      // 1) demo()
      if (typeof mod.demo === "function") {
        const out = mod.demo();
        setView(<div>{typeof out === "object" ? out : String(out)}</div>);
        return;
      }

      // 2) sum(2,3)
      if (typeof mod.sum === "function") {
        try {
          const val = mod.sum(2, 3);
          setView(
            <div>
              <div>
                <b>sum(2, 3) = {String(val)}</b>
              </div>
              <small>
                Экспорт найден: <code>sum(a,b)</code>
              </small>
            </div>
          );
          return;
        } catch {
          // игнорируем ошибки выполнения sum
        }
      }

      // 3) показать экспорты модуля
      setView(
        <div>
          <div>Экспорты модуля:</div>
          <pre>{JSON.stringify(Object.keys(mod), null, 2)}</pre>
          <small>
            Поддерживаются: export const <code>demo</code> или function <code>sum</code>.
          </small>
        </div>
      );
    });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return view ?? <span className="muted">Загрузка…</span>;
}
