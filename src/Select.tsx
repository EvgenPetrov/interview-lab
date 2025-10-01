import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
};

export default function Select({
  value,
  onChange,
  options,
  className,
  placeholder = "Выбрать",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрываем по клику вне
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`select2 ${open ? "open" : ""} ${className ?? ""}`}>
      <button
        type="button"
        className="select2-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}>
        <span className="select2-label">{current?.label ?? placeholder}</span>
        <span className="select2-caret" aria-hidden />
      </button>

      {open && (
        <ul className="select2-menu" role="listbox">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                className={`select2-option${o.value === value ? " selected" : ""}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
