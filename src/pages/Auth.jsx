import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const body =
        mode === "login"
          ? {
              email,
              password,
            }
          : {
              username,
              email,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      if (mode === "login") {
        localStorage.setItem("onespace-token", data.token);
        localStorage.setItem("onespace-user", JSON.stringify(data.user));

        navigate("/");
      } else {
        setMessage("Account created successfully. You can now log in.");

        setMode("login");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setMessage("");
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-purple-600 shadow-lg shadow-pink/30">
            <Globe className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-black bg-gradient-to-r from-pink to-purple-400 bg-clip-text text-transparent">
            OneSpace
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Welcome back to your space."
              : "Create your OneSpace account."}
          </p>
        </div>

        <div className="rounded-3xl border border-pink-dim bg-card p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-6">
            {isLogin ? "Log in" : "Create account"}
          </h2>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    className="w-full rounded-xl border border-pink-dim bg-background py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-pink"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-pink-dim bg-background py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-pink"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-pink-dim bg-background py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-pink"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink py-3 text-sm font-semibold text-white shadow-lg shadow-pink/20 transition-all hover:bg-pink/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Log in"
                : "Create account"}

              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={switchMode}
              className="mt-1 text-sm font-semibold text-pink hover:text-pink/80"
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}