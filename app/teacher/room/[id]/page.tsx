"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Users,
  PlusCircle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Copy,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { QuestionCreator } from "@/components/question-creator"
import { OwlLogo } from "@/components/owl-logo"

// Mock data for UI demonstration
const roomData = {
  id: "quiz-1",
  name: "General Knowledge Challenge",
  description: "Test your knowledge about various topics and facts.",
  status: "active",
  participants: [
    { id: 1, name: "Emma Johnson", progress: 8, score: 7, timeSpent: "12:45" },
    { id: 2, name: "Noah Williams", progress: 10, score: 9, timeSpent: "15:20" },
    { id: 3, name: "Olivia Brown", progress: 6, score: 5, timeSpent: "10:15" },
    { id: 4, name: "Liam Davis", progress: 10, score: 8, timeSpent: "14:30" },
    { id: 5, name: "Ava Miller", progress: 4, score: 3, timeSpent: "08:10" },
  ],
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      id: 2,
      type: "true-false",
      text: "The Great Wall of China is visible from space.",
      options: ["True", "False"],
      correctAnswer: "False",
    },
    {
      id: 3,
      type: "multiple-choice",
      text: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci",
    },
    {
      id: 4,
      type: "short-answer",
      text: "What is the chemical symbol for gold?",
      correctAnswer: "Au",
    },
    {
      id: 5,
      type: "multiple-choice",
      text: "Which of these is not a programming language?",
      options: ["Java", "Python", "Cobra", "Ruby"],
      correctAnswer: "Cobra",
    },
    {
      id: 6,
      type: "multiple-choice",
      text: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: "Canberra",
    },
    {
      id: 7,
      type: "true-false",
      text: "The Pacific Ocean is the largest ocean on Earth.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      id: 8,
      type: "short-answer",
      text: "What is the largest mammal on Earth?",
      correctAnswer: "Blue Whale",
    },
    {
      id: 9,
      type: "multiple-choice",
      text: "Which of these elements has the chemical symbol 'K'?",
      options: ["Krypton", "Potassium", "Calcium", "Copper"],
      correctAnswer: "Potassium",
    },
    {
      id: 10,
      type: "multiple-choice",
      text: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare",
    },
  ],
  duration: "30 min",
  createdAt: "2 days ago",
  roomCode: "QUIZ123",
}

