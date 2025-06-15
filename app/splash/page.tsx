
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import '@/lib/firebase';

const motivationalTexts = [
  "Believe in your dreams 🌟",
  "Building the future one file at a time 💡",
  "You are limitless 🚀",
  "Great things start here 🔥",
  "Your data, your power 💪",
];

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;

    // Allow audio playback only after user interacts
    const playAudio = () => {
      audioRef.current?.play().catch((err) => {
        console.warn("Audio autoplay blocked:", err);
      });
      document.removeEventListener('click', playAudio);
    };

    document.addEventListener('click', playAudio);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      // Update motivational text every 20%
      if (current % 20 === 0 && currentTextIndex < motivationalTexts.length - 1) {
        setCurrentTextIndex((prev) => prev + 1);
      }

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (isLoggedIn) {
            router.push('/allpage');
          } else {
            setShowSignup(true);
          }
        }, 1000);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', playAudio);
    };
  }, [isLoggedIn, router, currentTextIndex]);

  return (
    <>
      <audio ref={audioRef} src="/cinematic-intro-6097.mp3" preload="auto" />
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-pink-200 via-pink-400 to-pink-600 flex flex-col items-center justify-center z-50 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            className="flex flex-col items-center"
          >
            <Image
              src="/first.png"
              alt="Uptop Drive Logo"
              width={100}
              height={100}
              className="mb-4 rounded-2xl shadow-lg"
            />
            <motion.h1
              className="text-4xl font-extrabold tracking-wide text-white animate-pulse"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Uptop Drive
            </motion.h1>

            <div className="mt-6 w-56 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
              />
            </div>

            <motion.div
              key={currentTextIndex}
              className="mt-6 text-lg text-center px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {motivationalTexts[currentTextIndex]}
            </motion.div>
          </motion.div>

          {showSignup && !isLoggedIn && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/signup">
                <button className="px-6 py-2 bg-white text-pink-600 hover:bg-pink-100 transition rounded-full font-semibold shadow-md">
                  Sign Up to Continue
                </button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
