import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const toastStyles = {
  error: "border-toast-error bg-red-50 text-red-800",
  info: "border-toast-info bg-amber-50 text-amber-900",
  success: "border-toast-success bg-green-50 text-green-800",
  warning: "border-toast-warning bg-yellow-50 text-yellow-800"
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "info" }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 gap-3">
        {toasts.map((toast) => (
          <div
            className={`pointer-events-auto animate-slide-fade-in rounded-custom border px-4 py-3 text-center text-sm font-medium shadow-lg ${
              toastStyles[toast.type] || toastStyles.info
            }`}
            key={toast.id}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
