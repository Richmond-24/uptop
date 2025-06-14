
'use client';

import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { useParams } from 'next/navigation';

const DB_NAME = 'driveDB';
const DB_VERSION = 3;
const FILE_STORE = 'files';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  content: ArrayBuffer;
  isFolder?: boolean;
  parentId?: string | null;
  shareId?: string;
  sharedAt?: string;
  webkitRelativePath?: string;
  createdAt?: number;
}

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE, { keyPath: 'id' });
      }
    },
  });
}

const SharePage = () => {
  const params = useParams();
  const { id } = params;
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    const fetchSharedFile = async () => {
      const db = await initDB();
      const allFiles = await db.getAll(FILE_STORE);
      const sharedFiles = allFiles.filter((f) => f.shareId === id);
      setFiles(sharedFiles);
    };

    fetchSharedFile();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4">Shared File</h1>
      {files.length === 0 ? (
        <p className="text-gray-500">No shared file found with this ID.</p>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <p className="text-lg font-semibold">{files[0].name}</p>
          <p className="text-sm text-gray-600">Size: {(files[0].size / 1024).toFixed(2)} KB</p>
          <p className="text-sm text-gray-600">Type: {files[0].type}</p>
        </div>
      )}
    </div>
  );
};

export default SharePage;
