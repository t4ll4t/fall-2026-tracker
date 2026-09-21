import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function open(page,time='2026-09-16T12:00:00-04:00') {await page.clock.install({time:new Date(time)});await page.clock.pauseAt(new Date(time));await page.goto('/');await expect(page.locator('#days-left')).toHaveText(/\d+/);}
test('live countdown, accurate counters, course rules and runtime',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
 await expect(page.locator('#days-left')).toHaveText('31');await expect(page.locator('#sessions-left')).toHaveText('40');await expect(page.locator('#hours-left')).toHaveText('59.8');
 await expect(page.locator('#count-days')).toHaveText('92');await expect(page.locator('#next-label')).toHaveText('Happening now');
 await expect(page.locator('.course-strip')).toContainText('ACCT 212');await expect(page.locator('#week-grid')).not.toContainText('ACCT 212');
 await page.clock.fastForward(1000);await expect(page.locator('#count-days')).toHaveText('91');await expect(page.locator('#count-clock')).toHaveText('23 : 59 : 59');expect(errors).toEqual([]);
});
test('week navigation handles holidays, replacement weekdays, and limits',async({page})=>{
 await open(page);await page.getByRole('button',{name:'Previous week'}).click();
 await expect(page.locator('[data-date="2026-09-07"]')).toContainText('Labor Day');await expect(page.locator('[data-date="2026-09-08"]')).toContainText('MIS 445');await expect(page.locator('[data-date="2026-09-11"]')).toContainText('Rosh Hashanah');
 await page.getByRole('button',{name:'Today',exact:true}).click();await expect(page.locator('#period-label')).toHaveText('Sep 14 - Sep 18');
 for(let i=0;i<10;i++)await page.getByRole('button',{name:'Next week'}).click();
 await expect(page.locator('[data-date="2026-11-24"]')).toContainText('MGMT 411');await expect(page.locator('[data-date="2026-11-25"]')).toContainText('Thanksgiving break');
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next week'}).click();await expect(page.getByRole('button',{name:'Next week'})).toBeDisabled();
});
test('keyboard tabs and selected monthly date details',async({page})=>{
 await open(page);await page.getByRole('tab',{name:'Week',exact:true}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Month',exact:true})).toBeFocused();await expect(page.locator('#month-panel')).toBeVisible();
 await page.locator('#month-grid button[data-date="2026-09-21"]').focus();await page.keyboard.press('Enter');await expect(page.locator('#day-detail')).toContainText('Yom Kippur');
 await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement.tagName)).toBe('BUTTON');
 await page.getByRole('button',{name:'Next month'}).click();await expect(page.locator('#period-label')).toHaveText('October 2026');await page.locator('#month-grid button[data-date="2026-10-14"]').click();await expect(page.locator('#day-detail')).toContainText('No regular classes');
});
test('mobile and desktop width checks including month view',async({page},testInfo)=>{
 await open(page);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`week at ${width}`).toBe(true);
  await page.getByRole('tab',{name:'Month',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`month at ${width}`).toBe(true);
  await page.getByRole('tab',{name:'Week',exact:true}).click();
 }
 if(testInfo.project.name==='chromium'){
  await page.evaluate(()=>{document.activeElement.blur();window.scrollTo({top:0,behavior:"instant"})});await page.screenshot({path:'qa/desktop.png',fullPage:true});await page.setViewportSize({width:375,height:900});await page.evaluate(()=>{document.activeElement.blur();window.scrollTo({top:0,behavior:"instant"})});await page.screenshot({path:'qa/mobile.png',fullPage:true});
 }
});
test('accessibility in week and month, reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await open(page);await page.clock.resume();
 for(const view of ['Week','Month']){await page.getByRole('tab',{name:view,exact:true}).click();const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);}
});
test('after classes and departure show completion without negative counts',async({page})=>{
 await open(page,'2026-12-17T11:00:00-05:00');await expect(page.locator('#count-days')).toHaveText('0');await expect(page.locator('#count-clock')).toHaveText('00 : 00 : 00');await expect(page.locator('#days-left')).toHaveText('0');await expect(page.locator('#next-day')).toHaveText('All wrapped up');await expect(page.locator('#progress-pct')).toHaveText('100%');
});
test('local date is consistent for a viewer in Dubai',async({browser})=>{
 const context=await browser.newContext({timezoneId:'Asia/Dubai'});const page=await context.newPage();await open(page,'2026-09-17T02:00:00Z');await expect(page.locator('#today-label')).toContainText('Sep 16');await expect(page.locator('#next-day')).toContainText('Sep 18');await context.close();
});
test('static schedule stays available with JavaScript disabled',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4178');await expect(page.locator('.noscript')).toBeVisible();await expect(page.locator('#week-grid')).toContainText('MGMT 411');await expect(page.locator('.calendar-toolbar')).toBeHidden();await context.close();
});
test('optional agent registry validates navigation and rejects invalid dates',async({page})=>{
 await page.addInitScript(()=>{window.testRegistry={};Object.defineProperty(document,'modelContext',{value:{registerTool(tool){window.testRegistry[tool.name]=tool;}}});});await open(page);
 expect(await page.evaluate(()=>Object.keys(window.testRegistry))).toEqual(['read_semester_summary','show_class_calendar']);
 const r=await page.evaluate(()=>window.testRegistry.show_class_calendar.execute({date:'2026-11-24',view:'month'}));expect(r.courses[0].course).toBe('MGMT 411');await expect(page.locator('#day-detail')).toContainText('Friday schedule');
 expect(await page.evaluate(()=>{try{window.testRegistry.show_class_calendar.execute({date:'2026-11-31',view:'month'});return false;}catch{return true;}})).toBe(true);await expect(page.locator('#period-label')).toHaveText('November 2026');
});

