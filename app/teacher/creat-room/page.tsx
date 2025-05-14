"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  X,
} from "lucide-react";
import { createQuizRoom, isRoomExists } from "@/app/actions/quiz";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

// Question type definitions
interface Question {
  type: "mcq" | "true_false" | "short_answer"; // Updated to match backend
  text: string;
  options?: string[];
  correctAnswer: string;
}

export default function CreateRoom() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomName, setRoomName] = useState("");
  const [duration, setDuration] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [restrictParticipants, setRestrictParticipants] = useState(false);
  const [preventCopying, setPreventCopying] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [showOneQuestionAtTime, setShowOneQuestionAtTime] = useState(true);
  const [participantList, setParticipantList] = useState("");
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Question form state
  const [mcqQuestion, setMcqQuestion] = useState("");
  const [mcqOptions, setMcqOptions] = useState(["", "", "", ""]);
  const [mcqCorrectAnswers, setMcqCorrectAnswers] = useState<number[]>([]);
  const [tfQuestion, setTfQuestion] = useState("");
  const [tfCorrectAnswer, setTfCorrectAnswer] = useState<number | null>(null);
  const [shortQuestion, setShortQuestion] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [activeQuestionTab, setActiveQuestionTab] = useState("mcq");

  // Add this state at the top of your component with other state declarations
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Add this loading state at the top with other state declarations
  const [isCreating, setIsCreating] = useState(false);
  const [isValidatingRoom, setIsValidatingRoom] = useState(false);

  const validateRoomName = async (name: string) => {
    // Reset error state
    setNameError("");
    setIsNameValid(false);
    setIsValidatingRoom(true);

    try {
      // Basic validation
      if (name.trim().length < 3) {
        setNameError("Room name must be at least 3 characters long");
        setIsNameValid(false);
        return false;
      }

      // Check if room exists
      const { exists, error } = await isRoomExists(name);

      if (error) {
        setNameError("Failed to validate room name. Please try again.");
        setIsNameValid(false);
        return false;
      }

      if (exists) {
        setNameError("A room with this name already exists");
        setIsNameValid(false);
        return false;
      }

      setIsNameValid(true);
      return true;
    } catch (error) {
      console.error("Error validating room name:", error);
      setNameError("An error occurred while validating the room name");
      setIsNameValid(false);
      return false;
    } finally {
      setIsValidatingRoom(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      // Validate room name before proceeding
      const isValid = await validateRoomName(roomName);
      if (!isValid) {
        setErrorMessage(
          "Please fix the room name validation errors before proceeding"
        );
        return;
      }
    }

    if (step === 2 && questions.length === 0) {
      setErrorMessage("Please add at least one question before proceeding");
      return;
    }

    // Clear any existing error when proceeding
    setErrorMessage("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSave = async () => {
    if (!user) {
      setErrorMessage("You must be logged in to create a room");
      return;
    }

    setIsCreating(true); // Start loading
    try {
      // Transform questions to match the expected format
      const formattedQuestions = questions.map((q) => ({
        type: q.type,
        question: q.text,
        options: q.options || [],
        answer: q.correctAnswer,
      }));

      const result = await createQuizRoom({
        roomName,
        duration,
        questions: formattedQuestions,
        owner: user.id,
        settings: {
          restrictParticipants,
          preventCopying,
          randomizeQuestions,
          showOneQuestionAtTime,
        },
        participantList: participantList.split("\n").filter((p) => p.trim()),
      });

      if (result.success) {
        setErrorMessage("");
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/teacher");
        }, 1500);
      } else {
        setErrorMessage(result.error || "Failed to create quiz room");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsCreating(false); // End loading
    }
  };

  // MCQ Question Handlers
  const handleAddMcqOption = () => {
    if (mcqOptions.length < 8) {
      setMcqOptions([...mcqOptions, ""]);
    } else {
      setErrorMessage("Maximum 8 options allowed");
    }
  };

  const handleRemoveMcqOption = (index: number) => {
    if (mcqOptions.length > 2) {
      const newOptions = [...mcqOptions];
      newOptions.splice(index, 1);
      setMcqOptions(newOptions);

      setMcqCorrectAnswers(
        mcqCorrectAnswers
          .filter((ansIndex) => ansIndex !== index)
          .map((ansIndex) => (ansIndex > index ? ansIndex - 1 : ansIndex))
      );
    } else {
      setErrorMessage("Minimum 2 options required");
    }
  };

  const handleMcqOptionChange = (index: number, value: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setMcqOptions(newOptions);
  };

  const handleMcqCorrectAnswerChange = (index: number, checked: boolean) => {
    if (checked) {
      setMcqCorrectAnswers([...mcqCorrectAnswers, index]);
    } else {
      setMcqCorrectAnswers(mcqCorrectAnswers.filter((i) => i !== index));
    }
  };

  // Add Question Handlers
  const addMcqQuestion = () => {
    if (!mcqQuestion.trim()) {
      setErrorMessage("Please enter a question");
      return;
    }

    if (mcqOptions.some((opt) => !opt.trim())) {
      setErrorMessage("All options must be filled");
      return;
    }

    if (mcqCorrectAnswers.length === 0) {
      setErrorMessage("Please select at least one correct answer");
      return;
    }

    // Convert indices to actual option text values and join with commas if multiple
    const correctAnswerText = mcqCorrectAnswers
      .map((index) => mcqOptions[index])
      .join(", ");

    const newQuestion: Question = {
      type: "mcq",
      text: mcqQuestion,
      options: mcqOptions,
      correctAnswer: correctAnswerText,
    };

    setQuestions([...questions, newQuestion]);

    // Reset form
    setMcqQuestion("");
    setMcqOptions(["", "", "", ""]);
    setMcqCorrectAnswers([]);
  };

  const addTrueFalseQuestion = () => {
    if (!tfQuestion.trim()) {
      setErrorMessage("Please enter a question");
      return;
    }

    if (tfCorrectAnswer === null) {
      setErrorMessage("Please select the correct answer");
      return;
    }

    // Store the actual "True" or "False" text instead of 0 or 1
    const correctAnswerText = tfCorrectAnswer === 0 ? "True" : "False";

    const newQuestion: Question = {
      type: "true_false",
      text: tfQuestion,
      correctAnswer: correctAnswerText,
    };

    setQuestions([...questions, newQuestion]);

    // Reset form
    setTfQuestion("");
    setTfCorrectAnswer(null);
  };

  const addShortAnswerQuestion = () => {
    if (!shortQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!shortAnswer.trim()) {
      toast.error("Please enter the correct answer");
      return;
    }

    const newQuestion: Question = {
      type: "short_answer",
      text: shortQuestion,
      correctAnswer: shortAnswer,
    };

    setQuestions([...questions, newQuestion]);

    // Reset form
    setShortQuestion("");
    setShortAnswer("");

    toast.success("Short answer question added");
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    toast.success("Question deleted");
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

      {/* Error and Success Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setErrorMessage("")}
                className="inline-flex text-red-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccessMessage("")}
                className="inline-flex text-green-400 hover:text-green-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              {/* Animated Loading Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Creating Quiz Room
                </h3>
                <p className="text-gray-500">
                  Please wait while we set up your quiz room...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="w-full space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    Preparing questions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Setting up room settings
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Finalizing configuration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="relative">
                <Input
                  id="room-name"
                  placeholder="Enter a unique room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className={!isNameValid ? "border-red-500" : ""}
                  disabled={isValidatingRoom}
                />
                {isValidatingRoom && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {!isNameValid && nameError && (
                <p className="text-red-500 text-sm">{nameError}</p>
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
              disabled={isCreating}
            >
              Continue to Questions
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Quiz Questions</CardTitle>
            <CardDescription>
              Create different types of questions for your quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Tabs
                defaultValue="mcq"
                value={activeQuestionTab}
                onValueChange={setActiveQuestionTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
                  <TabsTrigger value="truefalse">True/False</TabsTrigger>
                  <TabsTrigger value="shortanswer">Short Answer</TabsTrigger>
                </TabsList>

                <TabsContent value="mcq" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mcq-question">Question</Label>
                    <Textarea
                      id="mcq-question"
                      placeholder="Enter your multiple choice question"
                      value={mcqQuestion}
                      onChange={(e) => setMcqQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Options</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddMcqOption}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Option
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {mcqOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Checkbox
                            id={`mcq-option-${index}`}
                            checked={mcqCorrectAnswers.includes(index)}
                            onCheckedChange={(checked) =>
                              handleMcqCorrectAnswerChange(
                                index,
                                checked as boolean
                              )
                            }
                          />
                          <Input
                            value={option}
                            onChange={(e) =>
                              handleMcqOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMcqOption(index)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            disabled={mcqOptions.length <= 2}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500 mt-2">
                      ✓ Check the boxes next to the correct answer(s)
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={addMcqQuestion}
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                  >
                    Add Multiple Choice Question
                  </Button>
                </TabsContent>

                <TabsContent value="truefalse" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tf-question">Question</Label>
                    <Textarea
                      id="tf-question"
                      placeholder="Enter your true/false question"
                      value={tfQuestion}
                      onChange={(e) => setTfQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={tfCorrectAnswer?.toString()}
                      onValueChange={(value) =>
                        setTfCorrectAnswer(parseInt(value))
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="true" />
                        <Label htmlFor="true">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="false" />
                        <Label htmlFor="false">False</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="button"
                    onClick={addTrueFalseQuestion}
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                  >
                    Add True/False Question
                  </Button>
                </TabsContent>

                <TabsContent value="shortanswer" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="short-question">Question</Label>
                    <Textarea
                      id="short-question"
                      placeholder="Enter your short answer question"
                      value={shortQuestion}
                      onChange={(e) => setShortQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short-answer">Correct Answer</Label>
                    <Input
                      id="short-answer"
                      placeholder="Enter the correct answer"
                      value={shortAnswer}
                      onChange={(e) => setShortAnswer(e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addShortAnswerQuestion}
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                  >
                    Add Short Answer Question
                  </Button>
                </TabsContent>
              </Tabs>

              {questions.length > 0 && (
                <div className="mt-8 border rounded-lg bg-gray-50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Added Questions ({questions.length})
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      {questions.length}{" "}
                      {questions.length === 1 ? "Question" : "Questions"} Total
                    </Badge>
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                  {index + 1}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    question.type === "mcq"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : question.type === "true_false"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-orange-50 text-orange-700 border-orange-200"
                                  }
                                >
                                  {question.type === "mcq"
                                    ? "Multiple Choice"
                                    : question.type === "true_false"
                                    ? "True/False"
                                    : "Short Answer"}
                                </Badge>
                              </div>

                              <p className="text-gray-900 font-medium mb-2">
                                {question.text}
                              </p>

                              {question.type === "mcq" && question.options && (
                                <div className="ml-8 space-y-1.5">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                          
                                            question.correctAnswer === option
                                            ? "bg-green-100 border-2 border-green-500"
                                            : "bg-gray-100 border border-gray-300"
                                        }`}
                                      >
                                        {
                                          question.correctAnswer ===option && 
                                          <div className="w-2 h-2 rounded-full bg-green-500" />
                                        }
                                      </div>
                                      <span className="text-sm text-gray-600">
                                        {option}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {question.type === "true_false" && (
                                <div className="ml-8 flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-4 h-4 rounded-full ${
                                        question.correctAnswer === "True"
                                          ? "bg-green-100 border-2 border-green-500"
                                          : "bg-gray-100 border border-gray-300"
                                      }`}
                                    />
                                    <span className="text-sm text-gray-600">
                                      True
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-4 h-4 rounded-full ${
                                        question.correctAnswer === "False"
                                          ? "bg-green-100 border-2 border-green-500"
                                          : "bg-gray-100 border border-gray-300"
                                      }`}
                                    />
                                    <span className="text-sm text-gray-600">
                                      False
                                    </span>
                                  </div>
                                </div>
                              )}

                              {question.type === "short_answer" && (
                                <div className="ml-8 mt-2">
                                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 border border-green-200">
                                    <span className="text-sm text-green-700">
                                      Answer: {question.correctAnswer}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteQuestion(index)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {questions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Scroll to see all questions</span>
                        <span>{questions.length} questions added</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={questions.length === 0 || isCreating}
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
              disabled={isCreating}
            >
              {isCreating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Create Quiz Room
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}