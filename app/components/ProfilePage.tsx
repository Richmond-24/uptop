
'use client'

import { useEffect, useState, useRef } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/CropImage'

const CLOUDINARY_UPLOAD_PRESET = 'profile_pictures'
const CLOUDINARY_CLOUD_NAME = 'dayhseodf'
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr)
      setDisplayName(usr?.displayName || '')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
      })
      reader.readAsDataURL(file)
    }
  }

  function onCropComplete(_: any, croppedAreaPixels: any) {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  async function uploadCroppedImage() {
    if (!croppedAreaPixels || !imageSrc || !user) return

    setUploading(true)
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([croppedImageBlob], 'profile.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.secure_url) {
        await updateProfile(user, { photoURL: data.secure_url })
        setUser({ ...user, photoURL: data.secure_url })
        toast.success('Profile photo updated!')
        setImageSrc(null)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error: any) {
      toast.error('Upload error: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleUpdateName() {
    if (!user || !displayName) return
    try {
      await updateProfile(user, { displayName })
      setUser({ ...user, displayName })
      setEditingName(false)
      toast.success('Display name updated!')
    } catch (error: any) {
      toast.error('Failed to update name: ' + error.message)
    }
  }

  if (loading) return <div className="text-center mt-8">Loading profile...</div>
  if (!user) return <div className="text-center mt-8">Please sign in to view your profile.</div>

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-2xl shadow-lg space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">User Profile</h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.photoURL || '/default-profile.png'}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-400 shadow-sm"
          />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            {editingName ? (
              <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border p-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={handleUpdateName}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-xl font-semibold text-gray-800">{user.displayName || 'User'}</p>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-sm text-indigo-600 underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-500 break-words">{user.email}</p>
              </div>
            )}

            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p><strong>UID:</strong> <span className="break-all">{user.uid}</span></p>
              <p><strong>Last Login:</strong> {new Date(user.metadata.lastSignInTime || '').toLocaleString()}</p>
              <p><strong>Joined:</strong> {new Date(user.metadata.creationTime || '').toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <label
            htmlFor="upload-photo"
            className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
          >
            Upload New Photo
          </label>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
            ref={inputFileRef}
          />
        </div>

        {imageSrc && (
          <div className="relative w-full h-72 sm:h-[400px] bg-gray-100 rounded-xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setImageSrc(null)}
                disabled={uploading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={uploadCroppedImage}
                disabled={uploading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {uploading ? 'Uploading...' : 'Save Image'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
