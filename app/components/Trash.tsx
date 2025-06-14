
'use client';

import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';
import toast, { Toaster } from 'react-hot-toast';
import { FaFile, FaFolder, FaTrashRestore, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DB_NAME = 'driveDB';
const DB_VERSION = 3;
const TRASH_STORE = 'trash';
const FILE_STORE = 'files';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  content: ArrayBuffer;
  isFolder?: boolean;
  parentId?: string | null;
  webkitRelativePath?: string;
}

async function initDB() {
  return openDB(DB_NAME, DB_VERSION);
}

const TrashPage = () => {
  const [trash, setTrash] = useState<FileData[]>([]);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    const db = await initDB();
    const all = await db.getAll(TRASH_STORE);
    setTrash(all);
  };

  const restoreFile = async (file: FileData) => {
    const db = await initDB();
    await db.delete(TRASH_STORE, file.id);
    await db.put(FILE_STORE, file);
    toast.success(`Restored "${file.name}"`);
    loadTrash();
  };

  const permanentlyDelete = async (id: string) => {
    const db = await initDB();
    await db.delete(TRASH_STORE, id);
    toast.success('Permanently deleted');
    loadTrash();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Trash</h1>

      {trash.length === 0 ? (
        <p className="text-gray-600">Trash is empty</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trash.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-xl shadow border"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl text-red-500 mb-2">
                  {file.isFolder ? <FaFolder /> : <FaFile />}
                </div>
                <p className="font-medium text-gray-800 truncate w-full">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
             <div className="flex justify-between mt-4 gap-2 flex-wrap text-xs sm:text-sm">
  <button
    onClick={() => restoreFile(file)}
    className="flex-1 flex items-center justify-center gap-1 text-green-600 hover:text-green-800 px-2 py-1 rounded"
  >
    <FaTrashRestore className="text-sm" /> Restore
  </button>
  <button
    onClick={() => permanentlyDelete(file.id)}
    className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-800 px-2 py-1 rounded"
  >
    <FaTimesCircle className="text-sm" /> Delete
  </button>
</div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;

