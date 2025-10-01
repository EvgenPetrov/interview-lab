import { useEffect, useState, createElement, type ComponentType, type ReactElement } from "react";

type PropsMap = Record<string, unknown>;

// 👉 Экспортируем единый тип формы модуля
export type ReactModuleShape = {
  default?: ComponentType<PropsMap>;
  Preview?: ComponentType<PropsMap>;
  previewProps?: PropsMap;
  getPreviewProps?: () => PropsMap;
};

type Props = {
  moduleLoader: () => Promise<ReactModuleShape>;
  rawLoader?: () => Promise<string>;
};

export default function ReactRunner({ moduleLoader }: Props) {
  const [view, setView] = useState<ReactElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mod = await moduleLoader();
        if (cancelled) return;

        const Comp = mod.Preview ?? mod.default;
        if (!Comp) {
          setView(<div>В модуле нет React-компонента (нет export default / Preview).</div>);
          return;
        }

        const props =
          (typeof mod.getPreviewProps === "function" ? mod.getPreviewProps() : undefined) ??
          mod.previewProps ??
          {};

        setView(<div>{createElement(Comp, props)}</div>);
      } catch (err) {
        console.error("ReactRunner: load failed", err);
        setView(<div>Ошибка загрузки React-компонента.</div>);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [moduleLoader]);

  return view ?? <span className="muted">Загрузка…</span>;
}
