import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "../../lib/auth";
import Navbar from "@/components/Navbar";
import FileList from "@/components/FileList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Header */}
      <Navbar user={session.user} />
      <header className="bg-white/70 backdrop-blur-md border-none sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-all duration-200"
            >
              ← Go Back
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-gray-100">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User profile"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome, {session.user?.name} 👋
            </h2>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Files</h3>
            <Link
              href="/upload"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200">
              Upload File
            </Link>
          </div>
          <FileList />
        </div>
      </div>
    </main>
  );
}
