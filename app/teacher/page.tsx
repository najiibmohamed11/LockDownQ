"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Users, Clock, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { OwlLogo } from "@/components/owl-logo"

// Mock data for UI demonstration
const mockRooms = [
  {
    id: "quiz-1",
    name: "General Knowledge Challenge",
    status: "active",
    participants: 24,
    questions: 10,
    duration: "30 min",
    createdAt: "2 days ago",
  },
  {
    id: "quiz-2",
    name: "Science Quiz",
    status: "paused",
    participants: 18,
    questions: 8,
    duration: "20 min",
    createdAt: "1 day ago",
  },
  {
    id: "quiz-3",
    name: "History Trivia",
    status: "completed",
    participants: 32,
    questions: 15,
    duration: "25 min",
    createdAt: "5 days ago",
  },
  {
    id: "quiz-4",
    name: "Geography Challenge",
    status: "draft",
    participants: 0,
    questions: 12,
    duration: "40 min",
    createdAt: "1 hour ago",
  },
]

export default function TeacherRooms() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredRooms = mockRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="mr-3">
                <OwlLogo size={40} />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-purple-900">Your Quiz Rooms</h1>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search rooms..."
                className="pl-10 bg-white/80 border-purple-200 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Room
            </Button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Link href={`/teacher/room/${room.id}`} key={room.id}>
              <div className="group h-full">
                <Card className="h-full bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-purple-900 line-clamp-1">{room.name}</h3>
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          room.status === "active"
                            ? "bg-green-100 text-green-800"
                            : room.status === "paused"
                              ? "bg-amber-100 text-amber-800"
                              : room.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-indigo-100 text-indigo-800",
                        )}
                      >
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-purple-800">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{room.participants} participants</span>
                      </div>

                      <div className="flex items-center text-purple-800">
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
                          className="mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{room.questions} questions</span>
                      </div>

                      {room.duration && (
                        <div className="flex items-center text-purple-800">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{room.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-purple-50 flex justify-between items-center">
                    <span className="text-sm text-purple-700">Created {room.createdAt}</span>

                    <div className="flex items-center">
                      {room.status === "active" ? (
                        <Pause className="h-4 w-4 text-amber-600" />
                      ) : room.status === "paused" ? (
                        <Play className="h-4 w-4 text-green-600" />
                      ) : room.status === "draft" ? (
                        <Play className="h-4 w-4 text-green-600" />
                      ) : (
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
                          className="text-purple-600"
                        >
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredRooms.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <OwlLogo size={32} />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">No quiz rooms found</h3>
            <p className="text-purple-700 mb-6">
              {searchQuery ? "Try a different search term" : "Create your first quiz room to get started"}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateModal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Room
            </Button>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Create New Quiz Room</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="room-name" className="block text-sm font-medium text-purple-800 mb-1">
                  Room Name*
                </label>
                <Input
                  id="room-name"
                  placeholder="Enter a name for your quiz room"
                  className="bg-white border-purple-200"
                />
              </div>

              <div>
                <label htmlFor="room-description" className="block text-sm font-medium text-purple-800 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="room-description"
                  rows={3}
                  placeholder="Enter a description for your quiz"
                  className="w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="room-duration" className="block text-sm font-medium text-purple-800 mb-1">
                  Duration (Optional)
                </label>
                <div className="flex gap-2">
                  <Input id="room-duration" type="number" placeholder="30" className="bg-white border-purple-200" />
                  <select className="rounded-md border border-purple-200 bg-white px-3 py-2 text-sm">
                    <option>minutes</option>
                    <option>hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-700 hover:bg-purple-100"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Link href="/teacher/room/new-room">
                <Button className="bg-purple-600 hover:bg-purple-700">Create Room</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
