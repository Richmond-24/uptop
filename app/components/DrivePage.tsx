
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster, Toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FaTrash,
  FaUpload,
  FaFolder,
  FaFile,
  FaShareAlt,
  FaSearch,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaUndo,
} from 'react-icons/fa';

const DB_NAME = 'driveDB';
const DB_VERSION = 3;
const FILE_STORE = 'files';
const TRASH_STORE = 'trash';
const STORAGE_LIMIT = 100 * 1024 * 1024; // 100 MB

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
  createdAt?: number; // Add this field
}


async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TRASH_STORE)) {
        db.createObjectStore(TRASH_STORE, { keyPath: 'id' });
      }
    },
  });
}

// -- Custom Toast Component --
const CustomToast = ({
  t,
  message,
  type = 'success',
  onUndo,
}: {
  t: Toast;
  message: string;
  type?: 'success' | 'error';
  onUndo?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 mb-2 ${
      type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
    }`}
  >
    <div className="flex items-center gap-3 w-full">
      <div className={`text-xl ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
      </div>
      <div className="flex-1 text-sm text-gray-800">{message}</div>
      {onUndo && (
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onUndo();
          }}
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          <FaUndo /> Undo
        </button>
      )}
    </div>
  </motion.div>
);

const DrivePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [search, setSearch] = useState('');
  const [usedStorage, setUsedStorage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: 'My Drive' },
  ]);

  useEffect(() => {
    loadFiles();
  }, [currentFolder]);

  const loadFiles = async () => {
    const db = await initDB();
    const all = await db.getAll(FILE_STORE);
    const filtered = all.filter((f) => f.parentId === currentFolder);
    setFiles(filtered);
    calculateStorage(all);
  };

  const calculateStorage = (all: FileData[]) => {
    const used = all.reduce((sum, f) => sum + f.size, 0);
    setUsedStorage(used);
  };

  // — Create Folder —
  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const db = await initDB();
    const id = uuidv4();
    const folder: FileData = {
      id,
      name,
      size: 0,
      type: 'folder',
      content: new ArrayBuffer(0),
      isFolder: true,
      parentId: currentFolder,
    };
    await db.put(FILE_STORE, folder);

    toast.custom((t) => (
      <CustomToast t={t} message={`Folder "${name}" created!`} />
    ));
    loadFiles();
  };

  // — Upload Files/Folders —
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const db = await initDB();
    const items = Array.from(e.target.files || []);
    let count = 0;

    for (const file of items) {
      const id = uuidv4();
      const fileData: FileData = {
  id,
  name: file.name,
  size: file.size,
  type: file.type,
  content: await file.arrayBuffer(),
  isFolder: !!file.webkitRelativePath && file.webkitRelativePath.includes('/'),
  webkitRelativePath: file.webkitRelativePath || '',
  parentId: currentFolder,
  createdAt: Date.now(), 
};

      await db.put(FILE_STORE, fileData);
      count++;
    }

    toast.custom((t) => (
      <CustomToast t={t} message={`${count} item(s) uploaded!`} />
    ));
    loadFiles();
  };

  // — Delete with Undo —
  const handleDelete = async (id: string) => {
    const db = await initDB();
    const file = await db.get(FILE_STORE, id);
    if (!file) return;

    await db.delete(FILE_STORE, id);
    await db.put(TRASH_STORE, file);
    loadFiles();

    toast.custom((t) => (
      <CustomToast
        t={t}
        message={`"${file.name}" moved to trash`}
        onUndo={async () => {
          await db.delete(TRASH_STORE, id);
          await db.put(FILE_STORE, file);
          loadFiles();
          toast.success('Undo successful!');
        }}
      />
    ));
  };

  // — Bulk Delete —
  const handleDeleteSelected = async () => {
    const db = await initDB();
    for (const id of selected) {
      const file = await db.get(FILE_STORE, id);
      if (file) {
        await db.delete(FILE_STORE, id);
        await db.put(TRASH_STORE, file);
      }
    }
    setSelected(new Set());
    loadFiles();
    toast.success('Selected items deleted');
  };

  // — Select on Right-click —
  const handleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // — Share via Link —
  const handleShare = async (file: FileData) => {
    const db = await initDB();
    const shareId = file.shareId || uuidv4();
    const updated = { ...file, shareId };
    await db.put(FILE_STORE, updated);

    const shareUrl = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(shareUrl);

    toast.custom((t) => (
      <CustomToast t={t} message={`Link copied for "${file.name}"`} />
    ));
  };

  // — Open file or navigate into folder —
  const handleOpen = (file: FileData) => {
    if (file.isFolder) {
      setCurrentFolder(file.id);
      setFolderPath((p) => [...p, { id: file.id, name: file.name }]);
    } else {
      const blob = new Blob([file.content], { type: file.type });
      window.open(URL.createObjectURL(blob), '_blank');
    }
  };

  // — Breadcrumb navigation —
  const handleBreadcrumbClick = (id: string | null, idx: number) => {
    setCurrentFolder(id);
    setFolderPath((p) => p.slice(0, idx + 1));
  };

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toaster */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/first.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-pink-800">My Drive</h1>
        </div>

        <div className="flex w-full md:w-1/3 items-center border rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <FaUpload /> File
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <FaFolder /> Upload Folder
          </button>
          <button
            onClick={handleCreateFolder}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <FaPlus /> New Folder
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleUpload}
            multiple
            className="hidden"
            //@ts-ignore
            webkitdirectory=""
            directory=""
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="p-4 text-sm flex items-center flex-wrap gap-1">
        {folderPath.map((f, i) => (
          <span key={f.id ?? 'root'} className="flex items-center gap-1">
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => handleBreadcrumbClick(f.id, i)}
            >
              {f.name}
            </span>
            {i < folderPath.length - 1 && (
              <FaChevronRight className="text-gray-400 text-xs" />
            )}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Storage Bar */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-1">
            Storage Used:{' '}
            {(usedStorage / (1024 * 1024)).toFixed(2)} MB /{' '}
            {(STORAGE_LIMIT / (1024 * 1024)).toFixed(2)} MB
          </p>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${(usedStorage / STORAGE_LIMIT) * 100}%` }}
            />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mb-4">
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Delete Selected ({selected.size})
            </button>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Files</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`bg-white p-4 rounded-xl shadow-md transition-all duration-300 border cursor-pointer ${
                selected.has(file.id) ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => handleOpen(file)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleSelect(file.id);
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl text-blue-500 mb-2">
                  {file.isFolder ? <FaFolder /> : <FaFile />}
                </div>
                <p className="font-medium text-gray-800 truncate w-full">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <span
                  className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    file.isFolder
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {file.isFolder
                    ? 'Folder'
                    : file.type.split('/')[1]?.toUpperCase() || 'File'}
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
      </div>
    </div>
  );
};

export default DrivePage;
