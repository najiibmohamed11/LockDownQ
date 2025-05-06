import { getRoomDetails } from "@/app/actions/quiz"
import { RoomInfo } from "@/components/teacher/room/RoomInfo"
import { QuestionsList } from "@/components/teacher/room/QuestionsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import ParticipantsTab from "./particpent"
import ButtomPart from "@/components/teacher/room/ButtomPart"
import BackButton from "@/components/teacher/room/BackButton"
import { redirect } from "next/navigation"
import { RoomType } from "@/types/room"

export default async function RoomDetails({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const { id } = params;

  // Redirect if user is not authenticated
  if (!user) {
    redirect('/sign-in');
  }

  try {
    const roomDetails = await getRoomDetails(id, user.id);
    
    if (!roomDetails?.room) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-xl font-semibold text-red-600">Room not found</div>
          <div className="mt-2 text-gray-600">The room you're trying to access might have been deleted or you don't have access.</div>
          <Button className="mt-4" onClick={() => window.location.href = '/teacher/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      );
    }

    const { room, participants = [], questions = [] } = roomDetails;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-4">
            <BackButton />
            <h1 className="text-2xl md:text-3xl font-bold text-purple-900 ml-2">{room.name}</h1>
          </div>

          {/* Room Info Card */}
          <RoomInfo
            room={room}
            participants={participants}
            questions={questions}
            roomStatus="true"
          />

          {/* Tabs */}
          <ButtomPart 
            participants={participants} 
            questions={questions}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching room details:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-xl font-semibold text-red-600">Error Loading Room</div>
        <div className="mt-2 text-gray-600">Please try again later or contact support.</div>
        <Button className="mt-4" onClick={() => window.location.href = '/teacher/dashboard'}>
          Go to Dashboard
        </Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex mb-4">
        <BackButton/>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-900">{room.name}</h1>
        </div>

        {/* Room Info Card */}
        <RoomInfo
          room={room}
          participants={participants}
          questions={questions}
          roomStatus="true"
     
        />

        {/* Tabs */}
        <ButtomPart participants={participants} questions={questions}/>
   
      </div>
    </div>
  )
}


