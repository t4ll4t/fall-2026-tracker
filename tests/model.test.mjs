import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_DAYS,ALL_SESSIONS,scheduleForDate,summary,dateKey,zonedTime,dateEvent} from '../dist/model.mjs';
test('calendar totals independently reconciled: 48 regular days minus 8 holidays plus 2 substitutions',()=>{
 assert.equal(ALL_DAYS.length,42);assert.equal(ALL_SESSIONS.length,55);
 assert.equal(ALL_SESSIONS.filter(s=>s.id==='MGMT 411').length,28);
 assert.equal(ALL_SESSIONS.filter(s=>s.id==='MIS 445').length,27);
 assert.equal(ALL_SESSIONS.filter(s=>s.id==='ACCT 212').length,0);
});
test('holidays, substitutions, assessments and teaching boundaries',()=>{
 for(const day of ['2026-08-17','2026-09-07','2026-09-11','2026-09-21','2026-10-12','2026-10-14','2026-10-16','2026-11-25','2026-11-27','2026-12-09','2026-12-14'])assert.equal(scheduleForDate(day).length,0,day);
 assert.deepEqual(scheduleForDate('2026-09-08').map(s=>s.id),['MIS 445']);
 assert.deepEqual(scheduleForDate('2026-11-24').map(s=>s.id),['MGMT 411']);
 assert.equal(scheduleForDate('2026-09-23').length,2);
 assert.equal(scheduleForDate('2026-09-25').length,1);
 assert.equal(ALL_DAYS.at(-1),'2026-12-07');
 assert.equal(dateEvent('2026-12-12'),'Reading day');
});
test('time zones and DST are pinned to New York',()=>{
 assert.equal(zonedTime('2026-10-28','13:30').toISOString(),'2026-10-28T17:30:00.000Z');
 assert.equal(zonedTime('2026-11-04','13:30').toISOString(),'2026-11-04T18:30:00.000Z');
 assert.equal(dateKey(new Date('2026-09-17T02:00:00Z')),'2026-09-16');
 assert.equal(summary(new Date('2026-09-16T11:00:00-04:00')).seconds,92*86400+3600);
});
test('in-progress class time and session completion are exact',()=>{
 const s=summary(new Date('2026-09-16T12:00:00-04:00'));
 assert.equal(s.classDays,31);assert.equal(s.sessions,40);assert.equal(s.hours,59.75);
 assert.equal(summary(new Date('2026-09-16T13:15:00-04:00')).sessions,39);
 assert.equal(summary(new Date('2026-09-16T15:00:00-04:00')).classDays,30);
 assert.equal(summary(new Date('2026-09-16T15:00:00-04:00')).sessions,39);
});
test('before semester, final class completion, departure and post-semester clamp',()=>{
 assert.equal(summary(new Date('2026-07-01T12:00:00Z')).sessions,55);
 assert.equal(summary(new Date('2026-07-01T12:00:00Z')).progress,0);
 assert.equal(summary(new Date('2026-12-07T15:00:00-05:00')).classDays,0);
 const s=summary(new Date('2026-12-17T11:00:00-05:00'));assert.equal(s.seconds,0);assert.equal(s.sessions,0);assert.equal(s.progress,1);
 assert.equal(summary(new Date('2027-01-01T00:00:00Z')).seconds,0);
});

test('MIS 445 syllabus cancellation preserves the MGMT 411 meeting',()=>{assert.deepEqual(scheduleForDate('2026-09-16').map(s=>s.id),['MGMT 411']);assert.equal(summary(new Date('2026-09-16T13:15:00-04:00')).classDays,30);});
