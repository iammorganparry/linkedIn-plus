import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const IsolateCSS = (props: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onceRef = useRef(false);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();

  useEffect(() => {
    const container = containerRef.current;
    if (container && !onceRef.current) {
      onceRef.current = true;
      const shadow = container.attachShadow({ mode: "open" });
      setShadowRoot(shadow);
    }
  }, []);

  return (
    <div ref={containerRef}>
      {shadowRoot && createPortal(props.children, shadowRoot)}
    </div>
  );
};
