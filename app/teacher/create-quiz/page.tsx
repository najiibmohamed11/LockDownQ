"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { PlusCircle, ArrowLeft, Save, Play } from "lucide-react"
import { QuestionEditor } from "@/components/question-editor"

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { id: 1, type: "multiple-choice", text: "", options: ["", "", "", ""], correctAnswer: null },
  ])

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      text: "",
      options: type === "multiple-choice" ? ["", "", "", ""] : type === "true-false" ? ["True", "False"] : [],
      correctAnswer: null,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <TeacherLayout>
      <div className="flex items-center mb-8">
        <Link href="/teacher/dashboard">
          <Button variant="ghost" className="text-cyan-700 mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-cyan-900">Create New Quiz</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 mb-6">
            <CardHeader>
              <CardTitle className="text-cyan-900">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz-title" className="text-cyan-800">
                    Quiz Title
                  </Label>
                  <Input id="quiz-title" placeholder="Enter quiz title..." className="bg-white/80 border-white/50" />
                </div>
                <div>
                  <Label htmlFor="quiz-description" className="text-cyan-800">
                    Description
                  </Label>
                  <Textarea
                    id="quiz-description"
                    placeholder="Enter quiz description..."
                    className="bg-white/80 border-white/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time-limit" className="text-cyan-800">
                      Time Limit
                    </Label>
                    <div className="flex items-center">
                      <Input id="time-limit" type="number" placeholder="30" className="bg-white/80 border-white/50" />
                      <Select defaultValue="minutes">
                        <SelectTrigger className="w-32 ml-2 bg-white/80 border-white/50">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="points-per-question" className="text-cyan-800">
                      Points Per Question
                    </Label>
                    <Input
                      id="points-per-question"
                      type="number"
                      placeholder="10"
                      className="bg-white/80 border-white/50"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="shuffle-questions" />
                  <Label htmlFor="shuffle-questions" className="text-cyan-800">
                    Shuffle Questions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-results-immediately" />
                  <Label htmlFor="show-results-immediately" className="text-cyan-800">
                    Show Results Immediately
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                questionNumber={index + 1}
                onRemove={() => removeQuestion(question.id)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-cyan-600 text-cyan-700 hover:bg-cyan-100"
              onClick={() => addQuestion("multiple-choice")}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Multiple Choice
            </Button>
            <Button
              variant="outline"
              className="border-cyan-600 text-cyan-700 hover:bg-cyan-100"
              onClick={() => addQuestion("true-false")}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> True/False
            </Button>
            <Button
              variant="outline"
              className="border-cyan-600 text-cyan-700 hover:bg-cyan-100"
              onClick={() => addQuestion("short-answer")}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Short Answer
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-cyan-900">Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-cyan-800">Schedule</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label htmlFor="start-date" className="text-xs text-cyan-700">
                        Start Date
                      </Label>
                      <Input id="start-date" type="date" className="bg-white/80 border-white/50" />
                    </div>
                    <div>
                      <Label htmlFor="start-time" className="text-xs text-cyan-700">
                        Start Time
                      </Label>
                      <Input id="start-time" type="time" className="bg-white/80 border-white/50" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-cyan-800">Access Control</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="require-password" />
                      <Label htmlFor="require-password" className="text-cyan-800">
                        Require Password
                      </Label>
                    </div>
                    <Input placeholder="Enter password..." className="bg-white/80 border-white/50" />
                  </div>
                </div>

                <div>
                  <Label className="text-cyan-800">Theme</Label>
                  <Select defaultValue="winter">
                    <SelectTrigger className="mt-2 bg-white/80 border-white/50">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="winter">Winter Wonderland</SelectItem>
                      <SelectItem value="snow">Snowy Mountains</SelectItem>
                      <SelectItem value="ice">Ice Crystal</SelectItem>
                      <SelectItem value="aurora">Northern Lights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-cyan-100">
                  <div className="flex flex-col gap-3">
                    <Button className="bg-cyan-600 hover:bg-cyan-700 w-full">
                      <Save className="h-4 w-4 mr-1" /> Save Quiz
                    </Button>
                    <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100 w-full">
                      <Save className="h-4 w-4 mr-1" /> Save as Draft
                    </Button>
                    <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white w-full">
                      <Play className="h-4 w-4 mr-1" /> Start Quiz Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  )
}
