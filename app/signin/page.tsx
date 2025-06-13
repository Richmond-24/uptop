
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase'
import {
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password.trim())
      toast.success('Signed in successfully!')
      setTimeout(() => router.push('/homepage'), 1500)
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google!')
      router.push('/homepage')
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-600">Sign In</h1>
          <p className="text-gray-500 text-sm">Welcome back! Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <EnvelopeIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2.5 rounded-xl font-semibold transition duration-200 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex flex-col space-y-2 pt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white border border-gray-300 rounded-xl py-2 text-sm font-medium hover:bg-gray-100"
          >
            {googleLoading ? 'Loading...' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-pink-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
