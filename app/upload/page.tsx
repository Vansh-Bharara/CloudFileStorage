import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../../lib/auth";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import DragDropZone from "@/components/DragDropZone";

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Header */}
      <Navbar user={session.user}/>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-all duration-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload File</h1>
            <p className="text-gray-600">Choose a file to upload to your cloud storage.</p>
          </div>
          
          <FileUpload />
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Drag and Drop Zone</h1>
            <p className="text-gray-600">Choose a file to upload to your cloud storage.</p>
          </div>
          <DragDropZone/>
        </div>
      </div>
    </main>
  );
}
