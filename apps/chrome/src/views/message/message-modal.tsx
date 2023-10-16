import { CSSProperties } from "react";
import { MESSAGE_URL } from "../../consts";
import { useMessageModal } from "./hooks";

const generateStyles = (open: boolean) =>
  open
    ? {
        display: "flex",
        position: "fixed" as CSSProperties["position"],
        top: "100",
        left: "50%",
        zIndex: 9999,
        transform: "translateX(-50%)",
      }
    : {
        display: "none",
      };

export const MessageModal = () => {
  const { containerRef, open } = useMessageModal();

  return (
    <div
      style={generateStyles(open)}
      ref={containerRef}
      className="w-[500px] h-[600px] flex flex-col items-center justify-center rounded-lg"
    >
      <iframe
        src={MESSAGE_URL}
        className="w-full h-full rounded-lg"
        style={{ border: 0 }}
      />
    </div>
  );
};
