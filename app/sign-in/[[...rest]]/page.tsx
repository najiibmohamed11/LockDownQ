'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  return (
    <SignIn.Root>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100/50">
            {/* Logo and Welcome Text */}
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white rounded-full shadow-lg">
                <Image src="/logo.svg" alt="logo" width={50} height={50} />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-center">
                Sign in to continue to your account
              </p>
            </div>
            <SignIn.Step
              name="start"
              className="flex justify-center items-center "
            >
              <Clerk.Connection name="google">
                <Clerk.Loading scope="provider:google">
                  {(isLoading) => (
                    <div className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 flex items-center p-4 justify-center gap-3 rounded-xl transition-all duration-300 hover:shadow-md">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          <span className="font-medium">Signing in...</span>
                        </div>
                      ) : (
                        <>
                          <Image src="/google.svg" alt="logo" width={20} height={20} />                      
                          <span className="font-medium">
                            Continue with Google
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </Clerk.Loading>
              </Clerk.Connection>
            </SignIn.Step>

            {/* Terms and Privacy */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <Link
                  href="/"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  Terms and Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </SignIn.Root>
  );
}
