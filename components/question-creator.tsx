"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, ImageIcon } from "lucide-react"

interface QuestionCreatorProps {
  onClose: () => void
}

export function QuestionCreator({ onClose }: QuestionCreatorProps) {
  const [questionType, setQuestionType] = useState("multiple-choice")
  const [questionText, setQuestionText] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [shortAnswer, setShortAnswer] = useState("")
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

  const handleSave = () => {
    // In a real app, this would save the question to the database
    onClose()
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="multiple-choice" onValueChange={setQuestionType}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
          <TabsTrigger value="true-false">True/False</TabsTrigger>
          <TabsTrigger value="short-answer">Short Answer</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text" className="text-purple-800">
              Question Text
            </Label>
            <textarea
              id="question-text"
              rows={3}
              placeholder="Enter your question here..."
              className="w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm mt-1"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="has-image"
              className="rounded border-purple-300 text-purple-600"
              checked={hasImage}
              onChange={(e) => setHasImage(e.target.checked)}
            />
            <Label htmlFor="has-image" className="text-purple-800">
              Add Image to Question
            </Label>
          </div>

          {hasImage && (
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <ImageIcon className="h-10 w-10 text-purple-500 mb-2" />
                <p className="text-sm text-purple-700 mb-2">Drag and drop an image, or click to browse</p>
                <Button variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-100">
                  Upload Image
                </Button>
              </div>
            </div>
          )}

          <TabsContent value="multiple-choice" className="space-y-4 mt-4">
            <div>
              <Label className="text-purple-800">Answer Options</Label>
              <RadioGroup value={correctAnswer || ""} onValueChange={setCorrectAnswer} className="mt-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option} id={`option-${index}`} className="text-purple-700" />
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        className="bg-white border-purple-200"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8 w-8"
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
                  className="border-purple-600 text-purple-700 hover:bg-purple-100 mt-2"
                  onClick={addOption}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Option
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="true-false" className="space-y-4 mt-4">
            <div>
              <Label className="text-purple-800">Correct Answer</Label>
              <RadioGroup defaultValue="true" className="mt-2" onValueChange={setCorrectAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="True" id="true" className="text-purple-700" />
                  <Label htmlFor="true" className="text-purple-800">
                    True
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="False" id="false" className="text-purple-700" />
                  <Label htmlFor="false" className="text-purple-800">
                    False
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="short-answer" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="correct-answer" className="text-purple-800">
                Correct Answer
              </Label>
              <Input
                id="correct-answer"
                placeholder="Enter the correct answer"
                className="bg-white border-purple-200 mt-1"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
              />
              <p className="text-xs text-purple-700 mt-1">
                Students will need to type an answer that matches this exactly. Consider accepting multiple variations.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="pt-4 border-t border-purple-100 flex justify-end gap-3">
        <Button variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-100" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
          Add Question
        </Button>
      </div>
    </div>
  )
}
