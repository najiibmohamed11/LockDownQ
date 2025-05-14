"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { checkIfTheRoomExist, getQuestions, submitAnswer } from "@/app/actions/quiz";
import { QuizResults } from "@/app/student/quiz/QuizResults";
import QuizSkeleton from "./quizSkeleton";
import QuizWaiting from "./QuizWaiting";

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  userAnswer?: string;
}

export default function QuizApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pastquestions, setPastquestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(
    null
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkRoom = async () => {
      const { exist, message, room } = await checkIfTheRoomExist(
        pathname.split("/")[3]
      );
      console.log(message);

      if (!exist) {
        router.push(`/student`);
        return;
      }

      if (room?.status === "finish") {
        router.push(`/student/${pathname.split("/")[3]}/student-info`);
        return;
      }
      if (room?.status === "pause") {
        setError("This quiz is paused");
        return;
      }
    };
    checkRoom();
  }, [pathname, router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const roomId = pathname.split("/")[3];
        const userId = pathname.split("/")[4];
        if (!roomId) {
          setError("Invalid room ID");
          return;
        }

        const {
          success,
          message,
          questionsResponse,
          progressLength,
          pastQuestions,
        } = await getQuestions(roomId, userId);
        if (!success) {
          setError(message || "Failed to fetch questions");
          return;
        }
        if (!questionsResponse || !Array.isArray(questionsResponse)) {
          setError("Invalid questions data");
          return;
        }
        // Type assertion to handle the database response
        const typedQuestions = questionsResponse.map((q, index) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
        })) as Question[];
        console.log(typedQuestions);

        if (typedQuestions.length === 0) {
          setQuestions(pastQuestions);
          setShowResults(true);
          return;
        }

        setQuestions(shuffle(typedQuestions));
        setProgress(progressLength);
        setPastquestions(pastQuestions);
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [pathname]);

  function shuffle(array: Question[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleAnswerSelect = (answer: string | number) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) {
      setError("Please select an answer");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const studentId = pathname.split("/")[4];
      const questionId = questions[currentQuestion].id;

      if (!studentId || !questionId) {
        setError("Invalid student or question ID");
        return;
      }

      // Get the selected answer text if it's an MCQ or T/F question
      const currentQ = questions[currentQuestion];
      const answerValue =
        currentQ.type === "short_answer"
          ? selectedAnswer.toString()
          : typeof selectedAnswer === "number"
          ? currentQ.options[selectedAnswer] // Convert index to option text
          : selectedAnswer.toString();

      // Update the question with user's answer
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[currentQuestion] = {
          ...newQuestions[currentQuestion],
          userAnswer: answerValue,
        };
        return newQuestions;
      });

      const { success, message } = await submitAnswer(
        studentId,
        questionId,
        answerValue,
        questions[currentQuestion].answer,
        pathname.split("/")[3]
      );

      if (!success) {
        setError(message || "Failed to save answer");
        return;
      }

      setIsAnswered(false);
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz is finished, show results
        setShowResults(true);
        setQuestions((prev) => [...prev, ...pastquestions]);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error submitting answer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error == "This quiz is paused") {
    return <QuizWaiting />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (questions.length === 0) {
    return <QuizSkeleton />;
  }

  const currentQ = questions[currentQuestion];

  return (
    <>
      {!showResults ? (
        <div className="w-full max-w-2xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl shadow-lg overflow-hidden border w-full"
            >
              <div className="p-4 sm:p-8">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-secondary rounded-full text-secondary-foreground text-sm sm:text-base font-medium">
                    Question {currentQuestion + progress + 1}/
                    {questions.length + progress}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 break-words whitespace-pre-wrap">
                  {currentQ.question || ""}
                </h2>

                <div className="grid gap-3 sm:gap-4">
                  {currentQ.type === "short_answer" ? (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isAnswered}
                      className="w-full"
                    >
                      <input
                        onChange={(e) => handleAnswerSelect(e.target.value)}
                        placeholder="Enter your answer here"
                        className="relative p-4 sm:p-6 w-full rounded-xl text-left font-medium transition-all duration-200 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-2 text-sm sm:text-base"
                      />
                    </motion.button>
                  ) : (
                    currentQ.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={cn(
                          "relative p-4 sm:p-6 rounded-xl text-left font-medium transition-all duration-200 w-full",
                          selectedAnswer === index
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                          "border-2 text-sm sm:text-base"
                        )}
                        disabled={isAnswered}
                      >
                        <div className="flex items-center justify-between break-words whitespace-pre-wrap">
                          <span>{option}</span>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-secondary flex justify-between items-center">
                <Button
                  onClick={handleNextQuestion}
                  className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  disabled={isLoading || selectedAnswer === null}
                >
                  {isLoading
                    ? "Saving..."
                    : currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <QuizResults questions={questions} />
      )}
    </>
  );
}
