
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/first.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-pink-600 tracking-wide">Uptop-Drive</h1>
          </div>
          <Link
            href="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow font-medium transition text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-12 pb-12 px-4">
        {/* Hero Section */}
        <section className="py-10 sm:py-20 text-center max-w-5xl mx-auto space-y-6 animate-fade-in-up">
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-gray-800">
            Your Personal Secure <span className="text-pink-600">Cloud Storage</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to <strong>Uptop-Drive</strong> — your private, encrypted drive in the cloud.
            Whether you're uploading important documents, managing creative projects, or sharing files with your team,
            everything stays secure, simple, and synced.
          </p>

          {/* Animated Info Cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-left px-6">
            {[
              {
                title: '✨ Blazing Fast Uploads',
                desc: 'Drag and drop files directly into your cloud — no waiting, no hassle.',
              },
              {
                title: '🔐 End-to-End Privacy',
                desc: 'We never track or store your personal data. You stay in control.',
              },
              {
                title: '📂 Smart Organization',
                desc: 'Create folders, use breadcrumbs, and never lose a file again.',
              },
              {
                title: '🔗 Share in Seconds',
                desc: 'Instantly generate secure shareable links with one click.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow transition hover:scale-[1.03] duration-300 border border-gray-200"
              >
                <h4 className="font-semibold text-lg text-pink-600 mb-1">{card.title}</h4>
                <p className="text-sm text-gray-700">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base shadow-lg"
            >
              Get Started — It’s Free
            </Link>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center mt-10">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-fade-in">
              <img
                src="/okay.png"
                alt="Drive Preview"
                className="w-full max-w-xs sm:max-w-lg object-cover"
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

        {/* CTA Section */}
        <section className="py-16 px-6 bg-pink-100 text-center rounded-lg mx-auto max-w-3xl animate-fade-in-up shadow-md">
          <h4 className="text-3xl font-bold mb-4 text-pink-900">
            Ready to start managing your files?
          </h4>
          <p className="text-gray-700 mb-6">
            Sign in or sign up to upload, organize, and share your files securely.
          </p>
          <Link
            href="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-xl transition transform hover:scale-105"
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
