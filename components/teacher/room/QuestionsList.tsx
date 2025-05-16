'use client';

import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuestionsListProps {
  questions: any[];
  onAddQuestion: () => void;
}

export function QuestionsList({
  questions,
  onAddQuestion,
}: QuestionsListProps) {
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-900">
          Quiz Questions
        </h2>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={onAddQuestion}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <Card
              key={question.id}
              className="bg-white/90 backdrop-blur-sm border-purple-100 p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium mr-2',
                          question.type === 'multiple-choice'
                            ? 'bg-indigo-100 text-indigo-800'
                            : question.type === 'true-false'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                        )}
                      >
                        {question.type}
                      </span>
                    </div>
                    <h3 className="text-purple-900 font-medium">
                      {question.question}
                    </h3>

                    {question.type !== 'short-answer' &&
                      Array.isArray(question.options) && (
                        <div className="mt-2 space-y-1">
                          {question.options?.map(
                            (option: any, optIndex: number) => (
                              <div key={optIndex} className="flex items-center">
                                {JSON.stringify(option) ===
                                JSON.stringify(question.answer) ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                )}
                                <span
                                  className={cn(
                                    'text-purple-800',
                                    JSON.stringify(option) ===
                                      JSON.stringify(question.answer) &&
                                      'text-green-800 font-medium'
                                  )}
                                >
                                  {typeof option === 'object'
                                    ? JSON.stringify(option)
                                    : option}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {question.type === 'short-answer' && (
                      <div className="mt-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            {typeof question.answer === 'object'
                              ? JSON.stringify(question.answer)
                              : question.answer}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-purple-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-white/70 rounded-lg border border-purple-100">
            <p className="text-purple-700 mb-4">
              No questions have been added to this quiz yet.
            </p>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={onAddQuestion}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
