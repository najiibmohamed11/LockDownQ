'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Clock } from 'lucide-react';

export default function QuizWaiting() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-purple-800">
          Quiz Starting Soon
        </h1>
        <p className="text-purple-600 mb-8">
          Your teacher is preparing the quiz experience
        </p>

        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Outer pulsing circle */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-200"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />

          {/* Middle pulsing circle */}
          <motion.div
            className="absolute inset-4 rounded-full bg-purple-300"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />

          {/* Inner circle with icon */}
          <motion.div
            className="absolute inset-8 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-300/50"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </motion.div>
        </div>

        {/* Completely redesigned waiting card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-lg flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-purple-800">
                  Waiting for teacher{dots}
                </p>
                <p className="text-gray-600 text-sm">
                  Get ready! The quiz will begin soon.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-purple-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
