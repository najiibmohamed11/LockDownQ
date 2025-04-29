"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  FileUp,
  Lock,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  AlignJustify,
  ArrowLeft,
} from "lucide-react";
import { createQuizRoom } from "@/app/actions/quiz";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function CreateRoom() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([
    { id: 1, type: "mcq", question: "", options: ["", "", "", ""], answer: 0 },
  ]);
  const [roomName, setRoomName] = useState("");
  const [duration, setDuration] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [restrictParticipants, setRestrictParticipants] = useState(false);
  const [preventCopying, setPreventCopying] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [showOneQuestionAtTime, setShowOneQuestionAtTime] = useState(true);
  const [participantList, setParticipantList] = useState("");
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      question: "",
      options: type === "mcq" ? ["", "", "", ""] : [],
      answer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const validateRoomName = (name: string) => {
    // Simple validation - ensure name is not empty and at least 3 characters
    const valid = name.trim().length >= 3;
    setIsNameValid(valid);
    return valid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateRoomName(roomName)) return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSave = async () => {
    if(!user){
      return;
    }
    try {
      const result = await createQuizRoom({
        roomName,
        duration,
        questions,
        owner:user.id,
        settings: {
          restrictParticipants,
          preventCopying,
          randomizeQuestions,
          showOneQuestionAtTime,
        },
        participantList: participantList.split("\n").filter((p) => p.trim()),
      });

      if (result.success) {
        toast.success("Quiz room created successfully!");
      } else {
        toast.error(result.error || "Failed to create quiz room");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-purple-800">
          Create New Quiz Room
        </h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 ${
                step >= 2 ? "bg-purple-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-16 ${
                step >= 3 ? "bg-purple-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {step === 1
              ? "Basic Info"
              : step === 2
              ? "Questions"
              : "Settings & Participants"}
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Room Details</CardTitle>
            <CardDescription>
              Set the basic information for your quiz room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="room-name">
                Room Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="room-name"
                placeholder="Enter a unique room name"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  validateRoomName(e.target.value);
                }}
                className={!isNameValid ? "border-red-500" : ""}
              />
              {!isNameValid && (
                <p className="text-red-500 text-sm">
                  Room name must be at least 3 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Duration (minutes, optional)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue to Questions
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Questions</CardTitle>
            <CardDescription>
              Add multiple-choice, true/false, or short answer questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg relative mt-2"
                  >
                    <div className="absolute -top-3 left-4 bg-white px-2">
                      <Badge variant="outline" className="bg-purple-50">
                        Question {index + 1}
                      </Badge>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(question.id, "type", value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="short_answer">
                            Short Answer
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`question-${question.id}`}>
                          Question
                        </Label>
                        <Textarea
                          id={`question-${question.id}`}
                          placeholder="Enter your question here"
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "question",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>

                      {question.type === "mcq" && (
                        <div className="space-y-3">
                          <Label>Options</Label>
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-2"
                            >
                              <RadioGroup
                                value={String(question.answer)}
                                onValueChange={(value) =>
                                  updateQuestion(
                                    question.id,
                                    "answer",
                                    Number.parseInt(value)
                                  )
                                }
                                className="flex items-center"
                              >
                                <RadioGroupItem
                                  value={String(optIndex)}
                                  id={`q${question.id}-opt${optIndex}`}
                                />
                              </RadioGroup>
                              <Input
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    question.id,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "true_false" && (
                        <div className="space-y-3">
                          <Label>Answer</Label>
                          <RadioGroup
                            value={String(question.answer)}
                            onValueChange={(value) =>
                              updateQuestion(
                                question.id,
                                "answer",
                                Number.parseInt(value)
                              )
                            }
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="0"
                                id={`q${question.id}-true`}
                              />
                              <Label htmlFor={`q${question.id}-true`}>
                                True
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="1"
                                id={`q${question.id}-false`}
                              />
                              <Label htmlFor={`q${question.id}-false`}>
                                False
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {question.type === "short_answer" && (
                        <div className="space-y-2">
                          <Label htmlFor={`answer-${question.id}`}>
                            Correct Answer
                          </Label>
                          <Input
                            id={`answer-${question.id}`}
                            placeholder="Enter the correct answer"
                            value={question.answer as any}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "answer",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => addQuestion("mcq")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Multiple Choice
              </Button>
              <Button
                variant="outline"
                onClick={() => addQuestion("true_false")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add True/False
              </Button>
              <Button
                variant="outline"
                onClick={() => addQuestion("short_answer")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Short Answer
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue to Settings
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Settings & Participants</CardTitle>
            <CardDescription>
              Configure quiz settings and manage participant access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" /> Quiz Settings
                </TabsTrigger>
                <TabsTrigger
                  value="participants"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" /> Participants
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-copying">
                        Prevent Text Copying
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Disable copy-paste functionality during the quiz
                      </p>
                    </div>
                    <Switch
                      id="prevent-copying"
                      checked={preventCopying}
                      onCheckedChange={setPreventCopying}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="randomize-questions">
                        Randomize Questions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show questions in random order for each participant
                      </p>
                    </div>
                    <Switch
                      id="randomize-questions"
                      checked={randomizeQuestions}
                      onCheckedChange={setRandomizeQuestions}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="one-question">
                        One Question at a Time
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show only one question at a time, no going back
                      </p>
                    </div>
                    <Switch
                      id="one-question"
                      checked={showOneQuestionAtTime}
                      onCheckedChange={setShowOneQuestionAtTime}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="restrict-participants">
                        Restrict Participants
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Only allow listed participants to join
                      </p>
                    </div>
                    <Switch
                      id="restrict-participants"
                      checked={restrictParticipants}
                      onCheckedChange={setRestrictParticipants}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="participants" className="pt-4">
                <div className="space-y-4">
                  <div
                    className={
                      restrictParticipants
                        ? ""
                        : "opacity-50 pointer-events-none"
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-purple-600" />
                      <Label>Participant List</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enter one participant per line with their unique
                      identifier (student ID, email, etc.)
                    </p>
                    <Textarea
                      placeholder="e.g., 
John Doe, 12345
Jane Smith, 67890"
                      rows={8}
                      value={participantList}
                      onChange={(e) => setParticipantList(e.target.value)}
                      disabled={!restrictParticipants}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={!restrictParticipants}
                      >
                        <FileUp className="h-4 w-4" /> Import CSV
                      </Button>
                    </div>
                  </div>

                  {!restrictParticipants && (
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-start gap-3">
                      <div className="text-yellow-600 mt-0.5">
                        <AlignJustify className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Open Access Mode
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Anyone with the room link can join this quiz. Enable
                          "Restrict Participants" for more control.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" /> Create Quiz Room
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
