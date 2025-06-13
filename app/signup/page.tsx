
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase'
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { z } from 'zod'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(pwd => !/password/i.test(pwd), {
      message: 'Password should not contain the word "password"',
    }),
})

export default function SignUpPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    }

    const validation = signUpSchema.safeParse(trimmed)
    if (!validation.success) {
      toast.error(validation.error.errors[0].message)
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, trimmed.email, trimmed.password)

      toast.success(`🎉 Welcome, ${trimmed.name}!`)
      setFormData({ name: '', email: '', password: '' })
      setTimeout(() => router.push('/homepage'), 2000)
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please sign in.')
      } else {
        toast.error(error.message)
      }
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
          <h1 className="text-3xl font-bold text-pink-600">Create Account</h1>
          <p className="text-gray-500 text-sm">Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <UserIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex flex-col space-y-2 pt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-[#4285F4] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#357ae8] transition"
          >
            {googleLoading ? 'Loading...' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/signin" className="text-pink-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
