"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
            <SignIn.Step name="start" className="flex justify-center items-center ">
              <Clerk.Connection name="google">
                <Clerk.Loading scope="provider:google">
                  {(isLoading) => (
                    <div
                      className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 flex items-center p-4 justify-center gap-3 rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          <span className="font-medium">Signing in...</span>
                        </div>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
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
                By signing in, you agree to our{" "}
                <Link
                  href="/"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
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
