
'use client';

import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { motion } from 'framer-motion';
import { FaFile, FaFolder, FaShareAlt, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

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
  return openDB(DB_NAME, DB_VERSION);
}

const RecentPage = () => {
  const [recentFiles, setRecentFiles] = useState<FileData[]>([]);

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    const db = await initDB();
    const all = await db.getAll(FILE_STORE);
    const sorted = all
      .filter((f) => !f.parentId) // optional: filter for root files only
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setRecentFiles(sorted.slice(0, 30));
  };

  const handleOpen = (file: FileData) => {
    if (file.isFolder) {
      toast("You can't open folders from Recent. Use My Drive");
      return;
    }
    const blob = new Blob([file.content], { type: file.type });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const handleShare = async (file: FileData) => {
    const db = await initDB();
    const shareId = file.shareId || crypto.randomUUID();
    const updated = { ...file, shareId };
    await db.put(FILE_STORE, updated);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success(`Link copied for "${file.name}"`);
  };

  const handleDelete = async (id: string) => {
    const db = await initDB();
    const file = await db.get(FILE_STORE, id);
    if (!file) return;
    await db.delete(FILE_STORE, id);
    toast.success(`Deleted "${file.name}"`);
    loadRecentFiles();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Files</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentFiles.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleOpen(file)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2 text-blue-600">
                {file.isFolder ? <FaFolder /> : <FaFile />}
              </div>
              <p className="font-medium text-gray-800 truncate w-full">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <span
                className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                  file.isFolder ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {file.isFolder ? 'Folder' : file.type.split('/')[1]?.toUpperCase() || 'File'}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(file);
                }}
                className="text-green-500 hover:text-green-700"
              >
                <FaShareAlt />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {recentFiles.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No recent files or folders yet.
        </div>
      )}
    </div>
  );
};

export default RecentPage;
