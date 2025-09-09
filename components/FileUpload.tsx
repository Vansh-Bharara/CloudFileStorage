// components/FileUpload.tsx
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

export default function FileUpload({ onUploaded }: { onUploaded?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1) ask server for presigned URL
      const presignRes = await fetch("/api/files/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Failed to get presigned URL");
      const { url, key } = await presignRes.json();

      // 2) upload to S3 using XHR to track progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);

        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const metaRes = await fetch("/api/files/metadata", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: file.name,
                s3Key: key,
                size: file.size,
                mimeType: file.type,
              }),
            });
            if (!metaRes.ok) {
              reject(new Error("Failed to record metadata"));
              return;
            }
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload error"));
        xhr.send(file);
      });

      setProgress(100);
      if (onUploaded) onUploaded();
      setUploaded(true);
      toast("File uploaded successfully !")
    } catch (err: any) {
      alert("Upload error: " + (err?.message || err));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg mx-auto">
      <label className="block mb-2 font-medium text-gray-700">Upload file</label>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFile}
        className="hidden"
      />

      {/* Button to trigger file input */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mb-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      >
        📂 Choose File
      </button>

      {uploading && (
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
          <div
            className="h-3 rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploaded && (
        <div className="mt-4 w-full rounded-md bg-green-600 px-4 py-3">
          <p className="text-sm font-medium text-white">
            ✅ File uploaded successfully!
          </p>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-500">
        Max file size depends on your S3 limits.
      </p>
    </div>
  );
}
