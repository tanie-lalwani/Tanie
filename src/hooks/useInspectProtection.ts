import { useEffect } from "react";

export function useInspectProtection() {
  useEffect(() => {
    // Only apply protection in production builds or non-localhost environments
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return;
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c") ||
          e.key === "U" || e.key === "u")
      ) {
        e.preventDefault();
        return;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
