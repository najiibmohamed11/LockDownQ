"use server";
import { participants } from "@/app/db/schema";
import { db } from "../db/drizzle";
import { redirect } from "next/navigation";

export const CreatParticipent = async (name: string,roomId:string) => {
  try {
    if (!name || name.trim() === "") {
      throw new Error("Name is required");
    }

    const participant = await db
      .insert(participants)
      .values({
        name: name.trim(),
        roomId:roomId,
        
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
