import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 100 users over 30 seconds
    { duration: '1m', target: 100 },   // Stay at 100 users for 1 minute
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
  },
};

// Generate unique student IDs for each virtual user
const generateStudentId = () => `student_${Math.floor(Math.random() * 10000)}`;

export default function () {
  // 1. Simulate student joining the room
  const studentId = generateStudentId();
  const roomName = 'YOUR_ROOM_NAME'; // Replace with your test room name
  
  // 2. Simulate checking if room exists
  const checkRoomRes = http.post('http://192.168.18.9:3000/api/actions/quiz/isRoomExists',
    JSON.stringify({ roomName }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (checkRoomRes.status === 200) {
    const roomId = JSON.parse(checkRoomRes.body).roomId;
    
    // 3. Simulate getting questions
    const questionsRes = http.post('YOUR_VERCEL_URL/api/actions/quiz/getQuestions',
      JSON.stringify({ roomId }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (questionsRes.status === 200) {
      const questions = JSON.parse(questionsRes.body).questionsResponse;
      
      // 4. Simulate submitting answers
      for (const question of questions) {
        http.post('YOUR_VERCEL_URL/api/actions/quiz/submitAnswer',
          JSON.stringify({
            participantId: studentId,
            questionId: question.id,
            answer: question.options[0], // Submit first option as answer
            corectAnswer: question.answer
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        sleep(0.5); // Add small delay between submissions
      }
    }
  }
}
