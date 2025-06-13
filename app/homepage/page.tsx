
'use client'

import { useState } from 'react'
import {
  Menu,
  X,
  Folder,
  FileText,
  Upload,
  Trash2,
  Home,
  User,
} from 'lucide-react'

import DrivePage from '../components/DrivePage'
import Trash from '../components/Trash'
import Recent from '../components/Recent'
import ProfilePage from '../components/ProfilePage'
import SharedPage from '../components/SharedPage'
import HomePage from '../components/HomePage'
const menuItems = [
  { name: 'Home', icon: Home, key: 'home' },
  { name: 'My Drive', icon: Folder, key: 'drive' },
  { name: 'Shared', icon: FileText, key: 'shared' },
  { name: 'Recent', icon: Upload, key: 'recent' },
  { name: 'Trash', icon: Trash2, key: 'trash' },
  { name: 'Profile', icon: User, key: 'profile' },
]

export default function SidebarLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeKey, setActiveKey] = useState('drive')

  const renderContent = () => {
    switch (activeKey) {
      case 'drive':
        return <DrivePage />
      case 'trash':
        return <Trash />
      case 'recent':
        return <Recent />
      case 'profile':
        return <ProfilePage />
      case 'shared':
        return <SharedPage />
      case 'home':
        return <HomePage />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Hamburger button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-full shadow-md text-gray-800"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r shadow-lg transition-transform duration-300
          transform md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:block
        `}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Logo + Title aligned */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/first.png" alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
            <h1 className="text-2xl font-bold text-pink-600">Uptop Drive</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveKey(item.key)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium text-left transition
                  ${activeKey === item.key ? 'bg-blue-100 text-pink-700' : 'text-gray-700 hover:bg-blue-50'}
                `}
              >
                <item.icon
                  className={`w-5 h-5 ${activeKey === item.key ? 'text-pink-600' : 'text-pink-500'}`}
                />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <footer className="text-xs text-gray-400 text-center mt-auto">
            © 2025 Uptop Drive
          </footer>
        </div>
      </aside>

      {/* Overlay for mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content always visible */}
      <main className="flex-1 overflow-auto bg-gray-100 p-6 z-10 relative">
        {renderContent()}
      </main>
    </div>
  )
}
