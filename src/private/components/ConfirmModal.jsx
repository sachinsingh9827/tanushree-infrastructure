export default function ConfirmModal({
  cancelText = "Cancel",
  confirmText = "OK",
  message,
  onCancel,
  onConfirm,
  open,
  title = "Are you sure?"
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 px-4">
      <section className="w-full max-w-sm rounded-custom bg-white p-5 text-slate-950 shadow-xl dark:bg-slate-950 dark:text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        {message ? <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p> : null}
        <div className="mt-5 flex justify-end gap-3">
          <button
            className="rounded-custom border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="rounded-custom bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
