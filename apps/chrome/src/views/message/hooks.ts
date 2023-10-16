import { useEffect, useRef, useState } from "react";

export const useMessageModal = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainerRef = containerRef.current;
    if (currentContainerRef) {
      containerRef.current.addEventListener("openMessageModal", (e) => {
        console.log("openMessageModal", e);
        setOpen(true);
      });

      containerRef.current.addEventListener("closeMessageModal", (e) => {
        console.log("closeMessageModal", e);
        setOpen(false);
      });
    }
    return () => {
      if (currentContainerRef) {
        currentContainerRef.removeEventListener("openMessageModal", (e) => {
          console.log("openMessageModal", e);
          setOpen(true);
        });

        currentContainerRef.removeEventListener("closeMessageModal", (e) => {
          console.log("closeMessageModal", e);
          setOpen(false);
        });
      }
    };
  }, []);

  return { containerRef, open, setOpen };
};
