// src/components/Upload.jsx
import React, { useRef } from "react";

export default function Upload({ onUpload }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">📤 Upload Portfolio CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-700"
      />
    </div>
  );
}
