
'use client';

import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';
import {
  FaFolder,
  FaFile,
  FaChevronRight,
  FaUpload,
  FaWhatsapp,
  FaLink
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { uploadToCloudinary } from '@/lib/Cloudinary';

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

export default function SharedFilesPage() {
  const [sharedItems, setSharedItems] = useState<FileData[]>([]);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [fileToShare, setFileToShare] = useState<FileData | null>(null);

  useEffect(() => {
    fetchSharedItems();
  }, [currentFolderId]);

  const fetchSharedItems = async () => {
    const db = await initDB();
    const all = await db.getAll(FILE_STORE);
    const filtered = all.filter((f) => f.shareId && f.parentId === currentFolderId);
    setSharedItems(filtered);
  };

  const openFile = (file: FileData) => {
    if (file.isFolder) {
      setCurrentFolderId(file.id);
      setFolderPath((prev) => [...prev, { id: file.id, name: file.name }]);
    } else {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleBreadcrumbClick = (id: string | null, index: number) => {
    setCurrentFolderId(id);
    setFolderPath((prev) => prev.slice(0, index + 1));
  };

  const generateShareLink = async (file: FileData): Promise<string> => {
    try {
      const blob = new Blob([file.content], { type: file.type });
      const fileUrl = await uploadToCloudinary(blob, file.name);

      if (!fileUrl) {
        console.error('Cloudinary returned empty URL for', file.name);
        toast.error('Cloudinary upload returned no URL.');
        return '';
      }

      setFileToShare({ ...file, sharedAt: new Date().toISOString() });
      return fileUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message || err}`);
      return '';
    }
  };

  const handleCopyLink = async (file: FileData) => {
    const link = await generateShareLink(file);
    if (!link) return;

    await navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleShareWhatsApp = async (file: FileData) => {
    const link = await generateShareLink(file);
    if (!link) return;

    const message = `📁 I've shared a file with you: ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImportSharedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed: FileData[] = JSON.parse(text);

      const db = await initDB();
      const tx = db.transaction(FILE_STORE, 'readwrite');
      const store = tx.objectStore(FILE_STORE);

      for (const item of parsed) {
        item.sharedAt = new Date().toISOString();
        await store.put(item);
      }

      toast.success('Imported shared files successfully!');
      fetchSharedItems();
    } catch (err) {
      toast.error('Failed to import shared file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Shared Items</h1>
        </div>

        {folderPath.length > 0 && (
          <div className="text-sm text-blue-600 flex gap-2 items-center mb-4 flex-wrap">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => {
                setCurrentFolderId(null);
                setFolderPath([]);
              }}
            >
              Shared
            </span>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <FaChevronRight className="text-gray-400 text-xs" />
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => handleBreadcrumbClick(folder.id, index)}
                >
                  {folder.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {sharedItems.length === 0 ? (
          <p className="text-gray-500">No shared items found.</p>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sharedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition-all duration-200"
              >
                <div
                  className="text-center text-4xl text-blue-600 mb-2 cursor-pointer"
                  onClick={() => openFile(item)}
                >
                  {item.isFolder ? <FaFolder /> : <FaFile />}
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{(item.size / 1024).toFixed(2)} KB</p>
                <p className="text-xs text-green-600 mt-1">
                  Shared: {new Date(item.sharedAt || '').toLocaleString()}
                </p>
                <div className="flex flex-col mt-2 space-y-1">
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="w-full flex items-center justify-center gap-2 text-white bg-gray-700 hover:bg-gray-800 text-xs py-1.5 rounded"
                  >
                    <FaLink />
                    Copy
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(item)}
                    className="w-full flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 text-xs py-1.5 rounded"
                  >
                    <FaWhatsapp />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
