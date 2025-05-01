"use client";
import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isRoomExists } from "../actions/quiz";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinQuiz() {
  const [error, setError] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomName) {
      setError("Please provide a room name");
      return;
    }

    try {
      setLoading(true);
      const { exists, error, roomId } = await isRoomExists(roomName.trim());

      if (!exists || !roomId) {
        setLoading(false);
        setError(
          "This room does not exist. Please check the room name and try again."
        );
        return;
      }
      if (error) {
        setLoading(false);
        setError("There was an issue checking the room. Please try again.");
        return;
      }

      // Only redirect if everything is successful
      setLoading(false);
      router.push(`/student/${roomId}/student-info`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div
          className="absolute top-1/3 right-1/4 opacity-5"
          style={{ animationDelay: "1s" }}
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 opacity-5"
          style={{ animationDelay: "2s" }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-900"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-4">
          <Link href="/">
            <div className="flex justify-center ">
              <Image src="/logo.svg" alt="logo" width={150} height={150} />
            </div>
          </Link>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-purple-900 text-center">
              {" "}
              Quiz Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="room-name"
                  className="block text-sm font-medium text-purple-800"
                >
                  Room Name
                </label>
                <Input
                  onChange={(e) => setRoomName(e.target.value)}
                  name="room-name"
                  id="room-name"
                  placeholder="Enter room name"
                  className="bg-white/80 border-purple-200"
                />
              </div>

              {error && (
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm text-center flex justify-center items-center">
                  {error}
                </div>
              )}

              <div className="relative w-full">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-6 w-6 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Joining...
                    </div>
                  ) : (
                    <>
                      Join Quiz{" "}
                      <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                    </>
                  )}
                </Button>
                {isLoading && (
                  <div className="absolute inset-0 bg-purple-600 opacity-50 rounded-md cursor-not-allowed"></div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
