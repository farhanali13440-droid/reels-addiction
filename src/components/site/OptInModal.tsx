import { useEffect } from "react";
import { X } from "lucide-react";
import { OptInForm } from "./OptInForm";

/** Step-1 form in a popup, opened by the CTA buttons on the short-form page. */
export function OptInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Get the Reels Addiction Reset"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink/60 hover:bg-ink/10"
        >
          <X className="h-5 w-5" />
        </button>
        <OptInForm id="get-reset-modal" />
      </div>
    </div>
  );
}
