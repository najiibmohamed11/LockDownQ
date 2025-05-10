"use server";

import { db } from "@/app/db/drizzle";
import { rooms, questions, participants } from "@/app/db/schema";
import { redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";

export type CreateRoomData = {
  roomName: string;
  duration: string;
  owner: string;
  questions: {
    type: string;
    question: string;
    options: string[];
    answer: number | string;
  }[];
  settings: {
    restrictParticipants: boolean;
    preventCopying: boolean;
    randomizeQuestions: boolean;
    showOneQuestionAtTime: boolean;
  };
  participantList: string[];
};

export async function createQuizRoom(data: CreateRoomData) {
  try {
    // Create the room first
    const [room] = await db
      .insert(rooms)
      .values({
        name: data.roomName,
        duration: data.duration ? parseInt(data.duration) : null,
        restrictParticipants: data.settings.restrictParticipants,
        preventCopying: data.settings.preventCopying,
        randomizeQuestions: data.settings.randomizeQuestions,
        showOneQuestionAtTime: data.settings.showOneQuestionAtTime,
        participantList: data.participantList,
        status: "active",
        owner: data.owner.toString(),
        numberOfQuestions: data.questions.length,
      })
      .returning();

    // Then create all questions
    const questionPromises = data.questions.map((q) =>
      db.insert(questions).values({
        roomId: room.id,
        type: q.type,
        question: q.question,
        options: q.type == "true_false" ? ["true", "false"] : q.options.filter((option)=>option!=""),
        answer: q.answer,
      })
    );

    await Promise.all(questionPromises);

    // Return success with room ID and redirect path
    return {
      success: true,
      roomId: room.id,
      redirectPath: "/teacher",
    };
  } catch (error) {
    console.error("Error creating quiz room:", error);
    return {
      success: false,
      error: "Failed to create quiz room",
    };
  }
}

// export type RoomWithQuestions = {
//   id: string;
//   name: string;
//   duration: number | null;
//   status: string;
//   owner: string;
//   restrictParticipants: boolean;
//   preventCopying: boolean;
//   randomizeQuestions: boolean;
//   showOneQuestionAtTime: boolean;
//   participantList: string[];
//   // numberOfQuestions: number;
//   questions: {
//     id: string;
//     type: string;
//     question: string;
//     options: string[];
//     answer: string | number;
//   }[];
//   created_at: Date;
// };

export async function getRooms(ownerId: string) {
  try {
    const allRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.owner, ownerId))
      .orderBy(rooms.created_at);
      

    return { success: true, rooms: allRooms };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { success: false, error: "Failed to fetch rooms" };
  }
}

export async function getRoomById(roomId: string) {
  try {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const roomQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.roomId, roomId));

    return {
      success: true,
      room: {
        ...room,
        questions: roomQuestions,
      },
    };
  } catch (error) {
    console.error("Error fetching room:", error);
    return { success: false, error: "Failed to fetch room" };
  }
}

export async function isRoomExists(roomName: string) {
  try {
    const existingRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.name, roomName.trim()));

    return {
      exists: existingRooms.length > 0,
      error: null,
      roomId: existingRooms.length > 0 ? existingRooms[0].id : null,
      roomStatus: existingRooms.length > 0 ? existingRooms[0].status : null,
    };
  } catch (error) {
    console.error("Error checking room existence:", error);
    return {
      exists: false,
      error: "Failed to check room existence",
    };
  }
}

export const getQuestions = async (roomId: string) => {
  if (!roomId) {
    return {
      success: false,
      message: "please profide room id",
    };
  }

  try {
    const questionsResponse = await db
      .select()
      .from(questions)
      .where(eq(questions.roomId, roomId));

    return {
      success: true,
      questionsResponse,
    };
  } catch (e) {
    return {
      success: false,
      message: "there is issue",
    };
  }
};

export const submitAnswer = async (
  participantId: string,
  questionId: string,
  answer: string | number,
  corectAnswer: number | string,
  roomid:string
) => {
  // Input validation
  if (!participantId || !questionId) {
    return {
      success: false,
      message: "Missing required parameters",
    };
  }

  // Validate answer type
  if (answer === undefined || answer === null) {
    return {
      success: false,
      message: "Please provide an answer",
    };
  }

  try {
    const existing = await db
      .select()
      .from(participants)
      .where(eq(participants.id, participantId))
      .then((rows) => rows[0]);

    if (!existing) {
      return {
        success: false,
        message: "Participant not found",
      };
    }

        const isRoomValid = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomid))
      .then((rows) => rows[0]);

      if(isRoomValid.status=="pause"){
        return {
        success: false,
        message: "This quiz is paused",
      };
      }
      if(isRoomValid.status=="finish"){
       redirect(`/student`);  
      }
      console.log(isRoomValid.status)

    const decision = typeof answer === "number" ? answer == corectAnswer : null;

    // Ensure answer is properly typed
    const typedAnswer = typeof answer === "number" ? answer.toString() : answer;

    // Merge with existing JSON options
    const newOptions = {
      ...(existing.options || {}),
      [questionId]: { option: typedAnswer, decision: decision },
    };


    await db
      .update(participants)
      .set({ options: newOptions, })
      .where(eq(participants.id, participantId));

    return {
      success: true,
      message: "Answer saved successfully",
    };
  } catch (e) {
    console.error("Error submitting answer:", e);
    return {
      success: false,
      message: "Failed to save answer. Please try again.",
    };
  }
};


export  const checkIfTheRoomExist=async(roomId:string)=>{
    try{
      const room=await db.select().from(rooms).where(eq(rooms.id,roomId))
      console.log(room)
      return{
        exist:room.length>0,
        message:"not exist",
        room:room[0]
      }
    }catch(e){
    console.log(e)
     return {
      exists:false,
      message:"there is issue"

      }
    }
  }





  export async function getRoomDetails(roomId: string,ownerId:string) {
    try {
      // Get room details
      const room = await db
        .select()
        .from(rooms)
        .where(and(eq(rooms.id, roomId),eq(rooms.owner,ownerId)))
        .then((res) => res[0]);
  
      if (!room) {
        throw new Error("Room not found");
      }
  
      // Get questions for the room
      const roomQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.roomId, roomId));
  
      // Get participants for the room
      const roomParticipants = await db
        .select()
        .from(participants)
        .where(eq(participants.roomId, roomId));    
  
      return {
        room,
        questions: roomQuestions,
        participants: roomParticipants,
      };
    } catch (error) {
      console.error("Error fetching room details:", error);
      throw error;
    }
  }


  export const changeRoomStatus=async(newStatus:string,roomId:string)=>{
    if(!newStatus||!roomId){
      return {success:false,message:"mssing required feld"};
    }
    const resualt=await db
    .update(rooms)
    .set({status:newStatus})
    .where(eq(rooms.id,roomId))
    return{
      success:true,
      message:"success full"
    }
  }


  
