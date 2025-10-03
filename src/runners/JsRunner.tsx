import { useEffect, useState, type ReactElement } from "react";

type JsModule = Record<string, unknown>;
type AnyFn = (...args: unknown[]) => unknown;
type View = ReactElement | null;

const isFn = (v: unknown): v is AnyFn => typeof v === "function";

function fmt(v: unknown): string {
  try {
    return typeof v === "string" ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

/** Перехватываем console.log на время run() */
function captureConsole<T>(run: () => T): { result: T; logs: string[] } {
  const orig = console.log;
  const logs: string[] = [];
  console.log = (...args: unknown[]) => {
    logs.push(args.map(fmt).join(" "));
    orig(...args);
  };
  try {
    const result = run();
    return { result, logs };
  } finally {
    console.log = orig;
  }
}

/** Выполнить сырой JS-файл как скрипт и собрать его console.log.
 *  Прим.: очень упрощённо убираем `export` (для типичных задач без импортов).
 */
function runRawFile(raw: string): { logs: string[]; error?: unknown } {
  // 1) выкидываем `export` (function/const/let/class)
  const script = raw.replace(/^(\s*)export\s+/gm, "$1");
  try {
    const { logs } = captureConsole(() => {
      const fn = new Function("console", `"use strict";\n${script}\n`);
      fn(console);
    });
    return { logs };
  } catch (e) {
    return { logs: [], error: e };
  }
}

type Props = {
  moduleLoader: () => Promise<JsModule>;
  rawLoader: () => Promise<string>;
};

export default function JsRunner({ moduleLoader, rawLoader }: Props) {
  const [view, setView] = useState<View>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Параллельно грузим модуль (для demo/run) и сырой текст (для top-level логов)
        const [mod, raw] = await Promise.all([moduleLoader(), rawLoader()]);

        if (cancelled) return;

        // --- A) Пытаемся запустить demo()/run() (и показать его результат) ---
        const demo = isFn(mod.demo) ? (mod.demo as AnyFn) : undefined;
        const runFn = !demo && isFn(mod.run) ? (mod.run as AnyFn) : undefined;

        let demoBlock: ReactElement | null = null;
        if (demo || runFn) {
          const label = demo ? "demo()" : "run()";
          try {
            const { result, logs } = captureConsole(() => (demo ?? runFn)!());
            demoBlock = (
              <div>
                <div>
                  <b>{label} →</b>{" "}
                  {typeof result === "object" && result !== null ? (
                    <span>{(result as ReactElement) ?? fmt(result)}</span>
                  ) : (
                    <span>{fmt(result)}</span>
                  )}
                </div>
                {logs.length > 0 && <pre style={{ marginTop: 8 }}>{logs.join("\n")}</pre>}
              </div>
            );
          } catch (err) {
            console.error("Ошибка при выполнении", label, err);
            demoBlock = <div>Ошибка при выполнении {label}.</div>;
          }
        }

        // --- B) Всегда пробуем собрать top-level console.log из «сырого» файла ---
        const { logs: topLogs, error: rawErr } = runRawFile(raw);
        const logsBlock =
          topLogs.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ opacity: 0.75, marginBottom: 4 }}>Console output (top-level):</div>
              <pre>{topLogs.join("\n")}</pre>
            </div>
          ) : rawErr ? (
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              Не удалось собрать консольный вывод top-level.
            </div>
          ) : null;

        // Если нет ни demo/run результата, ни логов — подсказка как запускать
        if (!demoBlock && !logsBlock) {
          const arities = Object.entries(mod)
            .filter(([, v]) => isFn(v))
            .map(([k, v]) => `${k}(${(v as AnyFn).length} args)`);
          setView(
            <div>
              <div>Нет видимого результата.</div>
              <div style={{ marginTop: 6 }}>
                Добавьте <code>export function demo()</code> или <code>export function run()</code>,
                либо оставьте <code>console.log(...)</code> на верхнем уровне — он попадёт сюда.
              </div>
              {arities.length > 0 && (
                <>
                  <div style={{ marginTop: 8 }}>Найденные функции:</div>
                  <pre>{arities.join("\n")}</pre>
                </>
              )}
            </div>
          );
          return;
        }

        setView(
          <div>
            {demoBlock}
            {logsBlock}
          </div>
        );
      } catch (err) {
        console.error("Ошибка загрузки JS-модуля", err);
        setView(<div>Ошибка загрузки JS-модуля.</div>);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [moduleLoader, rawLoader]);

  return view ?? <span className="muted">Загрузка…</span>;
}
