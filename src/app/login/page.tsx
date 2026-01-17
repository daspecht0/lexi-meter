"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 relative z-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-black bg-gradient-to-r from-goodles-pink via-goodles-yellow to-goodles-orange bg-clip-text text-transparent">
              LEXI METER
            </h1>
          </Link>
          <p className="text-white/60 mt-2">Lexi&apos;s Control Panel</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 rounded-2xl p-8 border border-white/20 space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-center text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lexi@example.com"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/40 border border-white/20 focus:border-goodles-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/40 border border-white/20 focus:border-goodles-pink focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-goodles-pink to-goodles-orange hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          <Link href="/" className="hover:text-white/60 transition-colors">
            Back to Meter
          </Link>
        </p>
      </div>
    </main>
  );
}
