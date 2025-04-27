"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { OwlLogo } from "@/components/owl-logo"

// Mock quiz data
const quizData = {
  id: "quiz-1",
  title: "General Knowledge Challenge",
  timeLimit: 30 * 60, // 30 minutes in seconds
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
    },
    {
      id: 2,
      type: "true-false",
      text: "The Great Wall of China is visible from space.",
      options: ["True", "False"],
    },
    {
      id: 3,
      type: "multiple-choice",
      text: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    },
    {
      id: 4,
      type: "short-answer",
      text: "What is the chemical symbol for gold?",
    },
    {
      id: 5,
      type: "multiple-choice",
      text: "Which of these is not a programming language?",
      options: ["Java", "Python", "Cobra", "Ruby"],
    },
  ],
}

export default function TakeQuiz({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(quizData.questions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit)
  const [isPaused, setIsPaused] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [shortAnswerText, setShortAnswerText] = useState("")

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isPaused, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleShortAnswerChange = (text: string) => {
    setShortAnswerText(text)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = text
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
      if (quizData.questions[currentQuestion + 1].type === "short-answer") {
        setShortAnswerText(answers[currentQuestion + 1] || "")
      }
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      if (quizData.questions[currentQuestion - 1].type === "short-answer") {
        setShortAnswerText(answers[currentQuestion - 1] || "")
      }
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setShowResults(true)
  }

  const progressPercentage = ((currentQuestion + 1) / quizData.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 flex flex-col">
      {!showResults ? (
        <>
          <header className="bg-white/50 backdrop-blur-sm py-4 border-b border-white/20 sticky top-0 z-10">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <OwlLogo size={32} className="mr-2" />
                  <h1 className="text-xl font-bold text-purple-900">{quizData.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-full",
                      timeLeft < 60 ? "bg-red-100 text-red-800" : "bg-purple-100 text-purple-800",
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-700 hover:bg-purple-100"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-800">
                    Question {currentQuestion + 1} of {quizData.questions.length}
                  </span>
                  <span className="text-purple-800">{answers.filter((a) => a !== null).length} answered</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-purple-100">
                  <div className="h-full bg-purple-600 rounded-full" />
                </Progress>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-purple-100 mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-purple-900 mb-6">
                    {quizData.questions[currentQuestion].text}
                  </h2>

                  {quizData.questions[currentQuestion].type !== "short-answer" ? (
                    <div className="grid gap-4">
                      {quizData.questions[currentQuestion].options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          className={cn(
                            "relative p-6 rounded-xl text-left font-medium transition-all duration-200 group",
                            selectedAnswer === option
                              ? "bg-purple-100 border-purple-300 text-purple-800"
                              : "bg-white hover:bg-purple-50 text-purple-900 border-purple-100",
                            "border-2",
                          )}
                        >
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-purple-800">Your Answer</label>
                      <textarea
                        rows={3}
                        placeholder="Type your answer here..."
                        className="w-full rounded-md border border-purple-200 bg-white px-3 py-2"
                        value={shortAnswerText}
                        onChange={(e) => handleShortAnswerChange(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-700 hover:bg-purple-100"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentQuestion === quizData.questions.length - 1 ? (
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNextQuestion}>
                      Next Question
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>

          {isPaused && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="bg-white/90 backdrop-blur-sm border-purple-100 w-full max-w-md">
                <div className="p-6 text-center">
                  <AlertCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Quiz Paused</h2>
                  <p className="text-purple-800 mb-6">
                    Your timer has been paused. Click resume when you're ready to continue.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsPaused(false)}>
                    Resume Quiz
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="bg-white/90 backdrop-blur-sm border-purple-100 w-full max-w-2xl">
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-purple-900 mb-2">Quiz Completed!</h2>
              <p className="text-xl text-purple-800 mb-6">Your answers have been submitted</p>

              <div className="mb-8 max-w-md mx-auto">
                <div className="bg-purple-50 rounded-lg p-4 text-left">
                  <h3 className="text-lg font-medium text-purple-900 mb-2">Quiz Summary</h3>
                  <div className="space-y-2 text-purple-800">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{quizData.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Answered:</span>
                      <span>{answers.filter((a) => a !== null).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time spent:</span>
                      <span>{formatTime(quizData.timeLimit - timeLeft)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-700 hover:bg-purple-100"
                  onClick={() => (window.location.href = "/student")}
                >
                  Exit Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
