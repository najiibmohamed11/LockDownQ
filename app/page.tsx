import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OwlLogo } from "@/components/owl-logo"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-purple-900">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5" style={{ animationDelay: "1s" }}>
          <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor" className="text-purple-900">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/3 opacity-5" style={{ animationDelay: "2s" }}>
          <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor" className="text-purple-900">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-4">
          <div className="flex justify-center ">
      <Image src='/logo.svg'  alt="logo"  width={150}
      height={150}/>
              </div>
         
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-900 text-center mb-4">I am a...</h2>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/sign-in" className="block">
              <Button className="w-full h-24 bg-purple-600 hover:bg-purple-700 text-white text-lg flex flex-col items-center justify-center gap-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-presentation"
                >
                  <path d="M2 3h20"></path>
                  <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
                  <path d="m7 21 5-5 5 5"></path>
                </svg>
                Teacher
              </Button>
            </Link>

            <Link href="/student" className="block">
              <Button
                variant="outline"
                className="w-full h-24 border-2 border-purple-600 text-purple-700 hover:bg-purple-50 text-lg flex flex-col items-center justify-center gap-2 rounded-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-graduation-cap"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
                Student
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}