test('syllabus exams and cancellation are visible',async({page})=>{await open(page);await expect(page.locator('[data-date="2026-09-16"]')).toContainText('MIS 445 cancelled');await expect(page.locator('[data-date="2026-09-16"] .class-block')).toHaveCount(1);await expect(page.locator('#exams')).toContainText('2:30-4:30 PM');await expect(page.locator('#exams')).toContainText('Comp XM deadline');await expect(page.locator('#exams')).toContainText('5:00 PM');});

test('Spring-style hours are visible, total hours roll down and clamp at departure',async({page})=>{
 await open(page);await expect(page.locator('#total-hours')).toHaveText('2,208');
 await expect(page.locator('#count-hours')).toHaveText('00');await expect(page.locator('#count-minutes')).toHaveText('00');await expect(page.locator('#count-seconds')).toHaveText('00');
 await page.clock.fastForward(1000);await expect(page.locator('#total-hours')).toHaveText('2,207');await expect(page.locator('#count-hours')).toHaveText('23');await expect(page.locator('#count-minutes')).toHaveText('59');await expect(page.locator('#count-seconds')).toHaveText('59');
 await page.clock.setSystemTime(new Date('2026-12-17T11:00:00-05:00'));await page.clock.fastForward(1000);await expect(page.locator('#total-hours')).toHaveText('0');for(const id of ['hours','minutes','seconds'])await expect(page.locator('#count-'+id)).toHaveText('00');
});
test('final exams and Comp XM appear in weekly/monthly calendar and next event',async({page})=>{
 await open(page,'2026-12-10T12:00:00-05:00');await expect(page.locator('#days-left')).toHaveText('0');await expect(page.locator('#next-label')).toHaveText('Next final exam');await expect(page.locator('#next-time')).toContainText('LH 009');
 await expect(page.locator('[data-date="2026-12-11"] .exam-block')).toContainText('12:50 - 3:20 PM');await expect(page.locator('[data-date="2026-12-11"] .exam-block')).toContainText('LH 009');
 await page.getByRole('button',{name:'Next week'}).click();await expect(page.locator('[data-date="2026-12-14"] .exam-block')).toContainText('8:05 - 10:05 PM');await expect(page.locator('[data-date="2026-12-14"] .exam-block')).toContainText('AA G008');await expect(page.locator('[data-date="2026-12-16"] .exam-block')).toContainText('Due 5:00 PM');
 await page.getByRole('tab',{name:'Month',exact:true}).click();await page.locator('#month-grid button[data-date="2026-12-14"]').click();await expect(page.locator('#day-detail')).toContainText('8:05 - 10:05 PM · AA G008 · Section 01');await expect(page.locator('#exams')).not.toContainText('Date & time not confirmed');
 for(const width of [320,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});

test('image-free design has real scroll choreography and pause/resume',async({page})=>{
 await page.goto('/');await expect(page.locator('img')).toHaveCount(0);await expect.poll(()=>page.evaluate(()=>window.siteMotionEnabled)).toBe(true);
 const before=await page.locator('.title-word').evaluate(e=>getComputedStyle(e).transform);await page.evaluate(()=>scrollTo({top:300,behavior:'instant'}));await expect.poll(()=>page.locator('.title-word').evaluate(e=>getComputedStyle(e).transform)).not.toBe(before);
 await page.getByRole('button',{name:'Pause animations',exact:true}).click();await expect(page.locator('html')).toHaveClass(/motion-paused/);expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBe(0);
 await page.getByRole('button',{name:'Play animations',exact:true}).click();await expect.poll(()=>page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBeGreaterThan(5);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveClass(/motion-paused/);expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBe(0);
 await page.getByRole('link',{name:'The semester',exact:true}).click();await expect(page.locator('#journey-title')).toBeInViewport();
});
test('42 actual dates render in 3D and unfold on scroll; pause preserves a static grid',async({page})=>{
 await page.goto('/');await page.locator('.semester-scroll').scrollIntoViewIfNeeded();await expect(page.locator('.semester-stage')).toHaveAttribute('data-renderer','webgl');await expect(page.locator('#semester-canvas canvas')).toBeVisible();
 await expect(page.locator('#date-grid time')).toHaveCount(42);
 const top=await page.locator('.semester-scroll').evaluate(e=>e.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo({top:y-80,behavior:'instant'}),top);
 await expect(page.locator('#semester-canvas')).toHaveAttribute('data-progress', /^\d\.\d{3}$/);
 const before=await page.locator('#semester-canvas').getAttribute('data-progress');await page.evaluate(y=>scrollTo({top:y+450,behavior:'instant'}),top);await expect.poll(()=>page.locator('#semester-canvas').getAttribute('data-progress')).not.toBe(before);
 await page.getByRole('button',{name:'Pause animations',exact:true}).click();await expect.poll(()=>page.locator('#semester-canvas').getAttribute('data-progress')).toBe('1.000');expect(await page.evaluate(()=>!!window.ScrollTrigger.getById('date-sculpture'))).toBe(false);
});
test('3D load failure preserves the real class-date grid',async({page})=>{
 await page.route('**/vendor/three.module.js',route=>route.abort());await page.goto('/');await page.locator('.semester-scroll').scrollIntoViewIfNeeded();await expect(page.locator('.semester-stage')).toHaveAttribute('data-renderer','fallback');await expect(page.locator('#date-grid')).toBeVisible();await expect(page.locator('#date-grid time')).toHaveCount(42);await expect(page.locator('#date-grid time').last()).toHaveAttribute('datetime','2026-12-07');
});


test('finals unfold into readable date order on desktop and phone',async({page})=>{
 await page.goto('/');
 for(const viewport of [{width:1440,height:1050},{width:375,height:850}]){
  await page.setViewportSize(viewport);await expect.poll(()=>page.evaluate(()=>!!ScrollTrigger.getById('finals-unfold'))).toBe(true);
  const position=async(progress)=>{await page.evaluate(p=>{const t=ScrollTrigger.getById('finals-unfold');scrollTo({top:t.start+(t.end-t.start)*p,behavior:'instant'});},progress);};
  await position(0);await expect.poll(()=>page.locator('.final-card').first().evaluate(e=>Math.abs(gsap.getProperty(e,'rotation')))).toBeGreaterThan(5);
  const before=await page.locator('.final-card').last().boundingBox();await position(1);
  await expect.poll(()=>page.locator('.final-card').last().evaluate(e=>Math.abs(gsap.getProperty(e,'rotation')))).toBeLessThan(.01);
  const boxes=await page.locator('.final-card').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
  expect(Math.abs(boxes[2].x-before.x)+Math.abs(boxes[2].y-before.y)).toBeGreaterThan(80);
  for(let i=1;i<3;i++)expect(viewport.width>767?boxes[i].x-boxes[i-1].right:boxes[i].y-boxes[i-1].bottom).toBeGreaterThan(8);
  expect(boxes[0].y).toBeGreaterThan(65);expect(boxes[2].bottom).toBeLessThan(viewport.height);
 }
});
test('keyboard opens finals, pause resets both added scenes, short screens remain readable',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{const t=ScrollTrigger.getById('finals-unfold');scrollTo({top:t.start,behavior:'instant'});});
 await page.locator('.final-card').first().focus();await page.keyboard.press('Tab');await expect(page.locator('.final-card').nth(1)).toBeFocused();
 await expect.poll(()=>page.evaluate(()=>ScrollTrigger.getById('finals-unfold').progress)).toBeGreaterThan(.95);
 await page.getByRole('button',{name:'Pause animations',exact:true}).click();await expect(page.locator('html')).not.toHaveClass(/finals-spatial/);expect(await page.evaluate(()=>ScrollTrigger.getAll().length)).toBe(0);
 for(const selector of ['.final-card','.spatial-courses>div'])expect(await page.locator(selector).first().evaluate(e=>getComputedStyle(e).transform)).toBe('none');
 await page.getByRole('button',{name:'Play animations',exact:true}).click();await page.setViewportSize({width:375,height:600});await expect(page.locator('html')).not.toHaveClass(/finals-spatial/);
 await expect(page.locator('.finals-stage')).toHaveCSS('position','relative');await page.locator('.final-card').last().scrollIntoViewIfNeeded();await expect(page.locator('.final-card').last()).toBeInViewport();
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>page.evaluate(()=>ScrollTrigger.getAll().length)).toBe(0);
});
