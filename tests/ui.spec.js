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

test('scroll-linked forest, timeline and clouds react to real scrolling',async({page})=>{
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.evaluate(()=>window.ScrollTrigger?.getAll().length||0)).toBeGreaterThan(5);
 const transform=selector=>page.locator(selector).evaluate(el=>getComputedStyle(el).transform);
 const forest=await transform('.hero-image');
 await page.evaluate(()=>scrollTo({top:350,behavior:'instant'}));
 await expect.poll(()=>transform('.hero-image')).not.toBe(forest);
 await page.locator('.journey-track').scrollIntoViewIfNeeded();
 const line=await transform('.journey-line i');
 await page.evaluate(()=>scrollBy({top:400,behavior:'instant'}));
 await expect.poll(()=>transform('.journey-line i')).not.toBe(line);
 await page.locator('.departure-scene').scrollIntoViewIfNeeded();
 const clouds=await transform('.cloud-image');
 await page.evaluate(()=>scrollBy({top:180,behavior:'instant'}));
 await expect.poll(()=>transform('.cloud-image')).not.toBe(clouds);
 const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));expect(broken).toEqual([]);
});
test('reduced motion removes scroll effects and navigation reaches real sections',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect.poll(()=>page.evaluate(()=>!!window.ScrollTrigger)).toBe(true);
 expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBe(0);
 await page.getByRole('link',{name:'The semester',exact:true}).click();
 await expect(page).toHaveURL(/#journey$/);await expect(page.locator('#journey-title')).toBeInViewport();
 await page.getByRole('link',{name:'Exams',exact:true}).click();await expect(page.locator('#exams h2')).toBeInViewport();
 expect(await page.locator('.cloud-image').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
