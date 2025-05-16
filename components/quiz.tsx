'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  TreePine,
  Mountain,
  Snowflake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Quiz data
const quizData = [
  {
    question: 'Which of these is NOT a winter sport?',
    options: ['Ice Skating', 'Snowboarding', 'Cricket', 'Skiing'],
    correctAnswer: 'Cricket',
  },
  {
    question: 'What causes snow to appear white?',
    options: [
      "It's naturally white",
      'Light reflection off ice crystals',
      'It contains white pigment',
      'It absorbs all colors',
    ],
    correctAnswer: 'Light reflection off ice crystals',
  },
  {
    question: 'Which animal changes its coat color to white in winter?',
    options: ['Polar Bear', 'Arctic Fox', 'Penguin', 'Seal'],
    correctAnswer: 'Arctic Fox',
  },
  {
    question: 'What is the coldest temperature ever recorded on Earth?',
    options: ['-89.2°C', '-100.4°C', '-78.5°C', '-94.7°C'],
    correctAnswer: '-89.2°C',
  },
  {
    question: "Which country experiences a 'White Christmas' most often?",
    options: ['Canada', 'Russia', 'Norway', 'Finland'],
    correctAnswer: 'Finland',
  },
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answerStatus, setAnswerStatus] = useState<
    'correct' | 'incorrect' | null
  >(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult, isAnswered]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === quizData[currentQuestion].correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer('');
    setAnswerStatus(null);
    setTimeLeft(30);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setAnswerStatus(null);
    setIsAnswered(false);
  };

  const progressPercentage =
    ((currentQuestion + (isAnswered ? 1 : 0)) / quizData.length) * 100;

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-sm bg-white/70 rounded-xl shadow-lg overflow-hidden border border-white/50"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-cyan-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{timeLeft}s</span>
                </div>
                <div className="px-4 py-1.5 bg-cyan-100 rounded-full text-cyan-700 font-medium">
                  Question {currentQuestion + 1}/{quizData.length}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-cyan-900 mb-8">
                {quizData[currentQuestion].question}
              </h2>

              <div className="grid gap-4">
                {quizData[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={cn(
                      'relative p-6 rounded-xl text-left font-medium transition-all duration-200 group',
                      selectedAnswer === option
                        ? option === quizData[currentQuestion].correctAnswer
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-white hover:bg-cyan-50 text-cyan-900 border-cyan-100',
                      'border-2',
                      isAnswered &&
                        option === quizData[currentQuestion].correctAnswer
                        ? 'bg-green-100 border-green-300'
                        : ''
                    )}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && (
                        <>
                          {option ===
                          quizData[currentQuestion].correctAnswer ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : selectedAnswer === option ? (
                            <XCircle className="w-6 h-6 text-red-600" />
                          ) : null}
                        </>
                      )}
                    </div>
                    <div
                      className={cn(
                        'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                        'border-2 border-cyan-200'
                      )}
                    ></div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-cyan-50 flex justify-between items-center">
              {isAnswered && (
                <div className="flex items-center gap-2">
                  {answerStatus === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        Correct!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">
                        Incorrect!
                      </span>
                    </>
                  )}
                </div>
              )}
              <Button
                onClick={handleNextQuestion}
                className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white border-none"
                size="lg"
              >
                {currentQuestion < quizData.length - 1
                  ? 'Next Question'
                  : 'Finish Quiz'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm bg-white/70 rounded-xl shadow-lg overflow-hidden border border-white/50 p-8 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center mb-6">
                {score >= 4 ? (
                  <Award className="w-12 h-12 text-cyan-700" />
                ) : score >= 2 ? (
                  <Mountain className="w-12 h-12 text-cyan-700" />
                ) : (
                  <Snowflake className="w-12 h-12 text-cyan-700" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-cyan-900 mb-2">
                Quiz Completed!
              </h2>
              <p className="text-cyan-700 mb-8">
                You scored {score} out of {quizData.length}
              </p>

              <div className="w-full max-w-xs mb-8">
                <div className="h-4 bg-cyan-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    style={{ width: `${(score / quizData.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-cyan-700 text-sm">
                  <span>0</span>
                  <span>{quizData.length}</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="inline-block px-4 py-2 rounded-full bg-cyan-100 text-cyan-700">
                  {score === quizData.length
                    ? 'Winter Expert! ❄️'
                    : score >= quizData.length / 2
                      ? 'Well done! ☃️'
                      : 'Keep learning about winter! 🌨️'}
                </div>
              </div>

              <Button
                onClick={resetQuiz}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                size="lg"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winter decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-5 text-cyan-800 opacity-20">
            <TreePine size={60} />
          </div>
          <div className="absolute bottom-0 left-20 text-cyan-800 opacity-30">
            <TreePine size={80} />
          </div>
          <div className="absolute bottom-0 left-40 text-cyan-800 opacity-20">
            <TreePine size={50} />
          </div>
          <div className="absolute bottom-0 right-5 text-cyan-800 opacity-20">
            <TreePine size={60} />
          </div>
          <div className="absolute bottom-0 right-20 text-cyan-800 opacity-30">
            <TreePine size={80} />
          </div>
          <div className="absolute bottom-0 right-40 text-cyan-800 opacity-20">
            <TreePine size={50} />
          </div>
        </div>
      </div>
    </div>
  );
}
