export const ZONE = 'America/New_York';
export const FIRST = '2026-08-18';
export const LAST_CLASS = '2026-12-08';
export const DEPARTURE = new Date('2026-12-17T11:00:00-05:00');
export const COURSES = [
  {id:'MGMT 411',days:[3,5],start:'11:45',end:'13:15',time:'11:45 AM - 1:15 PM',style:'early'},
  {id:'MIS 445',days:[1,3],start:'13:30',end:'15:00',time:'1:30 - 3:00 PM',style:'late'},
  {id:'ACCT 212',days:[],start:null,end:null,time:'Study at home',style:'home'}
];
// Final schedule supplied by Sahil; ACCT section 01 matches his course syllabus.
export const FINAL_ASSESSMENTS = [
 {id:'MIS 445',section:'01',date:'2026-12-11',start:'12:50',end:'15:20',time:'12:50 - 3:20 PM',location:'LH 009',title:'Exam 2 / final',kind:'exam',style:'final'},
 {id:'ACCT 212',section:'01',date:'2026-12-14',start:'20:05',end:'22:05',time:'8:05 - 10:05 PM',location:'AA G008',title:'Final exam',kind:'exam',style:'final'},
 {id:'MGMT 411',date:'2026-12-16',start:'17:00',end:'17:00',time:'Due 5:00 PM',location:'Self-paced assessment',title:'Comp XM deadline',kind:'deadline',style:'final'}
];
export function assessmentsForDate(key){return FINAL_ASSESSMENTS.filter(a=>a.date===key).map(a=>({...a,startAt:zonedTime(a.date,a.start),endAt:zonedTime(a.date,a.end)}));}
export function nextScheduledEvent(now=new Date()){
 const finals=FINAL_ASSESSMENTS.flatMap(a=>assessmentsForDate(a.date));
 return [...ALL_SESSIONS,...finals].filter(a=>a.endAt>now).sort((a,b)=>a.startAt-b.startAt)[0]??null;
}
export const HOLIDAYS = [
  {start:'2026-09-07',end:'2026-09-07',label:'Labor Day'},
  {start:'2026-09-11',end:'2026-09-11',label:'Rosh Hashanah'},
  {start:'2026-09-21',end:'2026-09-21',label:'Yom Kippur'},
  {start:'2026-10-10',end:'2026-10-18',label:'Fall break'},
  {start:'2026-11-25',end:'2026-11-29',label:'Thanksgiving break'}
];
export const MILESTONES = [
  {date:'2026-08-18',end:'2026-08-18',title:'First day of classes',detail:'The Fall 2026 term begins'},
  {date:'2026-09-07',end:'2026-09-07',title:'Labor Day',detail:'No classes'},
  {date:'2026-09-08',end:'2026-09-08',title:'Monday schedule on Tuesday',detail:'MIS 445 meets at 1:30 PM'},
  {date:'2026-09-11',end:'2026-09-11',title:'Rosh Hashanah',detail:'No classes'},
  {date:'2026-09-21',end:'2026-09-21',title:'Yom Kippur',detail:'No classes'},
  {date:'2026-09-22',end:'2026-09-22',title:'ACCT 212: Exam 1',detail:'In class · Confirm your section time'},
  {date:'2026-09-23',end:'2026-09-27',title:'Academic Assessment Days',detail:'Sep 23-27 · Regular classes included'},
  {date:'2026-10-10',end:'2026-10-18',title:'Fall break',detail:'Oct 10-18 · No classes'},
  {date:'2026-10-23',end:'2026-10-23',title:'MIS 445: Exam 1',detail:'2:30-4:30 PM · Tentative'},
  {date:'2026-10-29',end:'2026-10-29',title:'ACCT 212: Exam 2',detail:'In class · Confirm your section time'},
  {date:'2026-10-29',end:'2026-10-29',title:'Withdrawal & grade options',detail:'Grade option: 4:30 PM; withdrawal: 11:59 PM'},
  {date:'2026-11-04',end:'2026-11-04',title:'MGMT 411: In-class quiz',detail:'During your 11:45 AM class'},
  {date:'2026-11-24',end:'2026-11-24',title:'Friday schedule on Tuesday',detail:'MGMT 411 meets at 11:45 AM'},
  {date:'2026-11-25',end:'2026-11-29',title:'Thanksgiving break',detail:'Nov 25-29 · No classes'},
  {date:'2026-12-07',end:'2026-12-07',title:'Your last regular class',detail:'MIS 445 · 1:30-3:00 PM'},
  {date:'2026-12-08',end:'2026-12-08',title:'University classes end',detail:'Your regular Tuesday is free'},
  {date:'2026-12-09',end:'2026-12-09',title:'Reading day',detail:'No regular classes'},
  {date:'2026-12-10',end:'2026-12-11',title:'Final examinations',detail:'University exam period · Your MIS 445 final is Dec 11'},
  {date:'2026-12-11',end:'2026-12-11',title:'MIS 445: Final exam',detail:'12:50-3:20 PM · LH 009 · Section 01'},
  {date:'2026-12-12',end:'2026-12-13',title:'Reading days',detail:'Dec 12-13 · No regular classes'},
  {date:'2026-12-14',end:'2026-12-16',title:'Final examinations',detail:'University exam period · ACCT 212 final Dec 14; Comp XM due Dec 16'},
  {date:'2026-12-14',end:'2026-12-14',title:'ACCT 212: Final exam',detail:'8:05-10:05 PM · AA G008 · Section 01'},
  {date:'2026-12-16',end:'2026-12-16',title:'MGMT 411: Comp XM due',detail:'Hard deadline: 5:00 PM Eastern'},
  {date:'2026-12-17',end:'2026-12-17',title:'Departure day',detail:'You leave at 11:00 AM Eastern'}
];
const dateFormat=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'});
export function dateKey(instant=new Date()) {const p=Object.fromEntries(dateFormat.formatToParts(instant).map(p=>[p.type,p.value]));return `${p.year}-${p.month}-${p.day}`;}
export function civil(key) {return new Date(key+'T12:00:00Z');}
export function addDays(key,n) {const d=civil(key);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function weekday(key) {return civil(key).getUTCDay();}
export function formatDate(key,options={month:'short',day:'numeric'}) {return new Intl.DateTimeFormat('en-US',{timeZone:'UTC',...options}).format(civil(key));}
const partsFormatter=new Intl.DateTimeFormat('en-US',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export function zonedTime(key,time='00:00') {
  const wall=Date.parse(`${key}T${time}:00Z`);let utc=wall;
  for(let i=0;i<3;i++) {const p=Object.fromEntries(partsFormatter.formatToParts(new Date(utc)).map(p=>[p.type,p.value]));const represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);utc+=wall-represented;}
  return new Date(utc);
}
export function holiday(key) {return HOLIDAYS.find(h=>key>=h.start&&key<=h.end);}
export function scheduleForDate(key) {
  if(key<FIRST||key>LAST_CLASS||holiday(key)) return [];
  const day=key==='2026-09-08'?1:key==='2026-11-24'?5:weekday(key);
  return COURSES.filter(c=>c.days.includes(day)&&!(c.id==='MIS 445'&&key==='2026-09-16')).map(c=>({...c,date:key,startAt:zonedTime(key,c.start),endAt:zonedTime(key,c.end)}));
}
export function dateEvent(key) {
  if(key==='2026-12-11')return 'MIS 445 final';
  if(key==='2026-12-14')return 'ACCT 212 final';
  if(key==='2026-09-16')return 'MIS 445 cancelled';
  if(key==='2026-09-22')return 'ACCT 212 exam 1';
  if(key==='2026-10-23')return 'MIS 445 exam 1 (tentative)';
  if(key==='2026-10-29')return 'ACCT 212 exam 2';
  if(key==='2026-11-04')return 'MGMT 411 quiz';
  if(key==='2026-12-16')return 'Comp XM due 5 PM';
  const h=holiday(key);if(h)return h.label;
  if(key==='2026-09-08')return 'Monday schedule';
  if(key==='2026-11-24')return 'Friday schedule';
  if(key>='2026-09-23'&&key<='2026-09-27')return 'Assessment days';
  if(['2026-12-10','2026-12-11','2026-12-14','2026-12-15','2026-12-16'].includes(key))return 'Exam day';
  if(['2026-12-09','2026-12-12','2026-12-13'].includes(key))return 'Reading day';
  if(key==='2026-12-17')return 'Departure · 11 AM';
  return '';
}
export const ALL_SESSIONS=[];
for(let k=FIRST;k<=LAST_CLASS;k=addDays(k,1))ALL_SESSIONS.push(...scheduleForDate(k));
export const ALL_DAYS=[...new Set(ALL_SESSIONS.map(s=>s.date))];
export function summary(now=new Date()) {
  const remaining=ALL_SESSIONS.filter(s=>s.endAt>now);
  const totalHours=remaining.reduce((v,s)=>v+(s.endAt-Math.max(+now,+s.startAt))/3600000,0);
  const start=zonedTime(FIRST),end=zonedTime('2026-12-17');
  return {classDays:new Set(remaining.map(s=>s.date)).size,sessions:remaining.length,hours:totalHours,next:remaining[0]??null,totalDays:ALL_DAYS.length,totalSessions:ALL_SESSIONS.length,progress:Math.max(0,Math.min(1,(now-start)/(end-start))),seconds:Math.max(0,Math.floor((DEPARTURE-now)/1000))};
}
