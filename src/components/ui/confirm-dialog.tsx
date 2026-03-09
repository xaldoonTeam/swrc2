import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    // Parent closes via state; only close on cancel
  };

  const accentClasses = {
    danger: "bg-red-500/20 text-red-400 ring-red-500/30",
    warning: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
    info: "bg-blue-500/20 text-blue-400 ring-blue-500/30",
  };

  const buttonClasses = {
    danger: "bg-red-500 hover:bg-red-600 focus:ring-red-500/50",
    warning: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/50",
    info: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/50",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
        onClick={loading ? undefined : onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="relative w-full max-w-sm rounded border border-slate-600/50 bg-[#252945] p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded ring-4 ring-offset-2 ring-offset-[#1e2139] ${accentClasses[variant]}`}
          >
            <AlertTriangle className="h-7 w-7" strokeWidth={2} />
          </div>
          <div className="space-y-1 text-center">
            <h2 id="confirm-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p id="confirm-message" className="text-sm text-slate-400">
              {message}
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700/50 hover:text-white disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 rounded px-4 py-2.5 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e2139] disabled:opacity-50 ${buttonClasses[variant]}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting…
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
