import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Baseline 100 VUs for 1 min
    { duration: '30s', target: 500 }, // Spike to 500 VUs
    { duration: '1m', target: 100 }, // Scale back
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://Veniveni123.github.io/AlgoVerse/';

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(0.5);
}
