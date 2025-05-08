"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ChevronRight, Eye, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";


interface data{
  name:string
  score:string
}

export default function ParticipantsTab({ questions, participants }) {
  const [expandedParticipant, setExpandedParticipant] = useState(null);

  // Function to calculate student's score percentage
  const calculateScore = (participant) => {
    if (!participant.options || Object.keys(participant.options).length === 0) return 0;
    
    const correctAnswers = Object.values(participant.options).filter(
      answer => answer.decision === true
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
      option: participant.options[questionId].option
    };
  };

 function exportToExcel() {
  const data:data[]=[];
  participants.map((participant:any)=>{
    data.push({
      name:participant.name,
      score:`${calculateScore(participant)}%`
        })
  })
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `ca211.xlsx`);
  }




  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden">
      <div className="p-4 border-b border-purple-100 flex justify-between items-center">
        <h3 className="text-lg font-medium text-purple-900">Student Performance</h3>
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
            <th className="text-left p-4 text-purple-800 font-medium min-w-[250px]">NAME</th>
            <th className="text-left p-4 text-purple-800 font-medium">SCORE</th>
              {questions.map((question, index) => (
                <th key={question.id} className="p-3 text-purple-800 font-medium text-center w-20">
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
                <React.Fragment                 
                    key={student.id} 
>
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
                  
                  </tr>
      
                </React.Fragment>
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

              </tr>
            )}
          </tbody>
        </table>
      </div>


    </Card>
  );
}