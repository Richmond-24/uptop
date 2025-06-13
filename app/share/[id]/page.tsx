'use client';

import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { useParams } from 'next/navigation';
import { FaFile, FaFolder, FaDownload } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  content: ArrayBuffer;
  isFolder?: boolean;
  parentId?: string | null;
  shareId?: string;
}

const DB_NAME = 'driveDB';
const FILE_STORE = 'files';

async function initDB() {
  return openDB(DB_NAME, 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE, { keyPath: 'id' });
      }
    },
  });
}

const SharedFilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<FileData | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const db = await initDB();
      const all = await db.getAll(FILE_STORE);
      const sharedFile = all.find((f) => f.shareId === id);
      if (sharedFile) {
        setFile(sharedFile);
      } else {
        toast.error('Shared file not found.');
      }
    };
    fetchFile();
  }, [id]);

  const handleOpenOrDownload = () => {
    if (!file) return;
    const blob = new Blob([file.content], { type: file.type });
    const url = URL.createObjectURL(blob);

    if (file.isFolder) {
      toast('Folder preview not supported yet.');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Shared File</h1>

        {file ? (
          <>
            <div className="text-5xl mb-4 text-blue-600">
              {file.isFolder ? <FaFolder /> : <FaFile />}
            </div>
            <p className="text-xl font-semibold">{file.name}</p>
            <p className="text-gray-500 text-sm mb-2">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            <button
              onClick={handleOpenOrDownload}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaDownload /> {file.isFolder ? 'View Folder' : 'Download File'}
            </button>
          </>
        ) : (
          <p className="text-gray-500">Loading shared file...</p>
        )}
      </div>
    </div>
  );
};

export default SharedFilePage;
