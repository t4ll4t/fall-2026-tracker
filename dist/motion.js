/* Scroll-linked composition. The document remains fully readable if motion cannot load. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.to('.hero-image', {yPercent:14, scale:1.12, ease:'none', scrollTrigger:{id:'forest-parallax',trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-title', {y:45, ease:'none', scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el,{y:35,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
    });
    gsap.fromTo('.journey-line i',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{id:'semester-line',trigger:'.journey-track',start:'top 65%',end:'bottom 70%',scrub:true}});
    gsap.utils.toArray('.journey-stop').forEach(el => {
      gsap.fromTo(el,{x:18},{x:0,ease:'none',scrollTrigger:{trigger:el,start:'top 92%',end:'top 52%',scrub:true}});
      gsap.fromTo(el.querySelector('h3'),{color:'#a5a397'},{color:'#f4f1e9',ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'top 45%',scrub:true}});
    });
    gsap.fromTo('.cloud-image',{scale:1.14,yPercent:-5},{scale:1,yPercent:5,ease:'none',scrollTrigger:{id:'cloud-parallax',trigger:'.departure-scene',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.fromTo('.departure-copy',{y:60},{y:-20,ease:'none',scrollTrigger:{trigger:'.departure-scene',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.fromTo('.departure-ticket',{y:25},{y:0,ease:'none',scrollTrigger:{trigger:'.departure-ticket',start:'top bottom',end:'bottom 90%',scrub:true}});
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
  document.querySelector('.method details')?.addEventListener('toggle', () => ScrollTrigger.refresh());
  // Recalculate downstream scenes when switching between the calendar's differently sized views.
  const calendar = document.querySelector('.calendar-panel');
  const resize = new ResizeObserver(() => ScrollTrigger.refresh());
  resize.observe(calendar);
  window.addEventListener('pagehide', () => {resize.disconnect();media.revert();},{once:true});
})();
