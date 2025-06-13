
'use client'

import { useState } from 'react'
import {
  Moon, Sun, Bell, User, Lock, Shield, Trash2
} from 'lucide-react'
import clsx from 'clsx'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Settings</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Settings */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5" /> Profile
          </h3>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5" /> Security
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
            <button className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
              Enable
            </button>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Change Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} Appearance
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={clsx(
                'px-3 py-1 text-sm rounded-lg transition',
                darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-900'
              )}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5" /> Privacy
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your data sharing preferences and control what information is visible.
          </p>
          <button className="mt-2 px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
            Manage Preferences
          </button>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 flex flex-col gap-4 border-t-2 border-red-600">
          <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Deleting your account is irreversible. All your data will be lost.
          </p>
          <button className="mt-2 px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white">
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  )
}
