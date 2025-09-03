import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Wand2 } from "lucide-react";



const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2 overflow-hidden bg-base-200">
      {/* LEFT — Matte form column (open, no card) */}
      <div className="relative flex flex-col justify-center items-center px-6 py-12">
        {/* matte dot pattern + soft vignette only on the LEFT side */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(hsla(0,0%,50%,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, var(--fallback-b2, oklch(var(--b2))) 100%)",
          }}
        />

        {/* content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Brand / Heading */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center rounded-xl ring-1 ring-base-300 bg-base-100 size-12">
              <MessageSquare className="size-6 text-base-content/80" />
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-base text-base-content/60">Sign in to your account</p>
            <div className="mx-auto mt-4 h-px w-24 bg-base-300/80" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Email</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-5 text-base-content/40" />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content/20"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Password</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="size-5 text-base-content/40" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content/20"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content/80 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-base-content/60">
                <span>Use 8+ characters</span>
                <Link to="/forgot" className="link link-hover">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit (matte style; switch to btn-primary if you want brand-y CTA) */}
            <button
              type="submit"
              className="btn w-full gap-2 border-base-300 bg-base-100 hover:bg-base-200"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-center text-sm text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link">
                Create account
              </Link>
            </p>
            
<div className="mt-3 flex justify-center">
  <button
    type="button"
    className="btn btn-ghost btn-sm rounded-full normal-case gap-2 border border-base-300 hover:bg-base-200 text-base-content/80"
    onClick={() => {
      setFormData({ email: "demo@gmail.com", password: "123456" });
      setShowPassword(true);
    }}
    title="Fill demo credentials"
  >
    <Wand2 className="size-4" />
    Use demo credentials
  </button>
</div>



          </form>
        </div>
      </div>

      {/* RIGHT — keep your animated AuthImagePattern exactly as it is */}
      <div className="relative">
        {/* subtle divider between columns */}
        <div className="hidden lg:block absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-base-300 to-transparent z-10" />
        <AuthImagePattern
          title="Welcome back!"
          subtitle="Sign in to continue your conversations and catch up with your messages."
        />
      </div>
    </div>
  );
};

export default LoginPage;
