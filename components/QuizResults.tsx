"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  userAnswer?: string;
  decision?: boolean | "pending";
}

interface QuizResultsProps {
  questions: Question[];
}

export function QuizResults({ questions }: QuizResultsProps) {
  // Calculate statistics
  console.log(questions);
  const totalQuestions = questions.length;
  const autoGradedQuestions = questions.filter(
    (q) => q.type !== "short_answer"
  );
  const shortAnswerQuestions = questions.filter(
    (q) => q.type === "short_answer"
  );

  // For short answers, separate pending from graded ones
  const pendingShortAnswers = shortAnswerQuestions.filter(
    (q) => q.decision === "pending" || q.decision === undefined
  );

  const gradedShortAnswers = shortAnswerQuestions.filter(
    (q) => q.decision === true || q.decision === false
  );

  // For correct answers, we now do a direct string comparison
  const correctAnswers = [
    ...autoGradedQuestions.filter((q) => {
      if (q.userAnswer === undefined) return false;
      return q.userAnswer === q.answer;
    }),
    ...gradedShortAnswers.filter((q) => q.decision === true),
  ].length;

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Multiple Choice";
      case "true_false":
        return "True/False";
      case "short_answer":
        return "Written Answer";
      default:
        return "Question";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto p-4"
    >
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto-graded Section */}
            {autoGradedQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 p-4 rounded-lg border border-green-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Auto-graded Questions
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-600">
                    {correctAnswers}/{autoGradedQuestions.length}
                  </p>
                  <p className="text-sm text-green-700">
                    Correctly Answered Questions
                  </p>
                  <p className="text-sm text-green-700">
                    {Math.round(
                      (correctAnswers / autoGradedQuestions.length) * 100
                    )}
                    % Accuracy
                  </p>
                </div>
              </motion.div>
            )}

            {/* Short Answer Section */}
            {shortAnswerQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 p-4 rounded-lg border border-yellow-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Written Answers
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-yellow-600">
                    {shortAnswerQuestions.length}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Questions Pending Review
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your answers will be reviewed by your teacher
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Questions Review */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              Question Review
            </h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {q.type === "short_answer" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
                      ) : q.userAnswer === q.answer ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            Question {index + 1}
                          </span>
                          <span className="text-sm font-medium text-primary">
                            ({getQuestionTypeLabel(q.type)})
                          </span>
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          {q.question}
                        </p>
                      </div>

                      {q.type !== "short_answer" && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Your Answer:
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                q.userAnswer === q.answer
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {q.userAnswer}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Correct Answer:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {q.answer}
                            </span>
                          </div>
                        </div>
                      )}

                      {q.type === "short_answer" && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Your Answer:
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                q.decision === true
                                  ? "text-green-600"
                                  : q.decision === false
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {q.userAnswer}
                            </span>
                          </div>
                          {q.decision === "pending" ||
                          q.decision === undefined ? (
                            <p className="text-sm text-yellow-600 italic">
                              This answer is pending review by your teacher
                            </p>
                          ) : q.decision === true ? (
                            <p className="text-sm text-green-600 italic">
                              Your answer has been approved by the teacher
                            </p>
                          ) : (
                            <p className="text-sm text-red-600 italic">
                              Your answer has been marked as incorrect by the
                              teacher
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}