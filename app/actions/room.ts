import { db } from '@/db/drizzle';
import { rooms, questions, participants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getRoomDetails(roomId: string) {
  try {
    // Get room details
    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .then((res) => res[0]);

    if (!room) {
      throw new Error('Room not found');
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
    console.error('Error fetching room details:', error);
    throw error;
  }
}
