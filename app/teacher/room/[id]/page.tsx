"use client"

import { useEffect, useState } from "react"
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
import { getRoomDetails } from "@/app/actions/quiz"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import ParticipantsTab from "./particpent"

export default function RoomDetails({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([])
  const [roomStatus, setRoomStatus] = useState("draft")
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [roomName, setRoomName] = useState("")
  const path = usePathname()
  const { user, isLoaded } = useUser();

  // Generate a room code based on room id or use a default
  const generateRoomCode = (id) => {
    if (!id) return "LOADING";
    // Take first 6 characters of the room id and make uppercase
    return id.substring(0, 6).toUpperCase();
  }

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!user) {
        return 
      }
      try {
        const roomId = path.split('/')[3];
        const { participants, questions, room } = await getRoomDetails(roomId, user?.id);
        
        setParticipants(participants || []);
        setQuestions(questions || []);
        setRoom(room);
        setRoomName(room?.name || "");
        setRoomStatus(room?.status || "draft");
        console.log(participants[0])
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    }
    
    if (isLoaded && user) {
      fetchRoomDetails();
    }
  }, [isLoaded, user, path]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://quiz-app-sepia-gamma.vercel.app/student/${path.split('/')[3]}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  const toggleRoomStatus = () => {
    setRoomStatus(roomStatus === "active" ? "paused" : "active");
    // Here you would typically update the room status in the database
  }

  const handleQuestionClick = (questionNumber) => {
    setSelectedQuestion(questionNumber);
  }

  if (!room) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
      <div className="text-xl font-semibold text-purple-800">Loading room details...</div>
    </div>;
  }

  const roomCode = generateRoomCode(room.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Button variant="ghost" className="text-purple-700 mr-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex mb-4">
          {isEditing ? (
            <div className="flex-1">
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-xl font-bold bg-white/80 border-purple-300"
              />
            </div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-purple-900">{room.name}</h1>
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
                  <span className="text-purple-900">{questions.length} questions</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Participants</h3>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="text-purple-900">{participants.length} students</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Duration</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="text-purple-900">{room.duration ? `${room.duration} min` : "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">Room Code</h3>
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-md font-mono text-lg tracking-wider flex-1 text-center">
                  https://quiz-app.......
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
         <ParticipantsTab participants={participants} questions={questions}/>

            {/* Question Detail Modal - keeping as is for now */}
            {selectedQuestion && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                {/* Modal content - will update later */}
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
                  
                  {/* Question detail content */}
                  <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">
                        {questions[selectedQuestion - 1]?.question || "Question text"}
                      </h3>
                      <div className="flex items-center text-sm text-purple-700">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                          {questions[selectedQuestion - 1]?.type || "Multiple choice"}
                        </span>
                        <span>
                          Correct answer: {
                            typeof questions[selectedQuestion - 1]?.answer === 'object' 
                              ? JSON.stringify(questions[selectedQuestion - 1]?.answer) 
                              : questions[selectedQuestion - 1]?.answer || "Not available"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Placeholder statistics */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
                      <Button
                        variant="outline"
                        className="border-purple-600 text-purple-700 hover:bg-purple-100"
                        onClick={() => setSelectedQuestion(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Keeping the rest of the tabs as is for now */}
          <TabsContent value="questions" className="m-0">
            {/* Questions tab content */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-900">Quiz Questions</h2>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddQuestion(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((question, index) => (
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
                              {question.type}
                            </span>
                          </div>
                          <h3 className="text-purple-900 font-medium">{question.question}</h3>

                          {question.type !== "short-answer" && Array.isArray(question.options) && (
                            <div className="mt-2 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  {JSON.stringify(option) === JSON.stringify(question.answer) ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                  )}
                                  <span
                                    className={
                                      JSON.stringify(option) === JSON.stringify(question.answer) 
                                        ? "text-green-800 font-medium" 
                                        : "text-purple-800"
                                    }
                                  >
                                    {typeof option === 'object' ? JSON.stringify(option) : option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === "short-answer" && (
                            <div className="mt-2">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">
                                  {typeof question.answer === 'object' 
                                    ? JSON.stringify(question.answer) 
                                    : question.answer}
                                </span>
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
                ))
              ) : (
                <div className="text-center p-8 bg-white/70 rounded-lg border border-purple-100">
                  <p className="text-purple-700 mb-4">No questions have been added to this quiz yet.</p>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddQuestion(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Question
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            {/* Settings tab content - keeping as is for now */}
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-6">Room Settings</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-1">Room Duration</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        defaultValue={room.duration || 30} 
                        className="bg-white/80 border-purple-200" 
                      />
                      <select className="rounded-md border border-purple-200 bg-white/80 px-3 py-2 text-sm">
                        <option>minutes</option>
                        <option>hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-1">Room Code</label>
                    <div className="flex gap-2">
                      <Input defaultValue={roomCode} className="bg-white/80 border-purple-200" />
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
                    <Switch defaultChecked={room.randomizeQuestions} />
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

      {/* Add Question Modal - keeping as is for now */}
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

            <QuestionCreator onClose={() => setShowAddQuestion(false)} roomId={room.id} />
          </div>
        </div>
      )}
    </div>
  )
}