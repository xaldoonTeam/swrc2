import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../Api/client";
import { Lock, Mail, Loader2, ArrowRight, Sparkles, Shield } from "lucide-react";

function LogoImage({ className, alt }: { className?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold ${className}`}>
        S
      </div>
    );
  }
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-[#1a1d2e] via-[#252945] to-[#1a1d2e]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <LogoImage alt="SWRC" className="h-12 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-2 text-amber-400/90 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Secure Admin Access</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight max-w-sm">
              Manage your content with confidence.
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-sm leading-relaxed">
              Sign in to update publications, stories, media, and settings for the SWRC platform.
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <Shield className="w-4 h-4 text-emerald-500/80" />
            <span>Your session is encrypted and secure.</span>
          </div>
        </div>
      </div>

      {/* Right: Login form — adorable panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-orange-50/50">
        {/* Soft decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange-200/20 blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-amber-100/30 blur-2xl" />

        <div className="w-full max-w-[450px] relative z-10">
          <div className="bg-white/95 backdrop-blur-md rounded shadow-2xl shadow-slate-300/25 border border-slate-200/70 overflow-hidden ring-1 ring-white/90">
            {/* Logo header */}
            <div className="pt-10 pb-6 px-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center overflow-hidden p-2">
                <LogoImage alt="SWRC" className="w-full h-full object-contain" />
              </div>
              <p className="text-slate-500 text-sm mt-3 font-medium">Content Manager</p>
            </div>

            <div className="px-8 pb-10">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
                <p className="text-slate-500 mt-1 text-sm">Sign in to your admin account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded border border-rose-100">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60 focus:bg-white transition-all text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60 focus:bg-white transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-400 text-xs mt-5">
                SWRC Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
