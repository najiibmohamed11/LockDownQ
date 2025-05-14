"use server";
import { participants } from "@/app/db/schema";
import { db } from "../db/drizzle";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

// Define proper types for participant options
type AnswerOption = {
  option: string;
  decision: boolean | "pending";
};

type ParticipantOptions = {
  [questionId: string]: AnswerOption;
};

export const CreatParticipent = async (name: string, roomId: string) => {
  try {
    if (!name || name.trim() === "") {
      throw new Error("Name is required");
    }

    const participant = await db
      .insert(participants)
      .values({
        name: name.trim(),
        roomId: roomId,
      })
      .returning();

    return {
      success: true,
      data: participant[0],
    };
  } catch (error) {
    console.error("Error creating participant:", error);
    throw new Error("Failed to create participant. Please try again.");
  }
};

/**
 * Update the decision for a student's short answer
 * @param participantId The ID of the participant
 * @param questionId The ID of the question
 * @param decision The teacher's decision (true, false)
 */
export const updateShortAnswerDecision = async (
  participantId: string,
  questionId: string,
  decision: boolean
) => {
  try {
    // Get the current participant data
    const participant = await db
      .select()
      .from(participants)
      .where(eq(participants.id, participantId))
      .then((rows) => rows[0]);

    if (!participant) {
      return {
        success: false,
        message: "Participant not found",
      };
    }

    // Make sure the question answer exists
    const options = (participant.options as ParticipantOptions) || {};
    if (!options[questionId]) {
      return {
        success: false,
        message: "Answer not found for this question",
      };
    }

    // Keep the original answer but update the decision
    const updatedOptions = {
      ...options,
      [questionId]: {
        ...options[questionId],
        decision: decision,
      },
    };

    // Update the database
    await db
      .update(participants)
      .set({ options: updatedOptions })
      .where(eq(participants.id, participantId));

    return {
      success: true,
      message: "Decision updated successfully",
    };
  } catch (error) {
    console.error("Error updating decision:", error);
    return {
      success: false,
      message: "Failed to update decision",
    };
  }
};
