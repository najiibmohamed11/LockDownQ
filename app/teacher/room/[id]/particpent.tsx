"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ParticipantsTab({ questions, participants }) {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [expandedParticipant, setExpandedParticipant] = useState(null);
  const [viewMode, setViewMode] = useState("questions");

  // Function to calculate student's score percentage
  const calculateScore = (participant) => {
    if (!participant.options || Object.keys(participant.options).length === 0) return 0;
    
    const correctAnswers = Object.values(participant.options).filter(
      answer => answer.decision === true
    ).length;
    
    return Math.round((correctAnswers / Object.keys(participant.options).length) * 100);
  };

  // Function to get correct/incorrect status for each question
  const getAnswerStatus = (participant, questionId) => {
    if (!participant?.options || !participant.options[questionId]) {
      return { answered: false };
    }
    
    return {
      answered: true,
      isCorrect: participant.options[questionId].decision === true,
      option: participant.options[questionId].option
    };
  };

  // Toggle expanded view for a participant
  const toggleExpandParticipant = (participantId) => {
    if (expandedParticipant === participantId) {
      setExpandedParticipant(null);
    } else {
      setExpandedParticipant(participantId);
    }
  };

  // Show detailed view of a participant's answers
  const showParticipantDetails = (participant) => {
    setSelectedParticipant(participant);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
      <div className="p-4 border-b border-purple-100 flex justify-between items-center">
        <h3 className="text-lg font-medium text-purple-900">Student Performance</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-700">View by:</span>
          <div className="bg-purple-50 rounded-lg p-1 flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                viewMode === "questions" ? "bg-white rounded-md shadow-sm text-purple-900" : "text-purple-700"
              )}
              onClick={() => setViewMode("questions")}
            >
              Questions
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                viewMode === "students" ? "bg-white rounded-md shadow-sm text-purple-900" : "text-purple-700"
              )}
              onClick={() => setViewMode("students")}
            >
              Students
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
            <th className="text-left p-4 text-purple-800 font-medium min-w-[250px]">NAME</th>
            <th className="text-left p-4 text-purple-800 font-medium">SCORE</th>
              {questions.map((question, index) => (
                <th key={question.id} className="p-3 text-purple-800 font-medium text-center w-20">
                  <button
                    className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors flex items-center justify-center font-medium"
                    title={question.question}
                  >
                    {index + 1}
                  </button>
                </th>
              ))}
              <th className="p-3 text-purple-800 font-medium text-center w-20">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((student) => (
                <>
                  <tr 
                    key={student.id} 
                    className={cn(
                      "border-b border-purple-50 hover:bg-purple-50/50",
                      expandedParticipant === student.id && "bg-purple-50/70"
                    )}
                  >
              <td className="p-4 text-purple-900 font-medium flex items-center min-w-[200px]">
              {student.name || "Anonymous"}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-sm font-medium",
                          calculateScore(student) >= 80
                            ? "bg-green-100 text-green-800"
                            : calculateScore(student) >= 50
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-amber-100 text-amber-800",
                        )}
                      >
                        {calculateScore(student)}%
                      </span>
                    </td>
                    {questions.map((question) => {
                      const status = getAnswerStatus(student, question.id);
                      return (
                        <td key={`${student.id}-${question.id}`} className="p-2 text-center">
                          {status.answered ? (
                            <div className={`${status.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-md p-2 flex items-center justify-center`}>
                              {status.isCorrect ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-100 rounded-md p-2 text-gray-400 flex items-center justify-center">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-700"
                        onClick={() => showParticipantDetails(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
      
                </>
              ))
            ) : (
              <tr>
                <td colSpan={questions.length + 3} className="p-4 text-center text-purple-700">
                  No participants have joined this room yet.
                </td>
              </tr>
            )}
            {participants.length > 0 && (
              <tr className="bg-purple-50/70">
                <td className="p-4 text-purple-900 font-medium">Class Average</td>
                <td className="p-4 text-purple-900 font-medium">
                  {participants.length > 0
                    ? Math.round(
                        participants.reduce((acc, student) => acc + calculateScore(student), 0) /
                        participants.length
                      )
                    : 0}%
                </td>
                {questions.map((question) => (
                  <td key={`avg-${question.id}`} className="p-4 text-center text-purple-900 font-medium">
                    <div className="flex justify-center">
                      {participants.length > 0 ? (
                        `${Math.round(
                          (participants.filter(s => 
                            s.options && 
                            s.options[question.id] && 
                            s.options[question.id].decision === true
                          ).length / participants.length) * 100
                        )}%`
                      ) : "-"}
                    </div>
                  </td>
                ))}
                <td className="p-4 text-center text-purple-900 font-medium">
                  -
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">
                {selectedParticipant.name}'s Performance
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-700"
                onClick={() => setSelectedParticipant(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
            
            <div className="mb-6 flex items-center justify-between bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="mr-6">
                  <h3 className="text-sm text-purple-700">Overall Score</h3>
                  <div className="text-3xl font-bold text-purple-900">
                    {calculateScore(selectedParticipant)}%
                  </div>
                </div>
                <div className="mr-6">
                  <h3 className="text-sm text-purple-700">Questions Answered</h3>
                  <div className="text-3xl font-bold text-purple-900">
                    {selectedParticipant.options ? Object.keys(selectedParticipant.options).length : 0} / {questions.length}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-purple-700">Correct Answers</h3>
                  <div className="text-3xl font-bold text-purple-900">
                    {selectedParticipant.options ? 
                      Object.values(selectedParticipant.options).filter(a => a.decision === true).length : 0} / {
                      selectedParticipant.options ? Object.keys(selectedParticipant.options).length : 0
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-purple-900 mb-2">Question by Question</h3>
              
              {questions.map((question, idx) => {
                const status = getAnswerStatus(selectedParticipant, question.id);
                return (
                  <Card key={question.id} className="bg-white border-purple-100 p-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium mr-2",
                              question.type === "multiple-choice"
                                ? "bg-indigo-100 text-indigo-800"
                                : question.type === "true-false"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800",
                            )}
                          >
                            {question.type}
                          </span>
                          {status.answered && (
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                status.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              )}
                            >
                              {status.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-purple-900 font-medium">{question.question}</h3>

                        {status.answered ? (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-1 gap-2 mt-2">
                              {question.type !== "short-answer" && Array.isArray(question.options) && (
                                <>
                                {question.options.map((option, optIndex) => {
                                  const isSelected = status.option === String(optIndex);
                                  const isCorrect = JSON.stringify(option) === JSON.stringify(question.answer);
                                  
                                  return (
                                    <div 
                                      key={optIndex}
                                      className={cn(
                                        "p-3 rounded-lg border flex items-center",
                                        isSelected ? 
                                          (isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300") :
                                          isCorrect ? "bg-green-50/30 border-green-200" : "border-gray-200"
                                      )}
                                    >
                                      {isSelected ? (
                                        isCorrect ? (
                                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                        ) : (
                                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                        )
                                      ) : (
                                        isCorrect && (
                                          <CheckCircle className="h-5 w-5 text-green-600/60 mr-2" />
                                        )
                                      )}
                                      
                                      <span
                                        className={cn(
                                          isSelected ? 
                                            (isCorrect ? "text-green-800 font-medium" : "text-red-800 font-medium") :
                                            isCorrect ? "text-green-700" : "text-gray-800"
                                        )}
                                      >
                                        {typeof option === 'object' ? JSON.stringify(option) : option}
                                      </span>
                                    </div>
                                  );
                                })}
                                </>
                              )}
                              
                              {question.type === "short-answer" && (
                                <div className="space-y-2">
                                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                                    <div className="text-sm text-purple-700 mb-1">Student's answer:</div>
                                    <div className="font-medium text-purple-900">{status.option}</div>
                                  </div>
                                  <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                                    <div className="text-sm text-green-700 mb-1">Correct answer:</div>
                                    <div className="font-medium text-green-900">
                                      {typeof question.answer === 'object' 
                                        ? JSON.stringify(question.answer) 
                                        : question.answer}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                            No answer provided for this question
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-purple-100 mt-6">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-700 hover:bg-purple-100"
                onClick={() => setSelectedParticipant(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}