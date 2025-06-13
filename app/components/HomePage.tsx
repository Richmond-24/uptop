
'use client';

import React from 'react';
import { FaCloudUploadAlt, FaFolderOpen, FaTrash, FaShareAlt, FaLock } from 'react-icons/fa';
import { MdStorage } from 'react-icons/md';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
                        <img src="/first.png" alt="Logo" className="w-10 h-10 rounded-full shadow-md" />

            <h1 className="text-2xl font-extrabold text-pink-600 tracking-wide">My Drive</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/signin"
              className="text-sm text-pink-600 hover:underline font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        {/* Hero */}
        <section className="py-20 text-center max-w-5xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Your Personal Secure <span className="text-pink-600">Cloud Storage</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Upload, manage, and share files effortlessly — your privacy, our priority.
          </p>
          <div className="flex justify-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src="/okay.png"
                alt="Drive Preview"
                className="w-full max-w-lg animate-fade-in object-cover"
              />
            </div>
          </div>
        </section>

        {/* Storage Info */}
        <section className="py-12 bg-gray-100 rounded-xl mx-auto max-w-3xl px-6 shadow-inner">
          <h3 className="text-2xl font-semibold mb-2 flex justify-center items-center gap-2">
            <MdStorage className="text-pink-600 text-3xl" />
            Storage Usage
          </h3>
          <p className="text-gray-600 mb-4 text-center">Track your file space usage</p>
          <div className="bg-gray-300 h-4 rounded-full overflow-hidden w-full mb-2">
            <div className="bg-pink-600 h-full" style={{ width: '45%' }} />
          </div>
          <p className="text-sm text-gray-700 text-center">45 MB used of 100 MB</p>
        </section>

        {/* Features */}
        <section className="py-20 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl text-pink-600 mb-4">{feat.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feat.title}</h4>
                <p className="text-sm text-gray-600">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 bg-pink-100 text-center rounded-lg mx-auto max-w-3xl animate-fade-in-up shadow-md">
          <h4 className="text-3xl font-bold mb-4 text-pink-900">
            Ready to start managing your files?
          </h4>
          <p className="text-gray-700 mb-6">
            Sign in or sign up to upload, organize, and share your files securely.
          </p>
          <Link
            href="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105"
          >
            Create Account
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500">
        &copy; {new Date().getFullYear()} My Drive — All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <FaCloudUploadAlt />,
    title: 'Easy Uploads',
    description: 'Drag & drop files and folders straight into your drive.',
  },
  {
    icon: <FaFolderOpen />,
    title: 'Organize Files',
    description: 'Use nested folders and breadcrumbs to keep things tidy.',
  },
  {
    icon: <FaTrash />,
    title: 'Trash Recovery',
    description: 'Restore deleted files from the trash anytime.',
  },
  {
    icon: <FaShareAlt />,
    title: 'File Sharing',
    description: 'Generate shareable links in one click.',
  },
  {
    icon: <FaLock />,
    title: 'Privacy First',
    description: 'All data stays local—your privacy, guaranteed.',
  },
  {
    icon: <MdStorage />,
    title: 'Real-Time Quota',
    description: 'Live progress bar showing your storage usage.',
  },
];
