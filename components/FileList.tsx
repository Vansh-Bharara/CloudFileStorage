"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: string;
  filename: string;
  s3Key: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchFiles() {
    setLoading(true);
    const res = await fetch("/api/files/list");
    console.log(res)
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    } else {
      console.error("Failed to fetch files");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function handleDownload(id: string) {
    const res = await fetch(`/api/files/download/${id}`);
    if (!res.ok) {
      alert("Failed to get download URL");
      return;
    }
    const { url } = await res.json();
    // open in new tab (download)
    window.open(url, "_blank");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    const res = await fetch(`/api/files/delete/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFiles(f => f.filter(x => x.id !== id));
    } else {
      alert("Failed to delete");
    }
  }

  if (loading) return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 p-6 text-gray-600">
      Loading files...
    </div>
  );

  if (!files.length) return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 p-6 text-gray-500">
      No files yet.
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {files.map((f) => (
          <div key={f.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 transition">
            <div className="col-span-6">
              <div className="font-medium text-gray-800 truncate" title={f.filename}>{f.filename}</div>
              <div className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleString()}</div>
            </div>
            <div className="col-span-3 text-sm text-gray-500 truncate" title={f.mimeType}>{f.mimeType}</div>
            <div className="col-span-3 flex items-center justify-end gap-2">
              <button onClick={() => handleDownload(f.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
                Download
              </button>
              <button onClick={() => handleDelete(f.id)} className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
