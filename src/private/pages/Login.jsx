import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, setAdminToken } from "../services/authStorage.js";
import { useAdminLoginMutation } from "../../store/websiteApi.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const result = await adminLogin({
        email: formData.get("email"),
        password: formData.get("password")
      }).unwrap();

      const token = result?.data?.token;
      if (!token) {
        throw new Error("Login succeeded, but no access token was returned.");
      }

      setAdminToken(token);
      showToast({ message: "Login successful", type: "success" });
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      showToast({
        message: loginError?.data?.message || loginError.message || "Invalid email or password",
        type: "error"
      });
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto grid w-full max-w-sm gap-4 rounded-custom bg-white p-8 text-slate-950
          shadow-[0_10px_20px_rgba(0,0,0,0.35),0_30px_60px_-15px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.6)]
          ring-1 ring-black/5
          transition-all duration-300 will-change-transform
          hover:-translate-y-1.5
          hover:shadow-[0_16px_28px_rgba(0,0,0,0.4),0_40px_70px_-15px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-custom bg-gradient-to-b from-white/60 to-transparent" />

        <div className="relative">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-slate-950 to-slate-600 shadow-[0_2px_6px_rgba(15,23,42,0.5)]" />
        </div>

        <label className="relative grid gap-1 text-sm font-medium">
          Email
          <input
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
              outline-none transition
              focus:border-slate-950 focus:bg-white focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(15,23,42,0.15)]"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="relative grid gap-1 text-sm font-medium">
          Password
          <span
            className="flex rounded-xl border border-slate-200 bg-slate-50
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
              transition focus-within:border-slate-950 focus-within:bg-white
              focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(15,23,42,0.15)]"
          >
            <input
              className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2.5 outline-none"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              minLength="8"
              required
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="inline-flex w-12 items-center justify-center rounded-r-xl border-l border-slate-200 text-slate-600 hover:text-slate-950"
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <button
          className="group relative mt-2 overflow-hidden rounded-xl border-2 border-slate-950/80 px-4 py-3 font-semibold uppercase tracking-wide text-white
            bg-[linear-gradient(180deg,#475569_0%,#1e293b_55%,#0f172a_100%)]
            shadow-[0_6px_0_#020617,0_14px_24px_-6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]
            transition-all duration-150 ease-out
            hover:brightness-110
            active:translate-y-[5px] active:shadow-[0_1px_0_#020617,0_4px_10px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]
            disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-[0_6px_0_#020617]"
          disabled={isLoading}
          type="submit"
        >
          <span className="pointer-events-none absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-300/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <span className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-300/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-slate-300/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-slate-300/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />

          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(135deg,#fbbf24_0px,#fbbf24_8px,#0f172a_8px,#0f172a_16px)]
              -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
          />

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </span>
        </button>

        <button
          className="relative ml-auto inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-950"
          onClick={() => navigate("/")}
          type="button"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </form>
    </main>
  );
}
