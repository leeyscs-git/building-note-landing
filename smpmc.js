'use strict';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const hero = $('.line-hero'), stage = $('.opening-stage'), opening = $('.opening-sequence'), services = $('#services');
const menu = $('#mobile-menu'), menuButton = $('.menu-toggle');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '전체 메뉴 열기'); }
menuButton.addEventListener('click', () => { const open=menu.hidden; menu.hidden=!open; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'전체 메뉴 닫기':'전체 메뉴 열기'); });
$$('a',menu).forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});
matchMedia('(min-width:601px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
// Reference: 2 / 6 / 10 / 13.5 / 18 sec; every tile is staggered by 100 ms.
$$('.reference-building [data-stage]').forEach(group=>$$('.txt',group).forEach((tile,i)=>tile.style.setProperty('--tile-delay',`${i*.1}s`)));
$$('.reference-building .dot').forEach((tile,i)=>tile.style.setProperty('--tile-delay',`${i*.1}s`));
const messages=[['PEOPLE.','공간을 사용하는 사람에서, 더 나은 관리가 시작됩니다.'],['VALUE.','세심한 오늘의 관리가, 자산의 가치를 쌓아갑니다.'],['TOMORROW.','현장의 경험과 기술로, 공간의 다음을 준비합니다.']];
let current=0,visualIndex=0,partnerIndex=0,paused=false,heroClock=0,partnerClock=0,firstHero=true,firstPartner=true;
const track=$('.word-track'), partnerTrack=$('.partner-track');
function setMessage(index,wrap=false){
 current=index;visualIndex=wrap?3:index;track.style.transform=`translateY(-${visualIndex*25}%)`;
 $('#hero-word').setAttribute('aria-label',messages[index][0]);$('#hero-description').textContent=messages[index][1];
 $$('[data-slide]').forEach(button=>{const active=Number(button.dataset.slide)===index;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
track.addEventListener('transitionend',event=>{if(event.propertyName==='transform'&&visualIndex===3){track.style.transition='none';track.style.transform='translateY(0)';void track.offsetWidth;track.style.transition='';visualIndex=0;}});
partnerTrack.addEventListener('transitionend',event=>{if(event.propertyName==='transform'&&partnerIndex===2){partnerTrack.style.transition='none';partnerTrack.style.transform='translateY(0)';void partnerTrack.offsetWidth;partnerTrack.style.transition='';partnerIndex=0;}});
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>{setMessage(Number(button.dataset.slide));heroClock=0;firstHero=false;}));
$('.hero-pause').addEventListener('click',()=>{paused=!paused;$('.hero-pause').setAttribute('aria-pressed',String(paused));$('.hero-pause').setAttribute('aria-label',paused?'자동 전환 재생':'자동 전환 일시정지');$('.hero-pause').textContent=paused?'▶':'Ⅱ';});
function goToServices(){closeMenu();if(motionPreference.matches){services.scrollIntoView();return;}window.scrollTo({top:opening.offsetTop+180,behavior:'smooth'});history.replaceState(null,'','#services');}
$$('a[href="#services"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();goToServices();}));
if(location.hash==='#services')requestAnimationFrame(goToServices);
document.documentElement.classList.add('js-motion');
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting)),{threshold:.08});
$$('.reveal').forEach(element=>revealObserver.observe(element));
const intro=$('#about'),values=$('#values'),projects=$('#projects'),future=$('#future'),sun=$('.travelling-sun');
const clamp=value=>Math.max(0,Math.min(1,value));
// Let the browser own wheel, trackpad, touch and keyboard scrolling. Only the
// decorative layers ease toward the current position; no queued page movement.
let lastTime=performance.now(),smoothY=scrollY,rafId,serviceActive=false;
function setServiceActive(active){
 if(serviceActive===active&&services.inert===!active&&hero.inert===(active&&!motionPreference.matches))return;
 serviceActive=active;stage.classList.toggle('services-active',active);services.inert=!active;services.setAttribute('aria-hidden',String(!active));
 hero.inert=active&&!motionPreference.matches;hero.setAttribute('aria-hidden',String(active&&!motionPreference.matches));
 if(hero.inert&&hero.contains(document.activeElement))$('.service-card').focus({preventScroll:true});
}
function tick(time){
 const dt=Math.min(time-lastTime,64);lastTime=time;const reduced=motionPreference.matches,y=scrollY,h=innerHeight;
 smoothY=reduced?y:smoothY+(y-smoothY)*(1-Math.exp(-dt/95));
 const stageRect=opening.getBoundingClientRect();setServiceActive(reduced||stageRect.top<-20);
 const stageVisible=stageRect.bottom>0&&stageRect.top<h;
 const canPlay=!paused&&!reduced&&!document.hidden&&!$('dialog[open]')&&menu.hidden;
 hero.classList.toggle('is-paused',!canPlay||serviceActive||!stageVisible);
 if(canPlay&&stageVisible){
  if(!serviceActive){heroClock+=dt;const delay=firstHero?2500:3500;if(heroClock>=delay){heroClock=0;firstHero=false;setMessage((current+1)%3,current===2);}}
  else{partnerClock+=dt;const delay=firstPartner?2500:3500;if(partnerClock>=delay){partnerClock=0;firstPartner=false;partnerIndex++;partnerTrack.style.transform=`translateY(-${partnerIndex*100/3}%)`;}}
 }
 const introRect=intro.getBoundingClientRect(),coreRect=values.getBoundingClientRect(),projectRect=projects.getBoundingClientRect(),futureRect=future.getBoundingClientRect();
 intro.classList.toggle('motion-on',reduced||introRect.top<h);values.classList.toggle('motion-on',reduced||coreRect.top<h*.4);projects.classList.toggle('motion-on',reduced||projectRect.top<h*.4);future.classList.toggle('motion-on',reduced||futureRect.top<h*.4);
 $('.site-header').classList.toggle('dark-header',projectRect.top<65&&projectRect.bottom>65);
 // A short catch-up softens decorative motion without delaying navigation.
 const progress=clamp((smoothY-(intro.offsetTop-h))/h),size=innerWidth<=600?100:300;
 let x=innerWidth*.26-size/2,sy=h*.5-size/2,scale=.3;
 if(progress<1/6)scale=.3+.7*progress*6;
 else if(progress<.5){scale=1;x-=size*.7*((progress-1/6)/(1/3));}
 else{scale=1;x=x-size*.7+(innerWidth*.66+size*.7)*((progress-.5)/.5);sy+=30*((progress-.5)/.5);}
 const coreProgress=clamp((smoothY-(values.offsetTop-h*.4))/(h*.4));if(coreProgress>0){x+=(innerWidth*.5-size/2-x)*coreProgress;sy+=60*coreProgress;}
 sun.style.transform=`translate3d(${x}px,${sy}px,0) scale(${scale})`;sun.style.opacity=String(!reduced&&coreRect.top>h*.4?1:0);
 projects.style.setProperty('--project-y',`${clamp((smoothY-projects.offsetTop+h*.4)/(projects.offsetHeight+h*.4))*h*.9}px`);
 rafId=requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(rafId);if(!document.hidden){lastTime=performance.now();rafId=requestAnimationFrame(tick);}});
