"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { PlusCircle, Search, Users, Clock, BarChart3, Snowflake } from "lucide-react"

// Mock data for UI demonstration
const quizzes = [
  {
    id: "q1",
    title: "Winter Sports Quiz",
    questions: 10,
    participants: 24,
    status: "active",
    created: "2 days ago",
    timeLimit: "30 min",
  },
  {
    id: "q2",
    title: "Snow Science",
    questions: 8,
    participants: 18,
    status: "scheduled",
    created: "1 day ago",
    timeLimit: "20 min",
  },
  {
    id: "q3",
    title: "Winter Animals",
    questions: 12,
    participants: 32,
    status: "completed",
    created: "5 days ago",
    timeLimit: "25 min",
  },
  {
    id: "q4",
    title: "Holiday Traditions",
    questions: 15,
    participants: 28,
    status: "draft",
    created: "1 hour ago",
    timeLimit: "40 min",
  },
]

export default function TeacherDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuizzes = quizzes.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <TeacherLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-900">Teacher Dashboard</h1>
          <p className="text-cyan-700">Manage your quizzes and view student performance</p>
        </div>
        <Link href="/teacher/create-quiz">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Quiz
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Snowflake className="h-8 w-8 text-cyan-600 mr-3" />
              <div className="text-3xl font-bold text-cyan-900">12</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-cyan-600 mr-3" />
              <div className="text-3xl font-bold text-cyan-900">87</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-900 text-lg">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-cyan-600 mr-3" />
              <div className="text-3xl font-bold text-cyan-900">92%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-white/50">
            <TabsTrigger value="all">All Quizzes</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-500" />
            <Input
              placeholder="Search quizzes..."
              className="pl-10 bg-white/80 border-white/50 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-cyan-900">{quiz.title}</CardTitle>
                    <Badge
                      className={
                        quiz.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : quiz.status === "scheduled"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : quiz.status === "completed"
                              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }
                    >
                      {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-cyan-700">Created {quiz.created}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-cyan-800 mb-2">
                    <div className="flex items-center">
                      <Snowflake className="h-4 w-4 mr-1" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{quiz.timeLimit}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-cyan-800">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{quiz.participants} participants</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/teacher/quiz/${quiz.id}`}>
                    <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/teacher/quiz/${quiz.id}/results`}>
                    <Button variant="ghost" className="text-cyan-700">
                      <BarChart3 className="h-4 w-4 mr-1" /> Results
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tab contents would be similar but filtered by status */}
        <TabsContent value="active" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes
              .filter((q) => q.status === "active")
              .map((quiz) => (
                <Card
                  key={quiz.id}
                  className="bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow"
                >
                  {/* Same card content as above */}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-cyan-900">{quiz.title}</CardTitle>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                    </div>
                    <CardDescription className="text-cyan-700">Created {quiz.created}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-cyan-800 mb-2">
                      <div className="flex items-center">
                        <Snowflake className="h-4 w-4 mr-1" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-cyan-800">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{quiz.participants} participants</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/teacher/quiz/${quiz.id}`}>
                      <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/teacher/quiz/${quiz.id}/results`}>
                      <Button variant="ghost" className="text-cyan-700">
                        <BarChart3 className="h-4 w-4 mr-1" /> Results
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Similar TabsContent for other tabs */}
      </Tabs>
    </TeacherLayout>
  )
}
