import { Suspense, lazy, useMemo, useState, type ComponentType } from "react";
import "./index.css";
import Select from "./Select";

// ----- Типы модулей -----
type JsModule = {
  demo?: () => React.ReactNode | string | number;
  sum?: (a: number, b: number) => unknown;
};
type ReactCompModule = { default: ComponentType<unknown> };
type TaskProps = { initial?: number };
type ReactCompModuleWithInitial = { default: ComponentType<TaskProps> };

// ----- Сбор модулей -----
const jsModules = import.meta.glob<JsModule>("./tasks/js/*.js");
const jsxModules = import.meta.glob<ReactCompModule>("./tasks/jsx/*.jsx");
const tsxModules = import.meta.glob<ReactCompModuleWithInitial>("./tasks/tsx/*.tsx");

type Tab = "js" | "jsx" | "tsx";
const fileLabel = (path: string) => path.split("/").pop() ?? path;

import JsRunner from "./JsRunner";

export default function App() {
  const [tab, setTab] = useState<Tab>("js");

  const jsList = useMemo(() => Object.keys(jsModules).sort(), []);
  const jsxList = useMemo(() => Object.keys(jsxModules).sort(), []);
  const tsxList = useMemo(() => Object.keys(tsxModules).sort(), []);

  const [jsPick, setJsPick] = useState(() => jsList[0] ?? "");
  const [jsxPick, setJsxPick] = useState(() => jsxList[0] ?? "");
  const [tsxPick, setTsxPick] = useState(() => tsxList[0] ?? "");

  const JsxComp = useMemo(
    () =>
      jsxPick ? lazy(() => jsxModules[jsxPick]!().then((m) => ({ default: m.default }))) : null,
    [jsxPick]
  );
  const TsxComp = useMemo(
    () =>
      tsxPick ? lazy(() => tsxModules[tsxPick]!().then((m) => ({ default: m.default }))) : null,
    [tsxPick]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="title">Interview Lab: JS / JSX / TSX</div>
      </header>

      <div className="tabs">
        <button className={"tab " + (tab === "js" ? "active" : "")} onClick={() => setTab("js")}>
          JS
        </button>
        <button className={"tab " + (tab === "jsx" ? "active" : "")} onClick={() => setTab("jsx")}>
          JSX
        </button>
        <button className={"tab " + (tab === "tsx" ? "active" : "")} onClick={() => setTab("tsx")}>
          TSX
        </button>
      </div>

      <section className="panel">
        {/* --- JS --- */}
        {tab === "js" && (
          <>
            <div className="controls">
              <label className="control">
                <span className="control-label">Файл</span>
                <Select
                  value={jsPick}
                  onChange={setJsPick}
                  options={jsList.map((p) => ({ value: p, label: fileLabel(p) }))}
                />
              </label>
            </div>

            <div className="card mt-12">
              {jsPick ? (
                <JsRunner loader={jsModules[jsPick]!} />
              ) : (
                <em>
                  Файлы не найдены в <code>src/tasks/js</code>
                </em>
              )}
            </div>
          </>
        )}

        {/* --- JSX --- */}
        {tab === "jsx" && (
          <>
            <div className="controls">
              <label className="control">
                <span className="control-label">Файл</span>
                <Select
                  value={jsxPick}
                  onChange={setJsxPick}
                  options={jsxList.map((p) => ({ value: p, label: fileLabel(p) }))}
                />
              </label>
            </div>

            <div className="card mt-12">
              {JsxComp ? (
                <Suspense fallback={<span className="muted">Загрузка…</span>}>
                  <JsxComp />
                </Suspense>
              ) : (
                <em>
                  Нет компонентов в <code>src/tasks/jsx</code>
                </em>
              )}
            </div>
          </>
        )}

        {/* --- TSX --- */}
        {tab === "tsx" && (
          <>
            <div className="controls">
              <label className="control">
                <span className="control-label">Файл</span>
                <Select
                  value={tsxPick}
                  onChange={setTsxPick}
                  options={tsxList.map((p) => ({ value: p, label: fileLabel(p) }))}
                />
              </label>
            </div>

            <div className="card mt-12">
              {TsxComp ? (
                <Suspense fallback={<span className="muted">Загрузка…</span>}>
                  <TsxComp initial={5} />
                </Suspense>
              ) : (
                <em>
                  Нет компонентов в <code>src/tasks/tsx</code>
                </em>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
