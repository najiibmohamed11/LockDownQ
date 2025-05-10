"use client"
import { changeRoomStatus } from '@/app/actions/quiz'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Pause, Play, Loader2, Share2 ,Flag, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {  } from "lucide-react";


interface PauseAndResumeProps {
  roomStatus: string
  roomId: string
}

function PauseAndResume({ roomStatus, roomId }: PauseAndResumeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(roomStatus)
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newStatus = currentStatus === "active" ? "pause" : "active"
      const { success, message } = await changeRoomStatus(newStatus, roomId)
      
      if (!success) {
        throw new Error(message || 'Failed to update room status')
      }
      
      // Update local state optimistically
      setCurrentStatus(newStatus)
      
      // Show success toast
      toast.success(
        newStatus === "active" 
          ? "Room resumed successfully" 
          : "Room paused successfully"
      )
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error(error || 'Failed to update room status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinishAndRestart = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newStatus = currentStatus === "finish" ? "active" : "finish"
      const { success, message } = await changeRoomStatus(newStatus, roomId)
      
      if (!success) {
        throw new Error(message || 'Failed to update room status')
      }    
      // Update local state optimistically
      setCurrentStatus(newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}

      {/* Finish/Restart Button */}
      <Button
        onClick={handleFinishAndRestart}
        className={cn(
          "w-full flex items-center justify-center",
          currentStatus != "finish"
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <>
          
            {currentStatus != "finish" ?  ( <> <Flag className="h-4 w-4 mr-2"/>
            Finish Quiz</>)
        :<><RotateCcw />Restart Quiz</>}
          </>
         
        )}
      </Button>

      {/* Pause/Resume Button */}
      <Button
        variant="outline"
        className={cn(
          "w-full flex items-center justify-center",
          currentStatus === "finish" && "hidden",
          currentStatus === "active"
            ? "border-amber-600 text-amber-700 hover:bg-amber-100"
            : "border-green-600 text-green-700 hover:bg-green-100"
        )}
        onClick={handleStatusChange}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : currentStatus === "active" ? (
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
  )
}

export default PauseAndResume