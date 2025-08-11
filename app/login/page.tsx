"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back</h1>
        <p className="text-gray-500 mb-8">
          Please sign in to continue to your dashboard.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.6-5.6C33.1 7.1 28.8 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.3-.1-2.5-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.1 16.1 18.7 13 24 13c3 0 5.7 1.1 7.8 3l5.6-5.6C33.1 7.1 28.8 5 24 5 16.5 5 9.8 9.5 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 43c5.3 0 9.6-1.7 12.8-4.6l-5.9-5.3c-1.7 1.1-3.9 1.9-6.9 1.9-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.8 38.5 16.5 43 24 43z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.1 4.3-3.9 5.9l.1.1 5.9 5.3C40.1 36.7 43 30.8 43 24c0-1.3-.1-2.5-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  );
}
