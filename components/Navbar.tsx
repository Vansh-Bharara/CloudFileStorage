"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ user }: { user: any }) {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
                <Link href="/">
                    <h1 className="text-xl font-bold text-gray-800">
                        ☁ Cloud File Manager
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                    {user?.image && (
                        <Image
                            src={user.image}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="rounded-full border"
                        />
                    )}
                    <span className="text-gray-700">{user?.name}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
