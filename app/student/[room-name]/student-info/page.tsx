'use client';
import type React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Router } from 'lucide-react';
import Image from 'next/image';
import { CreatParticipent } from '@/app/actions/participants';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { db } from '@/app/db/drizzle';
import { rooms } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { checkIfTheRoomExist } from '@/app/actions/quiz';

export default function StudentInfo() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkRoom = async () => {
      const { exist, message } = await checkIfTheRoomExist(
        pathname.split('/')[2]
      );
      console.log(message);
      if (!exist) {
        router.push('/student/');
      }
    };
    checkRoom();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please provide your name');
      return;
    }
    try {
      setIsLoading(true);
      const result = await CreatParticipent(name, pathname.split('/')[2]);
      if (result.success) {
        router.push(
          `/student/quiz/${pathname.split('/')[2]}/${result.data.id}`
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'There was an issue. Please try again.'
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div
          className="absolute top-1/3 right-1/4 opacity-5"
          style={{ animationDelay: '1s' }}
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 opacity-5"
          style={{ animationDelay: '2s' }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>
      <div className="relative z-10 max-w-md w-full">
        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
          <CardHeader className="pb-4"></CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="student-name"
                  className="block text-sm font-medium text-purple-800"
                >
                  name
                </label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="student-name"
                  name="name"
                  required={true}
                  placeholder="Enter your name"
                  className="bg-white/80 border-purple-200"
                />
              </div>

              {error && (
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm flex justify-center">
                  {error}
                </div>
              )}
              <div className="relative w-full">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-6 w-6 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Joining...
                    </div>
                  ) : (
                    <>
                      Join Quiz{' '}
                      <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                    </>
                  )}
                </Button>
                {isLoading && (
                  <div className="absolute inset-0 bg-purple-600 opacity-50 rounded-md cursor-not-allowed"></div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
