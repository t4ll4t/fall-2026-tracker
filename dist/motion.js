/* One motion controller: scroll choreography, flowing lines, and card response. */
(() => {
 const gsap=window.gsap,ST=window.ScrollTrigger;if(!gsap||!ST)return;gsap.registerPlugin(ST);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),button=document.querySelector('#motion-toggle');let paused=false,context,frame=0,lastFrame=0,phase=0;
 const canvas=document.querySelector('#flow-field'),ctx=canvas.getContext('2d');let w=innerWidth,h=innerHeight,pointer={x:.5,y:.5},scroll=0;
 const enabled=()=>!reduced.matches&&!paused;
 function size(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);paint();}
 function paint(){ctx.clearRect(0,0,w,h);for(let line=0;line<18;line++){ctx.beginPath();for(let y=-50;y<h+70;y+=18){const x=w*(line/17)+Math.sin(y/h*3.2+line*.36+phase+scroll*.0004)*(35+line*2)+Math.sin(y/h*6+phase*.5)*18+(pointer.x-.5)*20; y===-50?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=line%4===0?'rgba(133,180,255,.14)':'rgba(122,153,201,.055)';ctx.lineWidth=line%4===0?1:.6;ctx.stroke();}}
 function loop(t){frame=0;if(!enabled()||document.hidden)return;if(t-lastFrame>32){phase+=.0025;paint();lastFrame=t;}frame=requestAnimationFrame(loop);}
 function configure(){context?.revert();cancelAnimationFrame(frame);frame=0;const on=enabled();document.documentElement.classList.toggle('motion-paused',!on);button.setAttribute('aria-pressed',String(!on));button.setAttribute('aria-label',on?'Pause animations':'Play animations');button.innerHTML=on?'Motion on <span aria-hidden="true">Ⅱ</span>':'Motion off <span aria-hidden="true">▷</span>';
  if(on){context=gsap.context(()=>{
   gsap.from('.hero-title h1',{y:28,opacity:.6,duration:1,ease:'power3.out',clearProps:'opacity,transform'});
   gsap.to('.title-word',{xPercent:-10,yPercent:-7,opacity:.2,ease:'none',scrollTrigger:{id:'hero-type',trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
   gsap.to('.title-year',{xPercent:10,yPercent:12,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
   gsap.from('.countdown .count-unit',{y:24,opacity:.3,duration:.8,stagger:.09,ease:'power3.out',clearProps:'opacity,transform'});
   gsap.utils.toArray('.stats article').forEach((el,i)=>gsap.from(el,{y:30,duration:.7,delay:i*.09,ease:'power3.out',scrollTrigger:{trigger:'.stats',start:'top 96%',once:true}}));
   gsap.utils.toArray('.section-heading h2,.journey-heading h2').forEach(el=>gsap.fromTo(el,{clipPath:'inset(0 0 65% 0)',opacity:.35},{clipPath:'inset(0 0 0% 0)',opacity:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'top 65%',scrub:true}}));
   gsap.utils.toArray('.final-card').forEach((el,i)=>gsap.from(el,{y:90+50*i,rotation:3-i*3,scale:.92,ease:'none',scrollTrigger:{id:'finals-'+i,trigger:'.finals-spotlight',start:'top 95%',end:'top 30%',scrub:true}}));
   gsap.utils.toArray('.milestone-rail article').forEach((el,i)=>gsap.from(el,{y:55,opacity:.35,duration:.8,delay:i*.13,ease:'power3.out',scrollTrigger:{trigger:'.milestone-rail',start:'top 88%',once:true}}));
   gsap.timeline({scrollTrigger:{id:'departure-type',trigger:'.departure-scene',start:'top top',end:'bottom bottom',scrub:true}}).fromTo('.departure-sticky h2',{scale:.78,y:45},{scale:1,y:0,ease:'none'},0).fromTo('.outline-word',{color:'rgba(191,206,229,0)'},{color:'#d6e6ff',ease:'none'},0).fromTo('.departure-date',{opacity:.3},{opacity:1,ease:'none'},0);
   ST.create({id:'page-progress',start:0,end:'max',onUpdate:s=>{scroll=s.scroll();gsap.set('.reading-progress',{scaleX:s.progress});}});
  });frame=requestAnimationFrame(loop);}
  else{document.querySelectorAll('.tilt-card').forEach(el=>{el.style.transform='';});paint();}
  window.siteMotionEnabled=on;window.dispatchEvent(new CustomEvent('site-motion-change',{detail:{enabled:on}}));ST.refresh();
 }
 button.addEventListener('click',()=>{paused=!paused;configure();});reduced.addEventListener('change',configure);
 document.querySelectorAll('.tilt-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(!enabled()||e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;el.style.setProperty('--mx',x+'px');el.style.setProperty('--my',y+'px');if(!el.classList.contains('final-card'))gsap.to(el,{rotationX:-(y/r.height-.5)*5,rotationY:(x/r.width-.5)*5,transformPerspective:800,duration:.4,overwrite:'auto'});});el.addEventListener('pointerleave',()=>{if(!el.classList.contains('final-card'))gsap.to(el,{rotationX:0,rotationY:0,duration:.5,overwrite:'auto'});});});
 window.addEventListener('pointermove',e=>{pointer.x=e.clientX/w;pointer.y=e.clientY/h;},{passive:true});window.addEventListener('resize',size);document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden&&enabled())frame=requestAnimationFrame(loop);});
 const resize=new ResizeObserver(()=>ST.refresh());resize.observe(document.querySelector('.calendar-panel'));document.fonts.ready.then(()=>ST.refresh());document.querySelector('.method details').addEventListener('toggle',()=>ST.refresh());size();configure();
 window.addEventListener('pagehide',e=>{if(e.persisted)return;context?.revert();resize.disconnect();cancelAnimationFrame(frame);},{once:true});
})();
