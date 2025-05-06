'use client'

import { Card } from "@/components/ui/card"
import { Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RoomActions } from "./RoomActions"

interface RoomInfoProps {
  room: {
    id: string;
    name: string;
    duration?: number | null;
    status: string | null;
    owner: string;
    restrictParticipants?: boolean | null;
    numberOfQuestions?: number | null;
  }
  participants: any[]
  questions: any[]
  roomStatus: string
  onToggleStatus: () => void
  onCopyCode: () => void
}

export function RoomInfo({
  room,
  participants,
  questions,
  roomStatus,
  onToggleStatus,
  onCopyCode
}: RoomInfoProps) {
  return (
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

          <div>
            <h3 className="text-sm font-medium text-purple-700 mb-1">Room Code</h3>
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-md font-mono text-lg tracking-wider flex-1 text-center">
                https://quiz-app.......
              </div>
            </div>
          </div>

          <RoomActions
            roomId={room.id}
            roomStatus={roomStatus}
            onToggleStatus={onToggleStatus}
            onCopyCode={onCopyCode}
          />
        </div>
      </div>
    </Card>
  )
}
