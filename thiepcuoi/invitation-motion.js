(() => {
  'use strict';
  const all=selector=>Array.from(document.querySelectorAll(selector));
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const entrance=document.getElementById('entrance');
  const sections=all('.entrance,.hero,.room,.closing');
  const visibleSections=new Set();
  let invitationOpen=!!entrance?.hidden;

  sections.forEach((section,index)=>{
    const scene=document.createElement('div');scene.className='lotus-scene';scene.setAttribute('aria-hidden','true');
    scene.style.setProperty('--lotus-phase',`${-(index*1.7+2)}s`);
    for(const side of ['left','right']){const cloud=document.createElement('span');cloud.className=`auspicious-cloud cloud--${side}`;scene.append(cloud);}
    const water=document.createElement('div');water.className='pond-water';
    for(const suffix of ['','--back']){const ribbon=document.createElement('span');ribbon.className='water-ribbon'+(suffix?' water-ribbon'+suffix:'');water.append(ribbon);}
    scene.append(water);
    for(const side of ['left','right']){
      const stem=document.createElement('span');stem.className=`lotus-stem lotus-stem--${side}`;
      const image=document.createElement('img');image.src='./assets/lotus-sprig.svg';image.alt='';image.width=220;image.height=300;image.decoding='async';
      stem.append(image);scene.append(stem);
    }
    section.append(scene);
  });

  // Content stays fully visible on browsers without observers.
  if(!('IntersectionObserver' in window))return;
  const refreshScenes=()=>{
    sections.forEach(section=>section.classList.toggle('motion-active',visibleSections.has(section)&&(section===entrance||invitationOpen)));
    document.body.classList.toggle('motion-suspended',document.hidden);
  };
  const sceneObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){if(entry.isIntersecting)visibleSections.add(entry.target);else visibleSections.delete(entry.target);}
    refreshScenes();
  },{rootMargin:'80px 0px',threshold:0});
  sections.forEach(section=>sceneObserver.observe(section));
  document.addEventListener('visibilitychange',refreshScenes);

  const revealElements=all('.hero-card,.room-heading,.room-intro,.audio-card,.invitation-ticket,.date-copy,.calendar-card,.countdown,.photo-slot,.portrait-caption,.ceremony-card,.journey-stop,.gallery-quote,.rsvp-form,.guestbook-heading,.gift-card,.gift-note,.closing-copy');
  const reveal=element=>{element.classList.add('is-revealed');revealObserver.unobserve(element);};
  const revealObserver=new IntersectionObserver(entries=>{
    if(!invitationOpen)return;
    for(const entry of entries)if(entry.isIntersecting)reveal(entry.target);
  },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
  revealElements.forEach(element=>{
    element.classList.add('motion-reveal');
    const siblings=Array.from(element.parentElement.children).filter(child=>child.matches('.photo-slot,.gift-card,.journey-stop'));
    element.style.setProperty('--reveal-delay',`${Math.max(0,siblings.indexOf(element))%3*90}ms`);
    revealObserver.observe(element);
  });
  function revealVisible(){
    revealElements.filter(element=>!element.classList.contains('is-revealed')).forEach(element=>{
      const box=element.getBoundingClientRect();
      if(box.bottom>0&&box.top<innerHeight-24)reveal(element);
    });
  }
  function syncOpening(){
    if(!entrance||!entrance.hidden||invitationOpen)return;
    invitationOpen=true;refreshScenes();requestAnimationFrame(revealVisible);
  }
  if(entrance)new MutationObserver(syncOpening).observe(entrance,{attributes:true,attributeFilter:['hidden']});
  document.body.classList.add('motion-ready');
  if(invitationOpen)revealVisible();
  reducedMotion.addEventListener('change',()=>{if(invitationOpen)revealVisible();});

  // Only changed, visible countdown digits move; numbers and dates stay intact.
  const digits=all('.countdown b'),lastValues=new Map(digits.map(digit=>[digit,digit.textContent]));
  let countdownVisible=false;
  const countdown=document.querySelector('.countdown');
  const countdownObserver=new IntersectionObserver(entries=>{countdownVisible=entries.some(entry=>entry.isIntersecting);});
  if(countdown)countdownObserver.observe(countdown);
  const digitObserver=new MutationObserver(()=>{
    for(const digit of digits){
      const previous=lastValues.get(digit),current=digit.textContent;lastValues.set(digit,current);
      if(previous===current||previous==='—'||!/^\d+$/.test(current)||!invitationOpen||document.hidden||reducedMotion.matches||!countdownVisible||typeof digit.animate!=='function')continue;
      digit.animate([{opacity:.45,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});
    }
  });
  digits.forEach(digit=>digitObserver.observe(digit,{childList:true,characterData:true,subtree:true}));
})();
