import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Users, Clock, Play, Pause, CircleHelp, } from "lucide-react";
import { cn } from "@/lib/utils";
import { OwlLogo } from "@/components/owl-logo";
import {  currentUser } from "@clerk/nextjs/server";
import { getRooms } from "@/app/actions/quiz";
import { db } from "@/app/db/drizzle";
import { rooms, questions } from "@/app/db/schema";import { eq } from "drizzle-orm";

interface RoomGridProps {
  initialSearchQuery?: string;
  onCreateRoom?: () => void;
}

export async function RoomGrid() {
  
  const user = await currentUser();

  if (!user) {
    return (
      <div className="text-red-500">Please sign in to view your rooms</div>
    );
  }

  const result =  await db
          .select()
          .from(rooms)
          .where(eq(rooms.owner, user.id))
          .orderBy(rooms.created_at);        

  if (result.length==0) {
    return (
      <EmtyRoom/>
    );
  }


  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((room) => (
          <Link href={`/teacher/room/${room.id}`} key={room.id}>
            <div className="group h-full">
              <Card className="h-full bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-purple-900 line-clamp-1">
                      {room.name}
                    </h3>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        room.status === "active"
                          ? "bg-green-100 text-green-800"
                          : room.status === "paused"
                          ? "bg-amber-100 text-amber-800"
                          : room.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-indigo-100 text-indigo-800"
                      )}
                    >
                      {room.status
                        ? room.status.charAt(0).toUpperCase() +
                          room.status.slice(1)
                        : "Draft"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-purple-800">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {room.participantList?.length || 0} participants
                      </span>
                    </div>

                    <div className="flex items-center text-purple-800 ">
                    <CircleHelp className="h-4 w-4 mr-2"/>
                        <span >{room.numberOfQuestions || 0} questions</span>
                    </div>

                    {
                      <div className="flex items-center text-purple-800">
                        <Clock className="h-4 w-4 mr-2" />
                        <span >{room.duration?`${room.duration} minutes`:"  unlimited"} </span>
                      </div>
                    }
                  </div>
                </div>

                <div className="px-6 py-4 bg-purple-50 flex justify-between items-center">
                  <span className="text-sm text-purple-700">
                    Created {formatDate(room.created_at)}
                  </span>

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

 
    </>
  );
}



function EmtyRoom(){
  return(
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">
            No quiz rooms found
          </h3>
     
          <Button
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Room
          </Button>
        </div>
  )
}