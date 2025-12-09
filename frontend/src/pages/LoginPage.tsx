import { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, sendVerificationCode } from "@/api/auth";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/ToastProvider";
import { Smartphone, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useUserStore((state) => state.setSession);
  const { showToast } = useToast();

  const handleSendCode = async () => {
    if (!phone.trim()) {
      setError("Please enter your phone number first");
      return;
    }

    setSendingCode(true);
    setError(null);
    try {
      await sendVerificationCode(phone.trim());
      showToast("Code sent!");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send code";
      setError(message);
      showToast(message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim() || !code.trim()) {
      setError("Phone and code are required");
      return;
    }

    setSubmitting(true);
    try {
      const { token, user } = await login({ phone: phone.trim(), code: code.trim() });
      setSession(user, token);

      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
      showToast("Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background px-6 pt-20 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <div className="mb-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Smartphone className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Let's get you <br />
            <span className="text-primary">started</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your mobile number to sign in or create a new account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 pl-12 text-lg outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                placeholder="+49 151 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Smartphone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Verification Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Verification Code</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 pl-12 text-lg outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0}
                className={clsx(
                  "flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-2xl border font-medium transition-all active:scale-95",
                  countdown > 0 
                    ? "border-zinc-200 bg-zinc-100 text-muted-foreground"
                    : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                )}
              >
                {sendingCode ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "Get Code"
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600"
            >
              {error}
            </motion.p>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:translate-y-[-2px] hover:shadow-xl active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? (
                 <>
                   <Loader2 className="h-5 w-5 animate-spin" />
                   Signing in...
                 </>
              ) : (
                 <>
                   Sign In
                   <ArrowRight className="h-5 w-5" />
                 </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default LoginPage;