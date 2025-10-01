import { useEffect, useState, createElement, type ComponentType, type ReactElement } from "react";

type PropsMap = Record<string, unknown>;

// 👉 Единый тип для подгружаемых модулей
export type ReactModuleShape = {
  default?: ComponentType<PropsMap>;
  Preview?: ComponentType<PropsMap>;
  previewProps?: PropsMap;
  getPreviewProps?: () => PropsMap;
};

// 👉 Дополнительный тип для компонента с previewProps
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

        // подставляем previewProps, если они есть
        const props = Comp.previewProps ?? {};

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
