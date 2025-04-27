"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Snowflake, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 flex flex-col items-center justify-center p-4 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
          <Snowflake className="w-full h-full text-cyan-800" />
        </div>
        <div className="absolute top-20 right-20 w-24 h-24 opacity-20">
          <Snowflake className="w-full h-full text-cyan-800" />
        </div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 opacity-20">
          <Snowflake className="w-full h-full text-cyan-800" />
        </div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 opacity-20">
          <Snowflake className="w-full h-full text-cyan-800" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Snowflake className="h-8 w-8 text-cyan-700" />
        <h1 className="text-3xl font-bold text-cyan-900">FrostQuiz</h1>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-cyan-900">Join a Quiz</CardTitle>
          <CardDescription className="text-cyan-700">Enter the quiz code provided by your teacher</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-code" className="text-cyan-800">
                  Quiz Code
                </Label>
                <Input
                  id="quiz-code"
                  placeholder="Enter 6-digit code"
                  className="bg-white/80 border-white/50 text-lg text-center tracking-wider"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name" className="text-cyan-800">
                  Your Name
                </Label>
                <Input
                  id="student-name"
                  placeholder="Enter your name"
                  className="bg-white/80 border-white/50"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={handleJoin}>
            Join Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-cyan-800">Don't have a code?</p>
        <Link href="/" className="text-cyan-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
