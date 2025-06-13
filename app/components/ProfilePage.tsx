
'use client'

import { useEffect, useState, useRef } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/CropImage'

const CLOUDINARY_UPLOAD_PRESET = 'profile_pictures'
const CLOUDINARY_CLOUD_NAME = 'dayhseodf' // Replace with your actual Cloudinary cloud name
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">User Profile</h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.photoURL || '/default-profile.png'}
            alt="Profile Photo"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-sm"
          />
          <div className="text-center sm:text-left">
            {editingName ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
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
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <p className="text-xl font-medium text-gray-800">{user.displayName || 'User'}</p>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-sm text-indigo-600 underline"
                >
                  Edit Name
                </button>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
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
          <div className="relative w-full h-72 bg-gray-100 rounded-xl overflow-hidden">
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