export default function RoomDetails({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [roomName, setRoomName] = useState(roomData.name)
  const [roomDescription, setRoomDescription] = useState(roomData.description)
  const [roomStatus, setRoomStatus] = useState(roomData.status)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomData.roomCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const toggleRoomStatus = () => {
    setRoomStatus(roomStatus === "active" ? "paused" : "active")
  }

  const handleQuestionClick = (questionNumber: number) => {
    setSelectedQuestion(questionNumber)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
          <Link href="/teacher">
            <Button variant="ghost" className="text-purple-700 mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
        <div className="flex  mb-4">

          {isEditing ? (
            <div className="flex-1">
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-xl font-bold bg-white/80 border-purple-300"
              />
            </div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-purple-900">{roomName}</h1>
          )}
          {isEditing ? (
            <Button className="ml-2 bg-purple-600 hover:bg-purple-700" onClick={() => setIsEditing(false)}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          ) : (
            <Button variant="ghost" className="ml-2 text-purple-700" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>

        {/* Room Info Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Questions</h3>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 text-purple-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span className="text-purple-900">{roomData.questions.length} questions</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Participants</h3>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="text-purple-900">{roomData.participants.length} students</span>
                </div>
              </div>
         

            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Duration</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="text-purple-900">{roomData.duration}</span>
                </div>
              </div>
      

    
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Room Code</h3>
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-md font-mono text-lg tracking-wider flex-1 text-center">
                    {roomData.roomCode}
                  </div>
                  <Button variant="ghost" size="icon" className="ml-2 text-purple-700" onClick={handleCopyCode}>
                    {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                  <Share2 className="h-4 w-4 mr-2" /> Share Room
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "w-full",
                    roomStatus === "active"
                      ? "border-amber-600 text-amber-700 hover:bg-amber-100"
                      : "border-green-600 text-green-700 hover:bg-green-100",
                  )}
                  onClick={toggleRoomStatus}
                >
                  {roomStatus === "active" ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" /> Pause Room
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Resume Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="participants">
          <TabsList className="bg-white/50 mb-6">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="m-0">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
              <div className="p-4 border-b border-purple-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-purple-900">Student Performance</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-700">View by:</span>
                  <div className="bg-purple-50 rounded-lg p-1 flex">
                    <Button variant="ghost" size="sm" className="bg-white rounded-md shadow-sm text-purple-900">
                      Questions
                    </Button>
                    <Button variant="ghost" size="sm" className="text-purple-700">
                      Students
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-50">
                      <th className="text-left p-4 text-purple-800 font-medium">NAME</th>
                      <th className="text-left p-4 text-purple-800 font-medium">SCORE %</th>
                      {roomData.questions.slice(0, 5).map((_, index) => (
                        <th key={index} className="p-3 text-purple-800 font-medium text-center w-20">
                          <button
                            className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors flex items-center justify-center font-medium"
                            onClick={() => handleQuestionClick(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roomData.participants.map((student) => (
                      <tr key={student.id} className="border-b border-purple-50 hover:bg-purple-50/50">
                        <td className="p-4 text-purple-900 font-medium">{student.name}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-sm font-medium",
                              student.score / student.progress >= 0.8
                                ? "bg-green-100 text-green-800"
                                : student.score / student.progress >= 0.6
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-amber-100 text-amber-800",
                            )}
                          >
                            {Math.round((student.score / roomData.questions.length) * 100)}%
                          </span>
                        </td>
                        {/* Mock answers for the first 5 questions */}
                        <td className="p-2 text-center">
                          <div className="bg-red-100 rounded-md p-2 text-red-800 flex items-center justify-center">
                            <XCircle className="h-4 w-4 mr-1" /> B
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="bg-green-100 rounded-md p-2 text-green-800 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> True
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="bg-red-100 rounded-md p-2 text-red-800 flex items-center justify-center">
                            <XCircle className="h-4 w-4 mr-1" /> A
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="bg-green-100 rounded-md p-2 text-green-800 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> False
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="bg-red-100 rounded-md p-2 text-red-800 flex items-center justify-center">
                            <XCircle className="h-4 w-4 mr-1" /> Au
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-purple-50/70">
                      <td className="p-4 text-purple-900 font-medium">Class Total</td>
                      <td className="p-4 text-purple-900 font-medium">
                        {Math.round(
                          (roomData.participants.reduce((acc, student) => acc + student.score, 0) /
                            (roomData.participants.length * roomData.questions.length)) *
                            100,
                        )}
                        %
                      </td>
                      <td className="p-4 text-center text-purple-900 font-medium">20%</td>
                      <td className="p-4 text-center text-purple-900 font-medium">100%</td>
                      <td className="p-4 text-center text-purple-900 font-medium">40%</td>
                      <td className="p-4 text-center text-purple-900 font-medium">80%</td>
                      <td className="p-4 text-center text-purple-900 font-medium">30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Question Detail Modal */}
            {selectedQuestion && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-900">Question {selectedQuestion}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-700"
                      onClick={() => setSelectedQuestion(null)}
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
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">
                        {roomData.questions[selectedQuestion - 1]?.text || "Question text"}
                      </h3>
                      <div className="flex items-center text-sm text-purple-700">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                          {roomData.questions[selectedQuestion - 1]?.type || "Multiple choice"}
                        </span>
                        <span>
                          Correct answer: {roomData.questions[selectedQuestion - 1]?.correctAnswer || "Not available"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-purple-900 mb-3">Student Performance</h3>
                      <div className="flex items-center mb-4">
                        <div className="w-full h-3 bg-purple-100 rounded-full mr-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `60%` }}></div>
                        </div>
                        <span className="text-purple-900 font-medium">60% correct</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-purple-100 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-800 mb-2">Correct Answers</h4>
                          <div className="text-3xl font-bold text-green-600">12</div>
                          <div className="text-sm text-purple-700">out of 20 students</div>
                        </div>
                        <div className="bg-white border border-purple-100 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-purple-800 mb-2">Incorrect Answers</h4>
                          <div className="text-3xl font-bold text-red-500">8</div>
                          <div className="text-sm text-purple-700">out of 20 students</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-purple-900 mb-3">Answer Distribution</h3>
                      <div className="space-y-2">
                        {(roomData.questions[selectedQuestion - 1]?.options || ["A", "B", "C", "D"]).map(
                          (option, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 text-purple-900 font-medium">{option}</div>
                              <div className="flex-1 mx-2">
                                <div className="h-8 bg-purple-100 rounded-md relative">
                                  <div
                                    className={`h-full ${option === roomData.questions[selectedQuestion - 1]?.correctAnswer ? "bg-green-500" : "bg-purple-300"} rounded-md`}
                                    style={{
                                      width: `${option === roomData.questions[selectedQuestion - 1]?.correctAnswer ? "60%" : "20%"}`,
                                    }}
                                  ></div>
                                  <span className="absolute inset-0 flex items-center justify-end pr-3 text-sm font-medium text-purple-900">
                                    {option === roomData.questions[selectedQuestion - 1]?.correctAnswer ? "60%" : "20%"}
                                  </span>
                                </div>
                              </div>
                              <div className="w-10 text-right text-purple-900 font-medium">
                                {option === roomData.questions[selectedQuestion - 1]?.correctAnswer ? "12" : "4"}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
                      <Button
                        variant="outline"
                        className="border-purple-600 text-purple-700 hover:bg-purple-100"
                        onClick={() => setSelectedQuestion(null)}
                      >
                        Close
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Edit className="h-4 w-4 mr-1" /> Edit Question
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="m-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-900">Quiz Questions</h2>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddQuestion(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {roomData.questions.map((question, index) => (
                <Card key={question.id} className="bg-white/90 backdrop-blur-sm border-purple-100 p-4">
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium mr-2",
                              question.type === "multiple-choice"
                                ? "bg-indigo-100 text-indigo-800"
                                : question.type === "true-false"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800",
                            )}
                          >
                            {question.type === "multiple-choice"
                              ? "Multiple Choice"
                              : question.type === "true-false"
                                ? "True/False"
                                : "Short Answer"}
                          </span>
                        </div>
                        <h3 className="text-purple-900 font-medium">{question.text}</h3>

                        {question.type !== "short-answer" && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                {option === question.correctAnswer ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                )}
                                <span
                                  className={
                                    option === question.correctAnswer ? "text-green-800 font-medium" : "text-purple-800"
                                  }
                                >
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "short-answer" && (
                          <div className="mt-2">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-green-800 font-medium">{question.correctAnswer}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-purple-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-6">Room Settings</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-1">Room Duration</label>
                    <div className="flex gap-2">
                      <Input type="number" defaultValue="30" className="bg-white/80 border-purple-200" />
                      <select className="rounded-md border border-purple-200 bg-white/80 px-3 py-2 text-sm">
                        <option>minutes</option>
                        <option>hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-1">Room Code</label>
                    <div className="flex gap-2">
                      <Input defaultValue={roomData.roomCode} className="bg-white/80 border-purple-200" />
                      <Button className="bg-purple-600 hover:bg-purple-700">Regenerate</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-purple-900">Quiz Options</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-purple-800 font-medium">Shuffle Questions</h4>
                      <p className="text-purple-700 text-sm">Present questions in random order to each student</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-purple-800 font-medium">Show Results Immediately</h4>
                      <p className="text-purple-700 text-sm">Show students their results right after submission</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-purple-800 font-medium">Allow Retakes</h4>
                      <p className="text-purple-700 text-sm">Let students take the quiz multiple times</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-purple-800 font-medium">Require All Questions</h4>
                      <p className="text-purple-700 text-sm">Students must answer all questions to submit</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" /> Save Settings
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">Add New Question</h2>
              <Button variant="ghost" size="icon" className="text-purple-700" onClick={() => setShowAddQuestion(false)}>
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
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            <QuestionCreator onClose={() => setShowAddQuestion(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
