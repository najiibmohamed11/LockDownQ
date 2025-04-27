"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { OwlLogo } from "@/components/owl-logo"

export default function JoinQuiz() {
  const [quizCode, setQuizCode] = useState("")
  const [studentName, setStudentName] = useState("")
  const [error, setError] = useState("")

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizCode) {
      setError("Please enter a quiz code")
      return
    }
    if (!studentName) {
      setError("Please enter your name")
      return
    }

    // In a real app, this would validate the code and redirect to the quiz
    window.location.href = `/student/quiz/${quizCode}`
  }

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
        <div className="text-center mb-8">
          <Link href="/">
            <div className="flex justify-center mb-6">
              <OwlLogo size={60} />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Join a Quiz</h1>
          <p className="text-purple-700">Enter the code provided by your teacher</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-purple-900 text-center">Enter Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="quiz-code" className="block text-sm font-medium text-purple-800">
                  Quiz Code
                </label>
                <Input
                  id="quiz-code"
                  placeholder="Enter 6-digit code"
                  className="bg-white/80 border-purple-200 text-lg text-center tracking-wider"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="student-name" className="block text-sm font-medium text-purple-800">
                  Your Name
                </label>
                <Input
                  id="student-name"
                  placeholder="Enter your name"
                  className="bg-white/80 border-purple-200"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              {error && <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg">
                Join Quiz <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
