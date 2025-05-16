'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  CheckIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { useToast } from '@/components/ui/use-toast';
import { updateShortAnswerDecision } from '@/app/actions/participants';

interface data {
  name: string;
  score: string;
}

export default function ParticipantsTab({ questions, participantsProp }) {
  const [expandedParticipant, setExpandedParticipant] = useState(null);
  const [updatingDecision, setUpdatingDecision] = useState<{
    participantId: string;
    questionId: string;
  } | null>(null);
  const [participants, setParticipants] = useState(participantsProp);
  const { toast } = useToast();

  // Function to calculate student's score percentage
  const calculateScore = (participant) => {
    if (!participant.options || Object.keys(participant.options).length === 0)
      return 0;

    const correctAnswers = Object.values(participant.options).filter(
      (answer) => answer.decision === true
    ).length;

    return Math.round((correctAnswers / questions.length) * 100);
  };

  // Function to get correct/incorrect status for each question
  const getAnswerStatus = (participant, questionId) => {
    if (!participant?.options || !participant.options[questionId]) {
      return { answered: false };
    }

    return {
      answered: true,
      isCorrect: participant.options[questionId].decision === true,
      isPending: participant.options[questionId].decision === 'pending',
      option: participant.options[questionId].option,
    };
  };

  // Function to handle teacher decision on short answer
  const handleShortAnswerDecision = async (
    participantId,
    questionId,
    decision
  ) => {
    try {
      setUpdatingDecision({ participantId, questionId });

      const result = await updateShortAnswerDecision(
        participantId,
        questionId,
        decision
      );

      if (result.success) {
        toast({
          title: 'Decision updated',
          description: result.message,
          variant: 'default',
        });

        setParticipants((prev) =>
          prev.map((participant) => {
            if (participant.id == participantId) {
              return {
                ...participant,
                options: {
                  ...participant.options,
                  [questionId]: {
                    ...participant.options[questionId],
                    decision: decision,
                  },
                },
              };
            }
            return participant;
          })
        );

        // You might need to add a setState here if participants is a local state
        // or handle the server refresh differently based on your app architecture
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update decision',
        variant: 'destructive',
      });
    } finally {
      setUpdatingDecision(null);
    }
  };
  console.log(participants);

  function exportToExcel() {
    const data: data[] = [];
    participants.map((participant: any) => {
      data.push({
        name: participant.name,
        score: `${calculateScore(participant)}%`,
      });
    });
    if (data.length == 0) {
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `ca211.xlsx`);
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
      <div className="p-4 border-b border-purple-100 flex justify-between items-center">
        <h3 className="text-lg font-medium text-purple-900">
          Student Performance
        </h3>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-200 flex items-center gap-2 px-4 py-2 h-10 shadow-sm hover:shadow"
          onClick={exportToExcel}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Download as Excel</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="text-left p-4 text-purple-800 font-medium min-w-[250px]">
                NAME
              </th>
              <th className="text-left p-4 text-purple-800 font-medium">
                SCORE
              </th>
              {questions.map((question, index) => (
                <th
                  key={question.id}
                  className="p-3 text-purple-800 font-medium text-center w-20"
                >
                  <button
                    className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors flex items-center justify-center font-medium"
                    title={question.question}
                  >
                    q{index + 1}
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
                <React.Fragment key={student.id}>
                  <tr
                    className={cn(
                      'border-b border-purple-50 hover:bg-purple-50/50',
                      expandedParticipant === student.id && 'bg-purple-50/70'
                    )}
                  >
                    <td className="p-4 text-purple-900 font-medium flex items-center min-w-[200px]">
                      {student.name || 'Anonymous'}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-sm font-medium',
                          calculateScore(student) >= 80
                            ? 'bg-green-100 text-green-800'
                            : calculateScore(student) >= 50
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {calculateScore(student)}%
                      </span>
                    </td>
                    {questions.map((question) => {
                      const status = getAnswerStatus(student, question.id);
                      return (
                        <td
                          key={`${student.id}-${question.id}`}
                          className="p-2 text-center"
                        >
                          {status.answered ? (
                            <div
                              className={cn(
                                'rounded-md p-2 flex flex-col items-center justify-center',
                                question.type === 'short_answer' &&
                                  status.isPending
                                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                  : status.isCorrect
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                              )}
                            >
                              {/* Answer text */}
                              <div className="text-xs font-medium mb-1 max-w-xs truncate">
                                {status.option}
                              </div>

                              {/* Decision indicators or buttons */}
                              {question.type === 'short_answer' &&
                              status.isPending ? (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                                    onClick={() =>
                                      handleShortAnswerDecision(
                                        student.id,
                                        question.id,
                                        true
                                      )
                                    }
                                    disabled={
                                      updatingDecision?.participantId ===
                                        student.id &&
                                      updatingDecision?.questionId ===
                                        question.id
                                    }
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700"
                                    onClick={() =>
                                      handleShortAnswerDecision(
                                        student.id,
                                        question.id,
                                        false
                                      )
                                    }
                                    disabled={
                                      updatingDecision?.participantId ===
                                        student.id &&
                                      updatingDecision?.questionId ===
                                        question.id
                                    }
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : question.type !== 'short_answer' ? (
                                status.isCorrect ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )
                              ) : status.isCorrect ? (
                                <div className="flex items-center text-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Approved</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-700">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Rejected</span>
                                </div>
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
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={questions.length + 3}
                  className="p-4 text-center text-purple-700"
                >
                  No participants have joined this room yet.
                </td>
              </tr>
            )}
            {participants.length > 0 && (
              <tr className="bg-purple-50/70">
                <td className="p-4 text-purple-900 font-medium">
                  Class Average
                </td>
                <td className="p-4 text-purple-900 font-medium">
                  {participants.length > 0
                    ? Math.round(
                        participants.reduce(
                          (acc, student) => acc + calculateScore(student),
                          0
                        ) / participants.length
                      )
                    : 0}
                  %
                </td>
                {questions.map((question) => (
                  <td
                    key={`avg-${question.id}`}
                    className="p-4 text-center text-purple-900 font-medium"
                  >
                    <div className="flex justify-center">
                      {participants.length > 0
                        ? `${Math.round(
                            (participants.filter(
                              (s) =>
                                s.options &&
                                s.options[question.id] &&
                                s.options[question.id].decision === true
                            ).length /
                              participants.length) *
                              100
                          )}%`
                        : '-'}
                    </div>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
