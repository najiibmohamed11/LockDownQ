'use client'

import ParticipantsTab from '@/app/teacher/room/[id]/particpent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { QuestionsList } from './QuestionsList'

function ButtomPart({participants,questions}) {
  return (
    <Tabs defaultValue="participants">
    <TabsList className="bg-white/50 mb-6">
      <TabsTrigger value="participants">Participants</TabsTrigger>
      <TabsTrigger value="questions">Questions</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>

    <TabsContent value="participants" className="m-0">
      <ParticipantsTab participants={participants} questions={questions} />
    </TabsContent>

    <TabsContent value="questions" className="m-0">
      <QuestionsList
        questions={questions}
        onAddQuestion={()=>{}}
      />
    </TabsContent>
  </Tabs>
  )
}

export default ButtomPart