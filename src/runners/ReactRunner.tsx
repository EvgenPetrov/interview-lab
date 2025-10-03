import { useEffect, useState, createElement, type ComponentType, type ReactElement } from "react";

type PropsMap = Record<string, unknown>;

// 👉 Единый тип для подгружаемых модулей
export type ReactModuleShape = {
  default?: ComponentType<PropsMap>;
  Preview?: ComponentType<PropsMap>;
  previewProps?: PropsMap;
  getPreviewProps?: () => PropsMap;
};

// 👉 Дополнительный тип для компонента со статическим previewProps
type PreviewableComponent = ComponentType<PropsMap> & {
  previewProps?: PropsMap;
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

        const Comp = (mod.Preview ?? mod.default) as PreviewableComponent | undefined;

        if (!Comp) {
          setView(<div>В модуле нет React-компонента (нет export default / Preview).</div>);
          return;
        }

        // порядок источников: getPreviewProps() -> previewProps из модуля -> статические previewProps у компонента
        const props =
          (typeof mod.getPreviewProps === "function" ? mod.getPreviewProps() : undefined) ??
          mod.previewProps ??
          Comp.previewProps ??
          {};

        setView(createElement(Comp, props));
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