motionPreference.addEventListener('change',()=>{smoothY=scrollY;heroClock=partnerClock=0;});rafId=requestAnimationFrame(tick);
const spaceData={
 office:{image:'assets/landing/workplace.jpg',alt:'자연광과 유리 파티션이 어우러진 오피스',index:'01 / OFFICE',title:'일하는 하루가,<br>더 나아지는 공간.',description:'집중과 소통의 균형, 쾌적한 환경, 일상적인 불편의 개선.',detail:'workplace'},
 retail:{image:'assets/landing/interior.jpg',alt:'사람들의 이동과 만남을 연결하는 상업 공간',index:'02 / RETAIL',title:'찾고 싶은 이유가,<br>더 많아지는 공간.',description:'사람의 동선을 이해하고, 머무는 경험과 임대 운영을 함께 살핍니다.',detail:'leasing'},
 mixed:{image:'assets/jll/spaces.webp',alt:'녹지와 계단, 다양한 활동이 연결되는 복합 공간',index:'03 / MIXED USE',title:'다른 일상이,<br>자연스럽게 연결되는 곳.',description:'다양한 사용자의 필요를 연결하고, 공용 공간의 경험을 관리합니다.',detail:'spaces'}
};
function selectSpace(key){const data=spaceData[key];$$('[data-space]').forEach(button=>{const active=button.dataset.space===key;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});$('#space-panel').setAttribute('aria-labelledby',`tab-${key}`);const image=$('#space-image');image.src=data.image;image.alt=data.alt;image.style.animation='none';void image.offsetWidth;image.style.animation='';$('#space-index').textContent=data.index;$('#space-title').innerHTML=data.title;$('#space-description').textContent=data.description;$('#space-detail').dataset.detail=data.detail;}
const spaceTabs=$$('[data-space]');spaceTabs.forEach((button,index)=>{button.addEventListener('click',()=>selectSpace(button.dataset.space));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%spaceTabs.length;if(event.key==='ArrowLeft')next=(index+spaceTabs.length-1)%spaceTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=spaceTabs.length-1;if(next!==undefined){event.preventDefault();spaceTabs[next].focus();selectSpace(spaceTabs[next].dataset.space);}});});
