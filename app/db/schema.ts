import {
  text,
  boolean,
  pgTable,
  varchar,
  uuid,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { number } from "framer-motion";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  duration: integer("duration"),
  status: varchar("status", { length: 50 }).default("draft"),
  owner: varchar("owner").notNull(),
  restrictParticipants: boolean("restrict_participants").default(false),
  preventCopying: boolean("prevent_copying").default(true),
  randomizeQuestions: boolean("randomize_questions").default(true),
  showOneQuestionAtTime: boolean("show_one_question_at_time").default(true),
  participantList: jsonb("participant_list").default([]),
  numberOfQuestions:integer("numberOfQuestions"),
  ...timestamps,
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  roomId: uuid("room_id")
    .references(() => rooms.id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").default([]),
  answer: jsonb("answer").notNull(),
  ...timestamps,
});



export const participants=pgTable('participants',{
  id:uuid("id").defaultRandom().primaryKey(),
  roomId:uuid("room_id").references(()=>rooms.id),
  name:varchar("name"),
  options: jsonb("options").default({}),
  progress:integer("progress").default(0)
})