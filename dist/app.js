import {FIRST,LAST_CLASS,MILESTONES,dateKey,addDays,weekday,formatDate,scheduleForDate,dateEvent,holiday,summary,civil} from './model.mjs';
const $=s=>document.querySelector(s);
const MIN='2026-08-17',MAX='2026-12-17';
const clamp=k=>k<MIN?MIN:k>MAX?MAX:k;
let view='week',anchor=clamp(dateKey()),selected=anchor,lastMinute='';
function weekStart(k){return addDays(k,-((weekday(k)+6)%7));}
function setText(s,t){$(s).textContent=t;}
function tick(){
  const now=new Date(),s=summary(now),seconds=s.seconds;
  setText('#count-days',Math.floor(seconds/86400));
  setText('#count-clock',[Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60].map(v=>String(v).padStart(2,'0')).join(' : '));
  if(!seconds)setText('.departure-card h2','Departure time has arrived.');
  const minute=now.toISOString().slice(0,16);if(minute===lastMinute)return;lastMinute=minute;
  const today=dateKey(now);
  setText('#today-label',formatDate(today,{weekday:'short',month:'short',day:'numeric',year:'numeric'})+' · ET');
  setText('#days-left',s.classDays);setText('#sessions-left',s.sessions);setText('#hours-left',Number(s.hours.toFixed(1)));
  setText('#days-detail',`${s.totalDays} scheduled class days this term`);
  setText('#progress-pct',`${Math.floor(s.progress*100)}%`);
  const week=Math.floor((civil(weekStart(today))-civil(weekStart(FIRST)))/604800000)+1;
  setText('#week-label',today<FIRST?'Starts August 18':today>'2026-12-16'?'Term complete':`Week ${week} of 18`);
  setText('#term-badge',today<FIRST?'Upcoming term':today>'2026-12-16'?'Term complete':'Semester in progress');
  $('#term-bars').innerHTML=Array.from({length:36},(_,i)=>{const f=Math.max(0,Math.min(1,s.progress*36-i));return `<i class="${f===1?'complete':f>0?'current':''}" style="--fill:${f*100}%"></i>`}).join('');
  $('#term-bars').setAttribute('aria-label',`${Math.floor(s.progress*100)} percent of the semester elapsed`);
  const completed=s.totalSessions-s.sessions;
  setText('#progress-message',`${completed} of ${s.totalSessions} scheduled sessions behind you.`);
  if(s.next){const inClass=now>=s.next.startAt;setText('#next-label',inClass?'Happening now':'Next on your schedule');setText('#next-day',s.next.date===today?'Today':formatDate(s.next.date,{weekday:'short',month:'short',day:'numeric'}));setText('#next-time',`${s.next.id} · ${s.next.time}`);}
  else{setText('#next-label','Regular classes');setText('#next-day','All wrapped up');setText('#next-time',today<='2026-12-16'?'Check your final exam details below.':'You made it through the term.');}
  const upcoming=MILESTONES.filter(m=>m.end>=today).slice(0,3);
  $('#milestone-list').innerHTML=upcoming.length?upcoming.map(m=>`<div class="milestone"><div class="date-tile">${formatDate(m.date,{month:'short'}).toUpperCase()}<strong>${Number(m.date.slice(-2))}</strong></div><div><h3>${m.title}</h3><p>${m.detail}</p></div></div>`).join(''):'<p class="complete-note">All semester milestones are complete.</p>';
  renderCalendar();
}
function classBlock(s,now){return `<div class="class-block ${s.style}${s.endAt<=now?' past':''}"><strong>${s.id}</strong><span>${s.time}</span><small>${s.endAt<=now?'Finished':s.startAt<=now?'In progress':'90 min'}</small></div>`;}
function renderCalendar(){
  const now=new Date(),today=dateKey(now),start=weekStart(anchor);
  const focusedDate=document.activeElement?.closest('#month-grid button[data-date]')?.dataset.date;
  $('#week-panel').hidden=view!=='week';$('#month-panel').hidden=view!=='month';
  for(const v of ['week','month']){const tab=$(`#${v}-tab`);tab.setAttribute('aria-selected',String(view===v));tab.tabIndex=view===v?0:-1;}
  $('#prev').setAttribute('aria-label',`Previous ${view}`);$('#next').setAttribute('aria-label',`Next ${view}`);
  $('#prev').disabled=view==='week'?start<=MIN:anchor.slice(0,7)<='2026-08';
  $('#next').disabled=view==='week'?start>='2026-12-14':anchor.slice(0,7)>='2026-12';
  if(view==='week'){
    setText('#period-label',`${formatDate(start)} - ${formatDate(addDays(start,4))}`);
    $('#week-grid').innerHTML=Array.from({length:5},(_,i)=>{
      const k=addDays(start,i),sessions=scheduleForDate(k),event=dateEvent(k);
      return `<div class="day-column${today===k?' is-today':''}" data-date="${k}"><h3>${formatDate(k,{weekday:'short'}).toUpperCase()} <strong>${Number(k.slice(-2))}</strong></h3>${sessions.map(s=>classBlock(s,now)).join('')}${!sessions.length?`<div class="no-class${event?' break':''}">${event|| (k<FIRST?'Term starts Aug 18':k>LAST_CLASS?'No regular classes':'No classes')}</div>`:event?`<div class="schedule-exception">${event}</div>`:''}</div>`;
    }).join('');
  }else{
    const month=anchor.slice(0,7),first=month+'-01',gridStart=weekStart(first);
    const nextMonth=new Date(civil(first));nextMonth.setUTCMonth(nextMonth.getUTCMonth()+1);
    const daysInMonth=Math.round((nextMonth-civil(first))/86400000);
    const cells=Math.ceil((((weekday(first)+6)%7)+daysInMonth)/7)*7;
    setText('#period-label',formatDate(first,{month:'long',year:'numeric'}));
    $('#month-grid').innerHTML=['M','T','W','T','F','S','S'].map(v=>`<div class="month-label" aria-hidden="true">${v}</div>`).join('')+Array.from({length:cells},(_,i)=>{
      const k=addDays(gridStart,i),sessions=scheduleForDate(k),event=dateEvent(k);
      const classes=`month-day${k.slice(0,7)!==month?' outside':''}${k===today?' is-today':''}${k===selected?' selected':''}`;
      return `<div class="${classes}"><time datetime="${k}">${Number(k.slice(-2))}</time><div class="day-dots" aria-hidden="true">${sessions.map(s=>`<i class="legend-dot ${s.style}"></i>`).join('')}${holiday(k)?'<i class="legend-dot holiday"></i>':''}</div>${event?`<span class="day-event">${event}</span>`:''}<button tabindex="0" data-date="${k}" aria-label="${formatDate(k,{weekday:'long',month:'long',day:'numeric'})}: ${sessions.map(s=>s.id).join(', ')||'No regular classes'}${event?', '+event:''}" aria-pressed="${k===selected}"></button></div>`;
    }).join('');
    renderDayDetail();
  }
  const exceptions=Array.from({length:5},(_,i)=>addDays(start,i)).filter(k=>dateEvent(k));
  setText('#calendar-note',view==='week'&&exceptions.length?exceptions.map(k=>`${formatDate(k)}: ${dateEvent(k)}`).join(' / '):'Class days count once. Wednesday has two sessions. ACCT 212 is studied at home.');
  if(focusedDate)$(`#month-grid button[data-date="${focusedDate}"]`)?.focus({preventScroll:true});
}
function renderDayDetail(){const sessions=scheduleForDate(selected),event=dateEvent(selected);$('#day-detail').innerHTML=`<strong>${formatDate(selected,{weekday:'long',month:'long',day:'numeric'})}</strong>${sessions.map(s=>`<p>${s.id} · ${s.time}</p>`).join('')||'<p>No regular classes.</p>'}${event?`<p>${event}${event==='Exam day'?' · Individual course times not confirmed.':''}</p>`:''}`;}
function setView(v){view=v;renderCalendar();}
function navigate(direction){if(view==='week')anchor=clamp(addDays(weekStart(anchor),direction*7));else{const d=civil(anchor.slice(0,7)+'-01');d.setUTCMonth(d.getUTCMonth()+direction);anchor=clamp(d.toISOString().slice(0,10));selected=anchor;}renderCalendar();}
for(const v of ['week','month']){
  $(`#${v}-tab`).addEventListener('click',()=>setView(v));
  $(`#${v}-tab`).addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'week':e.key==='End'?'month':view==='week'?'month':'week';setView(next);$(`#${next}-tab`).focus();}});
}
$('#prev').addEventListener('click',()=>navigate(-1));$('#next').addEventListener('click',()=>navigate(1));
$('#today').addEventListener('click',()=>{anchor=clamp(dateKey());selected=anchor;renderCalendar();});
$('#month-grid').addEventListener('click',e=>{const b=e.target.closest('button[data-date]');if(!b)return;selected=b.dataset.date;renderCalendar();$(`#month-grid button[data-date="${selected}"]`)?.focus();});
const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}},{rootMargin:'-10% 0px -60% 0px'});
['overview','calendar','journey','exams'].forEach(id=>sectionObserver.observe(document.getElementById(id)));
tick();setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastMinute='';tick();}});
const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();
 const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'read_semester_summary',description:'Read remaining class days, sessions, hours, and departure countdown.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||Object.keys(input).length)throw Error('No arguments are accepted.');const s=summary();return {...s,next:s.next?{course:s.next.id,date:s.next.date,time:s.next.time}:null};}});
 register({name:'show_class_calendar',description:'Navigate the visible week or month calendar to a Fall 2026 date.',inputSchema:{type:'object',properties:{date:{type:'string',format:'date'},view:{type:'string',enum:['week','month']}},required:['date','view'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||Object.keys(input).some(k=>!['date','view'].includes(k))||!/^2026-(08|09|10|11|12)-\d{2}$/.test(input.date)||isNaN(+civil(input.date))||civil(input.date).toISOString().slice(0,10)!==input.date||input.date<MIN||input.date>MAX||!['week','month'].includes(input.view))throw Error('Choose a valid date from August 17 through December 17, 2026, and week or month.');anchor=input.date;selected=anchor;setView(input.view);return {date:anchor,view,courses:scheduleForDate(anchor).map(s=>({course:s.id,time:s.time})),event:dateEvent(anchor)};}});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
