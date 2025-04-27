"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Trash2, GripVertical, Plus, ImageIcon } from "lucide-react"

type QuestionType = "multiple-choice" | "true-false" | "short-answer"

interface QuestionProps {
  question: {
    id: number
    type: string
    text: string
    options: string[]
    correctAnswer: string | null
  }
  questionNumber: number
  onRemove: () => void
}

export function QuestionEditor({ question, questionNumber, onRemove }: QuestionProps) {
  const [questionText, setQuestionText] = useState(question.text)
  const [options, setOptions] = useState(question.options)
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(question.correctAnswer)
  const [hasImage, setHasImage] = useState(false)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
    if (correctAnswer === options[index]) {
      setCorrectAnswer(null)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/50">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="cursor-move mr-2 text-cyan-700">
            <GripVertical className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-medium text-cyan-900">Question {questionNumber}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={onRemove}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`question-${question.id}`} className="text-cyan-800">
              Question
            </Label>
            <Textarea
              id={`question-${question.id}`}
              placeholder="Enter your question here..."
              className="bg-white/80 border-white/50 mt-1"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id={`has-image-${question.id}`} checked={hasImage} onCheckedChange={setHasImage} />
            <Label htmlFor={`has-image-${question.id}`} className="text-cyan-800">
              Add Image
            </Label>
          </div>

          {hasImage && (
            <div className="border-2 border-dashed border-cyan-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <ImageIcon className="h-10 w-10 text-cyan-500 mb-2" />
                <p className="text-sm text-cyan-700 mb-2">Drag and drop an image, or click to browse</p>
                <Button variant="outline" className="border-cyan-600 text-cyan-700 hover:bg-cyan-100">
                  Upload Image
                </Button>
              </div>
            </div>
          )}

          {question.type === "multiple-choice" && (
            <div className="space-y-3">
              <Label className="text-cyan-800">Answer Options</Label>
              <RadioGroup value={correctAnswer || ""} onValueChange={setCorrectAnswer}>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${question.id}-${index}`} className="text-cyan-700" />
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        className="bg-white/80 border-white/50"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              {options.length < 6 && (
                <Button
                  variant="outline"
                  className="border-cyan-600 text-cyan-700 hover:bg-cyan-100"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              )}
            </div>
          )}

          {question.type === "true-false" && (
            <div className="space-y-3">
              <Label className="text-cyan-800">Answer</Label>
              <RadioGroup value={correctAnswer || ""} onValueChange={setCorrectAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="True" id={`true-${question.id}`} className="text-cyan-700" />
                  <Label htmlFor={`true-${question.id}`} className="text-cyan-800">
                    True
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="False" id={`false-${question.id}`} className="text-cyan-700" />
                  <Label htmlFor={`false-${question.id}`} className="text-cyan-800">
                    False
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {question.type === "short-answer" && (
            <div className="space-y-3">
              <Label className="text-cyan-800">Correct Answer</Label>
              <Input
                placeholder="Enter the correct answer"
                className="bg-white/80 border-white/50"
                value={correctAnswer || ""}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              />
              <p className="text-xs text-cyan-700">
                Students will need to type an answer that matches this exactly. Consider accepting multiple variations.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-cyan-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id={`required-${question.id}`} defaultChecked />
                <Label htmlFor={`required-${question.id}`} className="text-cyan-800">
                  Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`points-${question.id}`} className="text-cyan-800">
                  Points:
                </Label>
                <Input
                  id={`points-${question.id}`}
                  type="number"
                  defaultValue="10"
                  className="w-20 bg-white/80 border-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
