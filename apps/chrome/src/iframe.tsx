import { CSSProperties, useEffect, useRef } from "react";
import { ShadowRootEventHandler } from "./services/shadowRootEventHandler";
import { RxDragHandleHorizontal } from "react-icons/rx";
import Draggable from "react-draggable";
const IFRAME_URL = import.meta.env.VITE_IFRAME_URL ?? "http://localhost:3000";

const iframeStyled = {
  width: "400px",
  minHeight: "600px",
  display: "flex",
  flexDirection: "column" as CSSProperties["flexDirection"],
  zIndex: "9999",
};

type IframeProps = {
  messenger: ShadowRootEventHandler;
};
export const Iframe = (props: IframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    props.messenger.attachIframe(iframeRef.current);
  }, [props.messenger]);

  return (
    <Draggable>
      <div
        style={{
          ...iframeStyled,
          position: "fixed" as CSSProperties["position"],
          top: "100px",
          right: "50px",
          borderRadius: "10px 10px 0 0",
        }}
        id="linkedInPlus-iframe"
      >
        <div
          className="h-[30px] w-full"
          style={{
            borderRadius: "10px 10px 0 0",
            background: "#27272a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RxDragHandleHorizontal
            style={{ color: "#52525b", fontSize: "30px", marginLeft: 4 }}
          />
        </div>
        <iframe
          ref={iframeRef}
          src={IFRAME_URL}
          style={{ ...iframeStyled, borderRadius: "0 0 10px 10px" }}
          id="linkedInPlus-iframe"
        />
      </div>
    </Draggable>
  );
};
