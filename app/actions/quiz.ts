"use server";

import { db } from "@/app/db/drizzle";
import { rooms, questions } from "@/app/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

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
      })
      .returning();

    // Then create all questions
    const questionPromises = data.questions.map((q) =>
      db.insert(questions).values({
        roomId: room.id,
        type: q.type,
        question: q.question,
        options: q.type == "true_false" ? ["true", "false"] : q.options,
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

export type RoomWithQuestions = {
  id: string;
  name: string;
  duration: number | null;
  status: string;
  owner: string;
  restrictParticipants: boolean;
  preventCopying: boolean;
  randomizeQuestions: boolean;
  showOneQuestionAtTime: boolean;
  participantList: string[];
  // numberOfQuestions: number;
  questions: {
    id: string;
    type: string;
    question: string;
    options: string[];
    answer: string | number;
  }[];
  created_at: Date;
};

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
    };
  } catch (error) {
    console.error("Error checking room existence:", error);
    return {
      exists: false,
      error: "Failed to check room existence",
    };
  }
}