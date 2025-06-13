
'use client'

import { useState } from 'react'
import DrivePage from './DrivePage'

export default function DashboardLayout() {
  const [activeKey] = useState('drive') // default to "drive"

  return (
    <div className="flex h-screen">

      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {activeKey === 'drive' && <DrivePage />}
        {/* Add more views as needed */}
      </main>
    </div>
  )
}
