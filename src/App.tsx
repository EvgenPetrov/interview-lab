import { useEffect, useMemo, useState } from "react";
import "./index.css";
import Select from "./Select";
import CodePane from "./CodePane";
import JsRunner from "./JsRunner";
import ReactRunner, { type ReactModuleShape } from "./ReactRunner";

// ----- Типы модулей -----
type JsModule = {
  demo?: () => React.ReactNode | string | number;
  sum?: (a: number, b: number) => unknown;
};

// ----- Динамические модули -----
const jsModules = import.meta.glob<JsModule>("./tasks/js/*.js");

// 👇 тут был свой ReactModule — удаляем его
// и используем единый тип из ReactRunner
const jsxModules = import.meta.glob<ReactModuleShape>("./tasks/jsx/*.jsx");
const tsxModules = import.meta.glob<ReactModuleShape>("./tasks/tsx/*.tsx");

// ----- Сырые исходники -----
const jsSources = import.meta.glob<string>("./tasks/js/*.js", { as: "raw" });
const jsxSources = import.meta.glob<string>("./tasks/jsx/*.jsx", { as: "raw" });
const tsxSources = import.meta.glob<string>("./tasks/tsx/*.tsx", { as: "raw" });

// ————— липкое состояние —————
function useStickyState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (err) {
      console.warn(`sticky[${key}] read failed`, err);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`sticky[${key}] write failed`, err);
    }
  }, [key, state]);

  return [state, setState] as const;
}

type Tab = "js" | "jsx" | "tsx";
const fileLabel = (p: string) => p.split("/").pop() ?? p;

export default function App() {
  // списки
  const jsList = useMemo(() => Object.keys(jsModules).sort(), []);
  const jsxList = useMemo(() => Object.keys(jsxModules).sort(), []);
  const tsxList = useMemo(() => Object.keys(tsxModules).sort(), []);

  // липкие значения
  const [tab, setTab] = useStickyState<Tab>("lab.tab", "js");
  const [jsPick, setJsPick] = useStickyState<string>("lab.pick.js", jsList[0] ?? "");
  const [jsxPick, setJsxPick] = useStickyState<string>("lab.pick.jsx", jsxList[0] ?? "");
  const [tsxPick, setTsxPick] = useStickyState<string>("lab.pick.tsx", tsxList[0] ?? "");

  // если список файлов изменился (или пуст), подправляем выбранные
  useEffect(() => {
    if (jsPick && !jsList.includes(jsPick)) setJsPick(jsList[0] ?? "");
  }, [jsList, jsPick, setJsPick]);
  useEffect(() => {
    if (jsxPick && !jsxList.includes(jsxPick)) setJsxPick(jsxList[0] ?? "");
  }, [jsxList, jsxPick, setJsxPick]);
  useEffect(() => {
    if (tsxPick && !tsxList.includes(tsxPick)) setTsxPick(tsxList[0] ?? "");
  }, [tsxList, tsxPick, setTsxPick]);

  return (
    <div className="app">
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
                <JsRunner moduleLoader={jsModules[jsPick]!} rawLoader={jsSources[jsPick]!} />
              ) : (
                <em>Файлы не найдены</em>
              )}
            </div>
            {jsPick && (
              <div className="card mt-12">
                <CodePane
                  loader={jsSources[jsPick]!}
                  language="javascript"
                  title={fileLabel(jsPick)}
                />
              </div>
            )}
          </>
        )}

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
              {jsxPick ? (
                <ReactRunner moduleLoader={jsxModules[jsxPick]!} />
              ) : (
                <em>Нет компонентов</em>
              )}
            </div>

            {jsxPick && (
              <div className="card mt-12">
                <CodePane loader={jsxSources[jsxPick]!} language="jsx" title={fileLabel(jsxPick)} />
              </div>
            )}
          </>
        )}

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
              {tsxPick ? (
                <ReactRunner moduleLoader={tsxModules[tsxPick]!} />
              ) : (
                <em>Нет компонентов</em>
              )}
            </div>

            {tsxPick && (
              <div className="card mt-12">
                <CodePane loader={tsxSources[tsxPick]!} language="tsx" title={fileLabel(tsxPick)} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
