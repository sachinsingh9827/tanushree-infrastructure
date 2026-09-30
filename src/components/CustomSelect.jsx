import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function normalizeOption(option) {
  if (typeof option === "string") return { label: option, value: option };
  return option;
}

export default function CustomSelect({
  className = "",
  disabled = false,
  name,
  onChange,
  options = [],
  placeholder = "Select",
  value
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options]);
  const selectedOption = normalizedOptions.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectOption(nextValue) {
    onChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      {name ? <input name={name} type="hidden" value={value ?? ""} /> : null}

      <button
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-900 outline-none transition
          hover:border-primary/30 hover:bg-white focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10
          disabled:cursor-not-allowed disabled:opacity-60
          dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-secondary/40 dark:focus:border-secondary/50 dark:focus:ring-secondary/10 ${
            open ? "border-primary/40 bg-white ring-2 ring-primary/10 dark:border-secondary/50 dark:bg-slate-900 dark:ring-secondary/10" : ""
          }`}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={selectedOption ? "" : "text-slate-400"}>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} size={18} />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-custom border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-950">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                className={`flex w-full items-center justify-between gap-3 rounded-custom px-3 py-2 text-left text-sm font-medium transition ${
                  isSelected
                    ? "bg-primary text-white dark:bg-secondary dark:text-primary"
                    : "text-slate-700 hover:bg-header hover:text-primary dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-secondary"
                }`}
                key={option.value}
                onClick={() => selectOption(option.value)}
                type="button"
              >
                <span>{option.label}</span>
                {isSelected ? <Check size={16} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
