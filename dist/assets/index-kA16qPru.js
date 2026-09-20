var e=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=e((()=>{}));function r(){return`
    <main class="home">
      <div class="home__stage">
        <span class="home__decor" aria-hidden="true"></span>
        <header class="home__intro">
          <p class="home__hello">It's play time.</p>
          <h1 class="home__title">Ready to play?</h1>
        </header>
        <button id="play-btn" class="home__play" type="button">
          <span class="home__play-box"><span class="home__play-icon" aria-hidden="true"></span></span>
          <span class="home__play-label">Play</span>
          ${a}
        </button>
      </div>
    </main>`}function i(e,t){e.innerHTML=r(),e.querySelector(`#play-btn`)?.addEventListener(`click`,t)}var a,o=e((()=>{a=`
  <svg class="home__arrow" viewBox="0 0 33 16" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M0 8H31M24 1L31 8L24 15"></path>
  </svg>`}));function s(e){return`/images/${e}/cover.svg`}function c(e,t){return`/images/${e}/${t}.svg`}var l,u=e((()=>{l={"code-vibes":{id:`code-vibes`,label:`Code vibes theme`,icon:`💻`,previewMotif:`git`,motifs:[`git`,`typescript`,`javascript`,`html5`,`vscode`,`django`,`css3`,`angular`,`terminal`,`python`,`github`,`node`,`bootstrap`,`vue`,`react`,`sass`,`sql`,`firebase`]},gaming:{id:`gaming`,label:`Gaming theme`,icon:`🎮`,previewMotif:`dice`,motifs:[`circle-guard`,`square-guard`,`triangle-guard`,`labyrinth`,`creeper`,`mushroom`,`dice`,`banana`,`gamepad`,`ghosts`,`coin`,`spiral`,`level-up`,`pacman`,`handheld`,`puzzle`,`playing-card`,`play-button`]},"da-projects":{id:`da-projects`,label:`DA Projects theme`,icon:`🗂️`,previewMotif:`shark`,motifs:[`noodles`,`ramen`,`egg`,`blossom`,`join`,`chef-hat`,`recycle`,`basket`,`pokeball`,`tic-tac-toe`,`smiley`,`arrow`,`chat`,`sombrero`,`broccoli`,`network`,`shark`,`coins`]},foods:{id:`foods`,label:`Foods theme`,icon:`🍔`,previewMotif:`wrap`,motifs:[`fries`,`pizza`,`sandwich`,`donut`,`sushi`,`corn-dog`,`burger`,`pretzel`,`cupcake`,`pudding`,`flan`,`chocolate`,`fried-chicken`,`wrap`,`taco`,`ice-cream`,`salad`,`macarons`]}}}));function ee(e){return e===1?d.slice(0,2):d.slice(0,e)}function te(e){return e===1?`orange`:null}var d,f,p=e((()=>{d=[`blue`,`orange`,`green`,`purple`],f={blue:`Blue`,orange:`Orange`,green:`Green`,purple:`Purple`}}));function ne(e,t){return`
    <span class="game-bar__score" data-player="${e}">
      <i class="game-bar__icon" aria-hidden="true"></i>
      <span class="game-bar__name">${f[e]}</span>
      <output id="score-${e}">0</output>${e===t?h:``}
    </span>`}function m(e,t){return`
    <header id="game-bar" class="game-bar" data-active-player="${e[0]}">
      <div class="game-bar__scores">
        ${e.map(e=>ne(e,t)).join(``)}
      </div>
      <p class="game-bar__current">
        Current player:
        <span class="game-bar__token"><i class="game-bar__icon" aria-hidden="true"></i></span>
      </p>
      <button id="exit-game-btn" class="game-bar__exit" type="button">
        <i class="game-bar__exit-icon" aria-hidden="true"></i>
        Exit game
      </button>
    </header>`}var h,g=e((()=>{p(),h=`<span class="game-bar__bot" role="img" aria-label="Computer">🤖</span>`}));function re(e,t){let n=`${e}-${t.value}`;return`
    <li class="settings__option">
      <input type="radio" name="${e}" value="${t.value}" id="${n}" data-short="${t.short}" required>
      <label for="${n}">${t.label}</label>
    </li>`}function ie(){return Object.values(l).filter(e=>e.motifs.length>0).map(e=>({value:e.id,label:e.label,short:e.label.replace(/ theme$/i,``)}))}function _(e,t,n,r){return`
    <fieldset class="settings__section">
      <legend><img class="settings__icon" src="./images/icons/${e}.svg" alt="">${t}</legend>
      <ul class="settings__options">${r.map(e=>re(n,e)).join(``)}</ul>
    </fieldset>`}function ae(){return`
    <form id="settings-form" class="settings__form">
      ${_(`palette`,`Game themes`,`theme`,ie())}
      ${_(`player`,`Choose player`,`playerCount`,y)}
      ${_(`board-size`,`Board size`,`boardSize`,me)}
    </form>`}function oe(){return Object.values(l).find(e=>e.motifs.length>0).id}function se(e){let t=l[e].previewMotif;return`
    <div class="settings__stage" id="preview-stage" data-theme="${e}">
      ${m([`blue`,`orange`],null)}
      <div class="settings__stage-cards">
        <img class="settings__preview-card" src=".${s(e)}" alt="">
        <img class="settings__preview-card" src=".${c(e,t)}" alt="${t.replace(/-/g,` `)}">
      </div>
    </div>`}function ce(){return`
    <div class="settings__breadcrumb">
      ${v.map(e=>`<span class="settings__crumb" data-crumb="${e.name}">${e.placeholder}</span>`).join(``)}
      <button type="submit" form="settings-form" class="settings__start" disabled>
        <span class="settings__start-icon" aria-hidden="true"></span>Start
      </button>
    </div>`}function le(){return`
    <main class="settings">
      <div class="settings__frame">
        <h1 class="settings__title">Settings</h1>
        ${ae()}
        <div class="settings__preview">${se(oe())}${ce()}</div>
      </div>
    </main>`}function ue(e,t){for(let n of v){let r=t.querySelector(`input[name="${n.name}"]:checked`),i=e.querySelector(`[data-crumb="${n.name}"]`);i.textContent=r?.dataset.short??n.placeholder,i.classList.toggle(`is-filled`,!!r)}}function de(e,t){let n=new FormData(t).get(`theme`);n&&(e.querySelector(`#preview-stage`).outerHTML=se(n)),ue(e,t),e.querySelector(`.settings__start`).disabled=!t.checkValidity()}function fe(e){let t=new FormData(e);return{theme:t.get(`theme`),boardSize:t.get(`boardSize`),playerCount:Number(t.get(`playerCount`))}}function pe(e,t){e.innerHTML=le();let n=e.querySelector(`#settings-form`);n.addEventListener(`change`,()=>de(e,n)),n.addEventListener(`submit`,e=>{e.preventDefault(),n.checkValidity()&&t(fe(n))})}var v,y,me,he=e((()=>{u(),g(),v=[{name:`theme`,placeholder:`Game theme`},{name:`playerCount`,placeholder:`Player`},{name:`boardSize`,placeholder:`Board size`}],y=[{value:`1`,label:`1 Player (vs Computer)`,short:`1 Player`},{value:`2`,label:`2 Players`,short:`2 Players`},{value:`3`,label:`3 Players`,short:`3 Players`},{value:`4`,label:`4 Players`,short:`4 Players`}],me=[{value:`4x4`,label:`16 cards`,short:`16 Cards`},{value:`4x6`,label:`24 cards`,short:`24 Cards`},{value:`6x6`,label:`36 cards`,short:`36 Cards`}]}));function ge(){return x||=new AudioContext,x}function _e(e,t,n){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(.18,t+.015),e.gain.exponentialRampToValueAtTime(1e-4,t+n)}function b(e,t,n=0,r=`triangle`){let i=ge(),a=i.currentTime+n,o=i.createOscillator(),s=i.createBiquadFilter(),c=i.createGain();o.type=r,o.frequency.value=e,s.type=`lowpass`,s.frequency.value=2200,_e(c,a,t),o.connect(s).connect(c).connect(i.destination),o.start(a),o.stop(a+t+.02)}function ve(){b(700,.07,0,`sine`)}function ye(){b(523,.18),b(659,.18,.06),b(784,.22,.12)}function be(){b(311,.16,0,`sine`),b(233,.2,.1,`sine`)}function xe(){b(523,.16),b(659,.16,.14),b(784,.16,.28),b(1047,.35,.42)}function Se(){b(349,.3,0,`sine`),b(311,.35,.25,`sine`)}function Ce(){b(196,.14,0,`sine`),b(1320,.08,.02)}var x,S=e((()=>{x=null}));function we(e,t,n){return{x:e,y:t,vx:0,vy:0,size:4,life:1,decay:.012,gravity:Fe,color:n,rotation:0,spin:0}}function Te(e,t,n){let r=A(0,Math.PI*2),i=A(1.5,7.5);return{...we(e,t,n),vx:Math.cos(r)*i,vy:Math.sin(r)*i,size:A(1.5,3.2),decay:A(.009,.018)}}function Ee(e,t,n,r,i){let a=i.glyphs.length>0&&Math.random()<.55?j(i.glyphs):void 0;return{...we(e,t,j(i.colors)),vx:n,vy:r,size:A(8,15),decay:.004,glyph:a,rotation:A(0,6),spin:A(-.2,.2)}}function C(e){let t=A(window.innerWidth*.15,window.innerWidth*.85),n=A(window.innerHeight*.12,window.innerHeight*.5),r=j(e.colors);for(let i=0;i<E;i++)D.push(Te(t,n,i%5==0?j(e.colors):r));Ce()}function De(e){for(let t of[-1,1]){let n=t<0?0:window.innerWidth;for(let r=0;r<70;r++){let r=A(10,17);D.push(Ee(n,window.innerHeight,-t*r*A(.25,.75),-r*A(.6,1),e))}}}function Oe(e){D.push(Ee(A(0,window.innerWidth),-20,A(-1,1),A(1.5,3.5),e))}function ke(e){e.x+=e.vx,e.y+=e.vy,e.vy+=e.gravity,e.vx*=.985,e.life-=e.decay,e.rotation+=e.spin}function Ae(e,t){e.translate(t.x,t.y),e.rotate(t.rotation),t.glyph?(e.font=`${t.size*1.6}px sans-serif`,e.fillText(t.glyph,0,0)):e.fillRect(-t.size/2,-t.size/4,t.size,t.size/2)}function je(e,t){e.save(),e.globalAlpha=Math.max(0,Math.min(1,t.life*1.4)),e.fillStyle=t.color,t.spin===0?(e.beginPath(),e.arc(t.x,t.y,t.size,0,Math.PI*2),e.fill()):Ae(e,t),e.restore()}function w(e,t){let n=e.getContext(`2d`);n.clearRect(0,0,e.width,e.height),n.globalCompositeOperation=t.glow?`lighter`:`source-over`,D=D.filter(t=>t.life>0&&t.y<e.height+60);for(let e of D)ke(e),je(n,e);e.isConnected&&(k=requestAnimationFrame(()=>w(e,t)))}function Me(){O.forEach(e=>window.clearInterval(e)),O=[],cancelAnimationFrame(k),D=[]}function Ne(e,t,n=9e3){let r=Pe[t];Me(),e.width=window.innerWidth,e.height=window.innerHeight,w(e,r),De(r),C(r),O.push(window.setInterval(()=>C(r),T)),O.push(window.setInterval(()=>Oe(r),90)),window.setTimeout(()=>O.forEach(e=>window.clearInterval(e)),n)}var Pe,Fe,T,E,D,O,k,A,j,Ie=e((()=>{S(),Pe={"code-vibes":{colors:[`#4dd5bc`,`#f0ea6e`,`#2bb1ff`,`#f58e39`,`#ffffff`],glyphs:[`</>`,`{ }`,`=>`,`&&`,`;`],glow:!0},gaming:{colors:[`#ed1b76`,`#f0ea6e`,`#1faafc`,`#7cff6b`,`#ffffff`],glyphs:[`★`,`♦`,`✦`,`●`],glow:!0},"da-projects":{colors:[`#bfe5f2`,`#f0ea6e`,`#ffffff`,`#fa5a5a`,`#f58e39`],glyphs:[],glow:!0},foods:{colors:[`#f3832d`,`#a45212`,`#ed1b76`,`#f0ea6e`,`#5fbf7a`],glyphs:[`🍔`,`🍕`,`🍩`,`🍟`,`🍦`,`🧁`,`🌮`],glow:!1}},Fe=.16,T=650,E=64,D=[],O=[],k=0,A=(e,t)=>e+Math.random()*(t-e),j=e=>e[Math.floor(Math.random()*e.length)]}));function Le(e){let t=Object.entries(e),n=Math.max(...t.map(([,e])=>e));return t.filter(([,e])=>e===n).map(([e])=>e)}function Re(e){return e===`code-vibes`?`<img class="endscreen__title-art" src="./images/end/game-over.svg" alt="Game over">`:`<span class="endscreen__badge">GAME OVER</span>`}function ze([e,t]){return`
    <span class="game-bar__score" data-player="${e}">
      <i class="game-bar__icon" aria-hidden="true"></i>
      <span class="game-bar__name">${f[e]}</span>
      <output data-target="${t}">0</output>
    </span>`}function Be(e,t){let n=Object.entries(t);return`
    <section class="endscreen__panel endscreen__panel--over">
      <h1 class="endscreen__title">${Re(e)}</h1>
      <p class="endscreen__label">Final score</p>
      <div class="endscreen__scores game-bar__scores">${n.map(ze).join(``)}</div>
    </section>`}function Ve(e){return[...e].map((e,t)=>`<span style="--i:${t}">${e===` `?`&nbsp;`:e}</span>`).join(``)}function He(e,t){return t?e===`gaming`?`<img class="endscreen__hero endscreen__hero--trophy" src="./images/end/trophy.svg" alt="Trophy">`:`<span class="endscreen__hero endscreen__hero--pawn" aria-hidden="true"></span>`:`<span class="endscreen__hero endscreen__hero--scale" aria-hidden="true"></span>`}function Ue(e,t){let n=Le(t),r=n.length>1?null:n[0],i=r?`${f[r]} Player`:`DRAW`;return`
    <section class="endscreen__panel endscreen__panel--result" data-result="${r?`win`:`draw`}">
      <p class="endscreen__kicker">${r?`The <mark>winner</mark> is`:`It's a`}</p>
      <h2 class="endscreen__name" data-player="${r??`draw`}">${Ve(i)}</h2>
      <div class="endscreen__hero-wrap" data-player="${r??`draw`}">${He(e,r)}</div>
      <button id="restart-btn" class="endscreen__button" type="button">${Ye[e]}</button>
    </section>`}function We(e,t){return`
    <main class="endscreen" data-theme="${e}" data-phase="over">
      <canvas class="endscreen__fx" aria-hidden="true"></canvas>
      ${Be(e,t)}
      ${Ue(e,t)}
    </main>`}function Ge(e){e.querySelectorAll(`output[data-target]`).forEach(e=>{let t=Number(e.dataset.target),n=performance.now(),r=i=>{let a=Math.min(1,(i-n)/1100);e.textContent=String(Math.round(t*a)),a<1&&requestAnimationFrame(r)};requestAnimationFrame(r)})}function Ke(e,t,n){e.dataset.phase=`result`;let r=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;if(n)return Se();xe(),r||Ne(e.querySelector(`canvas`),t)}function qe(e,t,n,r){e.innerHTML=We(n,t);let i=e.querySelector(`.endscreen`);Ge(i),window.setTimeout(()=>Ke(i,n,Le(t).length>1),Je),e.querySelector(`#restart-btn`)?.addEventListener(`click`,()=>{Me(),r()})}var Je,Ye,Xe=e((()=>{p(),Ie(),S(),Je=1700,Ye={"code-vibes":`Back to start`,gaming:`Home`,"da-projects":`Home`,foods:`Home`}})),Ze,Qe=e((()=>{Ze=class{id;pairId;label;imageUrl;isFlipped=!1;isMatched=!1;constructor(e,t,n,r){this.id=e,this.pairId=t,this.label=n,this.imageUrl=r}}}));function M(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function $e(e,t){return M([...l[e].motifs]).slice(0,P[t])}function N(e,t,n,r){return new Ze(e,t,n.replace(/-/g,` `),c(r,n))}function et(e,t){return M($e(e,t).flatMap((t,n)=>[N(n*2,n,t,e),N(n*2+1,n,t,e)]))}var P,tt=e((()=>{Qe(),u(),P={"4x4":8,"4x6":12,"6x6":18}}));function nt(e,t){return`
    <button class="card" type="button" data-id="${e.id}">
      <span class="card__inner">
        <img class="card__face card__face--back" src=".${s(t)}" alt="">
        <img class="card__face card__face--front" src=".${e.imageUrl}" alt="${e.label}">
      </span>
    </button>`}function rt(e,t,n){return`
    <section class="board" data-size="${t}">
      ${e.map(e=>nt(e,n)).join(``)}
    </section>`}var it=e((()=>{u()}));function at(){return`
    <div class="popup-overlay" id="exit-popup">
      <div class="popup">
        <p class="popup__title">Are you sure you want to quit the game?</p>
        <div class="popup__actions">
          <button class="button button--secondary" id="popup-resume" type="button">Back to game</button>
          <button class="button button--outline" id="popup-exit" type="button">Exit game</button>
        </div>
      </div>
    </div>`}function ot(e,t){e.insertAdjacentHTML(`beforeend`,at());let n=e.querySelector(`#exit-popup`);n.querySelector(`#popup-resume`)?.addEventListener(`click`,()=>n.remove()),n.querySelector(`#popup-exit`)?.addEventListener(`click`,t)}var st=e((()=>{}));function F(){return L[z]}function ct(){return{...R}}function lt(){let e=F();R[e]=(R[e]??0)+1,I()}function ut(){z=(z+1)%L.length,I()}function dt(e){L=e,R=Object.fromEntries(e.map(e=>[e,0])),z=0,I()}function I(){for(let e of L){let t=document.getElementById(`score-${e}`);t&&(t.textContent=String(R[e]??0))}let e=document.getElementById(`game-bar`);e&&(e.dataset.activePlayer=F())}var L,R,z,ft=e((()=>{L=[`blue`,`orange`],R={},z=0}));function pt(e,t,n,r){K=e,Q=n,$=r,Z=te(t.playerCount),q=et(t.theme,t.boardSize),J=[],Y=new Set,X=!1,mt(t),dt(ee(t.playerCount))}function mt(e){let t=ee(e.playerCount),n=rt(q,e.boardSize,e.theme);K.innerHTML=`
    <main class="game-screen" data-theme="${e.theme}">
      ${m(t,Z)}${n}
    </main>`,K.querySelector(`.game-screen`)?.addEventListener(`click`,ht),K.querySelector(`#exit-game-btn`)?.addEventListener(`click`,()=>ot(K,$))}function B(e){return K.querySelector(`.card[data-id="${e.id}"]`)}function ht(e){let t=e.target.closest(`.card`);if(X||!t||F()===Z)return;let n=q.find(e=>e.id===Number(t.dataset.id));!n||n.isFlipped||n.isMatched||(U(n,t),J.length===2&&W())}function V(e){return q.find(t=>t.id!==e.id&&t.pairId===e.pairId&&Y.has(t.id)&&!t.isMatched)}function gt(){for(let e of q.filter(e=>Y.has(e.id)&&!e.isMatched)){let t=V(e);if(t)return[e,t]}}function H(e=[]){let t=q.filter(t=>!t.isFlipped&&!t.isMatched&&!e.includes(t)),n=t.filter(e=>!Y.has(e.id)),r=n.length>0?n:t;return r[Math.floor(Math.random()*r.length)]}function _t(){return J.length===1?V(J[0])??H(J):H()}function vt([e,t]){U(e,B(e)),window.setTimeout(()=>{U(t,B(t)),W()},G)}function yt(){let e=J.length===0?gt():void 0;if(e)return vt(e);let t=_t();t&&(U(t,B(t)),J.length===2?W():window.setTimeout(yt,G))}function bt(){F()===Z&&window.setTimeout(yt,G)}function U(e,t){e.isFlipped=!0,t.classList.add(`is-flipped`),J.push(e),Y.add(e.id),ve()}function W(){let[e,t]=J;if(X=!0,e.pairId===t.pairId){xt(e,t);return}be(),window.setTimeout(()=>St(e,t),Tt)}function xt(e,t){let n=F();for(let r of[e,t])r.isMatched=!0,B(r).classList.add(`is-matched`,`is-matched--${n}`);ye(),lt(),Ct(!0)}function St(e,t){for(let n of[e,t])n.isFlipped=!1,B(n).classList.remove(`is-flipped`);Ct(!1)}function Ct(e){if(J=[],X=!1,e||ut(),q.every(e=>e.isMatched))return wt();bt()}function wt(){Q(ct())}var Tt,G,K,q,J,Y,X,Z,Q,$,Et=e((()=>{tt(),it(),g(),st(),p(),ft(),S(),Tt=800,G=700,q=[],J=[],Y=new Set,X=!1,Z=null,Q=()=>{},$=()=>{}}));t((()=>{n(),o(),he(),Xe(),Et();function e(e){i(e,()=>t(e))}function t(e){pe(e,t=>r(e,t))}function r(t,n){pt(t,n,e=>a(t,e,n.theme),()=>e(t))}function a(t,n,r){qe(t,n,r,()=>e(t))}function s(){let t=document.getElementById(`content`);t&&e(t)}document.addEventListener(`DOMContentLoaded`,s)}))();