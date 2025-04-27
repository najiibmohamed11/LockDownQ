"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { ArrowLeft, Download, Mail, BarChart3 } from "lucide-react"

// Mock data for UI demonstration
const quizData = {
  id: "q1",
  title: "Winter Sports Quiz",
  questions: 10,
  participants: 24,
  averageScore: 78,
  completionRate: 92,
  timeLimit: "30 min",
  created: "2 days ago",
  status: "completed",
}

const studentResults = [
  { id: 1, name: "Emma Johnson", score: 90, timeSpent: "18:45", completedAt: "Dec 10, 2:15 PM" },
  { id: 2, name: "Noah Williams", score: 85, timeSpent: "22:30", completedAt: "Dec 10, 2:20 PM" },
  { id: 3, name: "Olivia Brown", score: 95, timeSpent: "15:10", completedAt: "Dec 10, 1:45 PM" },
  { id: 4, name: "Liam Davis", score: 70, timeSpent: "25:30", completedAt: "Dec 10, 2:25 PM" },
  { id: 5, name: "Ava Miller", score: 80, timeSpent: "20:15", completedAt: "Dec 10, 2:05 PM" },
  { id: 6, name: "Sophia Wilson", score: 75, timeSpent: "23:40", completedAt: "Dec 10, 2:30 PM" },
  { id: 7, name: "Jackson Moore", score: 88, timeSpent: "19:20", completedAt: "Dec 10, 1:50 PM" },
  { id: 8, name: "Isabella Taylor", score: 92, timeSpent: "17:35", completedAt: "Dec 10, 1:40 PM" },
]

const questionAnalysis = [
  { id: 1, text: "Which of these is NOT a winter sport?", correctRate: 95 },
  { id: 2, text: "What is the minimum ice thickness considered safe for skating?", correctRate: 65 },
  { id: 3, text: "In which year were the first Winter Olympics held?", correctRate: 70 },
  { id: 4, text: "What is the primary material used in modern snowboards?", correctRate: 85 },
  { id: 5, text: "Which country has won the most medals in Winter Olympic history?", correctRate: 60 },
]

export default function QuizResults({ params }: { params: { id: string } }) {
  return (
    <TeacherLayout>
      <div className="flex items-center mb-8">
        <Link href="/teacher/dashboard">
          <Button variant="ghost" className="text-cyan-700 mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-cyan-900">{quizData.title} - Results</h1>
          <p className="text-cyan-700">
            {quizData.participants} participants • {quizData.averageScore}% average score
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">{quizData.averageScore}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">{quizData.completionRate}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">{quizData.participants}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4 gap-3">
        <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100">
          <Mail className="h-4 w-4 mr-1" /> Email Results
        </Button>
        <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100">
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <Tabs defaultValue="students" className="mb-8">
        <TabsList className="bg-white/50 mb-4">
          <TabsTrigger value="students">Student Results</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="m-0">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-100">
                      <th className="text-left p-4 text-cyan-800 font-medium">Student</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Score</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Time Spent</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Completed At</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentResults.map((student) => (
                      <tr key={student.id} className="border-b border-cyan-50 hover:bg-cyan-50/50">
                        <td className="p-4 text-cyan-900">{student.name}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              student.score >= 90
                                ? "bg-green-100 text-green-800"
                                : student.score >= 75
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {student.score}%
                          </span>
                        </td>
                        <td className="p-4 text-cyan-800">{student.timeSpent}</td>
                        <td className="p-4 text-cyan-800">{student.completedAt}</td>
                        <td className="p-4">
                          <Link href={`/teacher/quiz/${quizData.id}/student/${student.id}`}>
                            <Button variant="ghost" className="text-cyan-700 h-8 px-2">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="m-0">
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-100">
                      <th className="text-left p-4 text-cyan-800 font-medium">Question</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Correct Rate</th>
                      <th className="text-left p-4 text-cyan-800 font-medium">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionAnalysis.map((question) => (
                      <tr key={question.id} className="border-b border-cyan-50 hover:bg-cyan-50/50">
                        <td className="p-4 text-cyan-900">{question.text}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-cyan-100 rounded-full mr-2">
                              <div
                                className={`h-full rounded-full ${
                                  question.correctRate >= 80
                                    ? "bg-green-500"
                                    : question.correctRate >= 60
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                                }`}
                                style={{ width: `${question.correctRate}%` }}
                              ></div>
                            </div>
                            <span className="text-cyan-800">{question.correctRate}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              question.correctRate >= 80
                                ? "bg-green-100 text-green-800"
                                : question.correctRate >= 60
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {question.correctRate >= 80 ? "Easy" : question.correctRate >= 60 ? "Medium" : "Hard"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-cyan-900">Score Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center text-cyan-700 flex items-center justify-center h-64 w-full">
                  <BarChart3 className="h-16 w-16" />
                  <p className="ml-4">Chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-cyan-900">Completion Time</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center text-cyan-700 flex items-center justify-center h-64 w-full">
                  <BarChart3 className="h-16 w-16" />
                  <p className="ml-4">Chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </TeacherLayout>
  )
}
