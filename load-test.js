import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 100 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be < 2000ms
  },
};

export default function () {
  const url = 'https://quiz-app-sepia-gamma.vercel.app/student/quiz/59087121-b46e-4070-bd1d-fed39af756a9/0e19accb-3da6-4e8d-a865-b6e059bce6db';
  http.get(url);
  sleep(1); // Optional: wait 1 second between requests
}
