// Simple test runner for job logic
// To run: node src/utils/test-runner.js

import { calculateStats, filterByStatus } from './stats.js';
import { JOB_STATUS } from '../constants/jobStatus.js';

const mockApplications = [
  { id: 1, job_title: 'Frontend', status: JOB_STATUS.APPLIED },
  { id: 2, job_title: 'Backend', status: JOB_STATUS.INTERVIEWING },
  { id: 3, job_title: 'Fullstack', status: JOB_STATUS.OFFERED },
  { id: 4, job_title: 'DevOps', status: JOB_STATUS.APPLIED },
  { id: 5, job_title: 'QA', status: JOB_STATUS.REJECTED },
];

function testCalculateStats() {
  console.log('Testing calculateStats...');
  const stats = calculateStats(mockApplications);
  
  console.assert(stats.total === 5, 'Total count should be 5');
  console.assert(stats[JOB_STATUS.APPLIED] === 2, 'Applied count should be 2');
  console.assert(stats[JOB_STATUS.INTERVIEWING] === 1, 'Interviewing count should be 1');
  console.assert(stats[JOB_STATUS.OFFERED] === 1, 'Offered count should be 1');
  console.assert(stats[JOB_STATUS.REJECTED] === 1, 'Rejected count should be 1');
  
  console.log('✅ calculateStats passed!');
}

function testFilterByStatus() {
  console.log('Testing filterByStatus...');
  const applied = filterByStatus(mockApplications, JOB_STATUS.APPLIED);
  
  console.assert(applied.length === 2, 'Should filter 2 applied jobs');
  console.assert(applied.every(app => app.status === JOB_STATUS.APPLIED), 'All filtered jobs should be Applied');
  
  console.log('✅ filterByStatus passed!');
}

try {
  testCalculateStats();
  testFilterByStatus();
  console.log('\nAll tests passed successfully! 🎉');
} catch (error) {
  console.error('\nTest failed! ❌');
  console.error(error);
}
