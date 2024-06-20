import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 100 }, // ramp-up to 100 users over 2 minutes
        { duration: '3m', target: 200 }, // spike to 200 users over 3 minutes
        { duration: '2m', target: 0 },   // ramp-down to 0 users over 2 minutes
    ],
};

export default function () {
    const baseUrl = 'http://localhost:3000';

    // Create a new course
    const createPayload = JSON.stringify({
        title: `Course ${__ITER}`,
        description: `Description for Course ${__ITER}`,
        duration: 60,
    });

    const createParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let createRes = http.post(`${baseUrl}/courses`, createPayload, createParams);
    check(createRes, {
        'create course status was 201': (r) => r.status === 201,
    });

    // List all courses
    let listRes = http.get(`${baseUrl}/courses`);
    check(listRes, {
        'list courses status was 200': (r) => r.status === 200,
    });

    sleep(1);
}
