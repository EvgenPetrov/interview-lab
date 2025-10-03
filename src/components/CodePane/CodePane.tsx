import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

type Props = {
  loader: () => Promise<string>; // импорт с { as: "raw" }
  language: "javascript" | "jsx" | "typescript" | "tsx";
  title?: string;
};

export default function CodePane({ loader, language, title }: Props) {
  const [src, setSrc] = useState("");
  const [copied, setCopied] = useState<null | "ok" | "err">(null);
  const codeRef = useRef<HTMLElement>(null);

  // грузим исходник (сырая строка)
  useEffect(() => {
    let cancel = false;
    loader().then((code) => {
      if (!cancel) setSrc(code);
    });
    return () => {
      cancel = true;
    };
  }, [loader]);

  // подсвечиваем
  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [src, language]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied("ok");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      setCopied("err");
    } finally {
      setTimeout(() => setCopied(null), 1200);
    }
  };

  return (
    <div className="codepane">
      <div className="codepane-head">
        <span className="codepane-title">{title ?? "Source"}</span>
        <button type="button" className="codepane-copy" onClick={copy}>
          {copied === "ok" ? "copied" : copied === "err" ? "error" : "copy"}
        </button>
      </div>

      <pre className={`codepane-pre line-numbers language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {src}
        </code>
      </pre>
    </div>
  );
}
