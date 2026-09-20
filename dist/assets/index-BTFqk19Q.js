var e=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=e((()=>{}));function r(){return`
    <main class="home">
      <span class="home__icon" aria-hidden="true">🎮</span>
      <p class="home__intro">It's play time.</p>
      <h1 class="home__title">Ready to play?</h1>
      <button id="play-btn" class="button button--primary" type="button">
        🎮 Play →
      </button>
    </main>`}function i(e,t){e.innerHTML=r(),e.querySelector(`#play-btn`)?.addEventListener(`click`,t)}var a=e((()=>{})),o,s=e((()=>{o={"code-vibes":{id:`code-vibes`,label:`Code vibes`,icon:`💻`,motifs:[`angular`,`typescript`,`javascript`,`html5`,`vscode`,`css3`,`django`,`git`,`terminal`,`python`,`github`,`node`,`bootstrap`,`vue`,`react`,`sass`,`sql`,`firebase`]},gaming:{id:`gaming`,label:`Gaming`,icon:`🎮`,motifs:[`controller`,`dice`,`trophy`,`medal`,`target`,`rocket`,`star`,`heart`,`gem`,`shield`,`swords`,`coin`,`ghost`,`mushroom`,`joystick`,`puzzle`,`crown`,`lightning`]},"da-projects":{id:`da-projects`,label:`DA Projects`,icon:`🗂️`,motifs:[`folder`,`chart`,`archive`,`calculator`,`desktop`,`mouse`,`keyboard`,`wrench`,`tools`,`toolbox`,`graph`,`ruler`,`flask`,`plug`,`disk`,`cabinet`,`clipboard`,`printer`]},foods:{id:`foods`,label:`Foods`,icon:`🍔`,motifs:[`burger`,`pizza`,`fries`,`hotdog`,`donut`,`cookie`,`icecream`,`chocolate`,`popcorn`,`croissant`,`apple`,`banana`,`grapes`,`watermelon`,`cherries`,`cake`,`cupcake`,`avocado`]}}}));function c(e,t,n,r){let i=`${e}-${t}`;return`
    <li class="settings__option">
      <input type="radio" name="${e}" value="${t}" id="${i}" ${r?`checked`:``}>
      <label for="${i}">${n}</label>
    </li>`}function ee(){return Object.values(o).filter(e=>e.motifs.length>0).map((e,t)=>c(`theme`,e.id,`${e.icon} ${e.label}`,t===0)).join(``)}function te(){return f.map((e,t)=>c(`playerCount`,String(e.value),e.label,t===1)).join(``)}function ne(){return d.map((e,t)=>c(`boardSize`,e.value,e.label,t===0)).join(``)}function l(e,t,n){return`
    <fieldset class="settings__section">
      <legend>${e} ${t}</legend>
      <ul class="settings__options">${n}</ul>
    </fieldset>`}function re(){return Object.values(o).find(e=>e.motifs.length>0).id}function u(e){let t=o[e].icon;return`
    <div class="settings__stage" id="preview-stage" data-theme="${e}">
      <div class="settings__preview-card">${t}</div>
      <div class="settings__preview-card">${t}</div>
    </div>`}function ie(){return`
    <form id="settings-form" class="settings__form">
      ${l(`🎨`,`Game themes`,ee())}
      ${l(`👤`,`Players`,te())}
      ${l(`▦`,`Board size`,ne())}
      <button type="submit" class="button button--primary">▶ Start</button>
    </form>`}function ae(){return`
    <div class="settings__preview">
      ${u(re())}
      <p class="settings__breadcrumb">Game theme / Players / Board size</p>
    </div>`}function oe(){return`
    <div class="settings">
      <h1 class="settings__title">Settings</h1>
      <div class="settings__layout">${ie()}${ae()}</div>
    </div>`}function se(e){e.addEventListener(`change`,()=>{let t=new FormData(e).get(`theme`),n=e.parentElement?.querySelector(`#preview-stage`);n&&(n.outerHTML=u(t))})}function ce(e){let t=new FormData(e);return{theme:t.get(`theme`),boardSize:t.get(`boardSize`),playerCount:Number(t.get(`playerCount`))}}function le(e,t){e.innerHTML=oe();let n=e.querySelector(`#settings-form`);se(n),n.addEventListener(`submit`,e=>{e.preventDefault(),t(ce(n))})}var d,f,ue=e((()=>{s(),d=[{value:`4x4`,label:`16 cards`},{value:`4x6`,label:`24 cards`},{value:`6x6`,label:`36 cards`}],f=[{value:1,label:`1 Player (vs Computer)`},{value:2,label:`2 Players`},{value:3,label:`3 Players`},{value:4,label:`4 Players`}]}));function p(e){return e===1?m.slice(0,2):m.slice(0,e)}function de(e){return e===1?`orange`:null}var m,h,g=e((()=>{m=[`blue`,`orange`,`green`,`purple`],h={blue:`Blue`,orange:`Orange`,green:`Green`,purple:`Purple`}}));function fe(){return S||=new AudioContext,S}function pe(e,t,n){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(.18,t+.015),e.gain.exponentialRampToValueAtTime(1e-4,t+n)}function _(e,t,n=0,r=`triangle`){let i=fe(),a=i.currentTime+n,o=i.createOscillator(),s=i.createBiquadFilter(),c=i.createGain();o.type=r,o.frequency.value=e,s.type=`lowpass`,s.frequency.value=2200,pe(c,a,t),o.connect(s).connect(c).connect(i.destination),o.start(a),o.stop(a+t+.02)}function v(){_(700,.07,0,`sine`)}function y(){_(523,.18),_(659,.18,.06),_(784,.22,.12)}function me(){_(311,.16,0,`sine`),_(233,.2,.1,`sine`)}function b(){_(523,.16),_(659,.16,.14),_(784,.16,.28),_(1047,.35,.42)}function x(){_(349,.3,0,`sine`),_(311,.35,.25,`sine`)}var S,C=e((()=>{S=null}));function he(e){return`<div class="gameover__scores">${Object.entries(e).map(([e,t])=>`<span class="game-bar__score game-bar__score--${e}">${h[e]} ${t}</span>`).join(``)}</div>`}function w(e){let t=Object.entries(e),n=Math.max(...t.map(([,e])=>e));return t.filter(([,e])=>e===n).map(([e])=>e)}function ge(){return`
    <span class="gameover__icon">⚖️</span>
    <p class="gameover__winner">It's a draw</p>`}function _e(e){return`
    <span class="gameover__icon">🎉</span>
    <p class="gameover__result">The winner is</p>
    <p class="gameover__winner gameover__winner--${e}">${h[e]} player</p>`}function ve(e){let t=w(e);return t.length>1?ge():_e(t[0])}function ye(e){return`
    <section class="gameover">
      <h1 class="gameover__title">Game over</h1>
      <p class="gameover__label">Final score</p>
      ${he(e)}
      ${ve(e)}
      <button id="restart-btn" class="button button--primary" type="button">Back to start</button>
    </section>`}function be(e,t,n){e.innerHTML=ye(t),e.querySelector(`#restart-btn`)?.addEventListener(`click`,n),w(t).length>1?x():b()}var xe=e((()=>{g(),C()})),T,E=e((()=>{T=class{id;pairId;label;imageUrl;isFlipped=!1;isMatched=!1;constructor(e,t,n,r){this.id=e,this.pairId=t,this.label=n,this.imageUrl=r}}}));function D(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function O(e,t){return D([...o[e].motifs]).slice(0,j[t])}function k(e,t,n,r){return new T(e,t,n,`/images/${r}/${n}.svg`)}function A(e,t){return D(O(e,t).flatMap((t,n)=>[k(n*2,n,t,e),k(n*2+1,n,t,e)]))}var j,M=e((()=>{E(),s(),j={"4x4":8,"4x6":12,"6x6":18}}));function Se(e){return`
    <button class="card" type="button" data-id="${e.id}">
      <span class="card__inner">
        <span class="card__face card__face--back">${N}</span>
        <span class="card__face card__face--front">
          <img src=".${e.imageUrl}" alt="${e.label}">
        </span>
      </span>
    </button>`}function Ce(e,t){return`
    <section class="board" data-size="${t}">
      ${e.map(Se).join(``)}
    </section>`}var N,we=e((()=>{N=`
  <svg width="48%" height="48%" viewBox="0 0 48 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="1" width="46" height="28" rx="4"></rect>
    <polyline points="18 9 12 15 18 21"></polyline>
    <polyline points="30 9 36 15 30 21"></polyline>
    <line x1="14" y1="34" x2="22" y2="34"></line>
    <line x1="26" y1="34" x2="34" y2="34"></line>
  </svg>`}));function Te(e,t){return`<span class="game-bar__score game-bar__score--${e}">${e===t?`Computer 🤖`:h[e]} <output id="score-${e}">0</output></span>`}function Ee(e,t){return`
    <header id="game-bar" class="game-bar">
      <div class="game-bar__scores">
        ${e.map(e=>Te(e,t)).join(``)}
      </div>
      <span class="game-bar__current">
        Am Zug <span class="game-bar__dot"></span>
      </span>
      <button id="exit-game-btn" class="button button--ghost" type="button">Exit game</button>
    </header>`}var De=e((()=>{g()}));function Oe(){return`
    <div class="popup-overlay" id="exit-popup">
      <div class="popup">
        <p class="popup__title">Are you sure you want to quit the game?</p>
        <div class="popup__actions">
          <button class="button button--secondary" id="popup-resume" type="button">Back to game</button>
          <button class="button button--outline" id="popup-exit" type="button">Exit game</button>
        </div>
      </div>
    </div>`}function ke(e,t){e.insertAdjacentHTML(`beforeend`,Oe());let n=e.querySelector(`#exit-popup`);n.querySelector(`#popup-resume`)?.addEventListener(`click`,()=>n.remove()),n.querySelector(`#popup-exit`)?.addEventListener(`click`,t)}var Ae=e((()=>{}));function P(){return L[z]}function F(){return{...R}}function je(){let e=P();R[e]=(R[e]??0)+1,I()}function Me(){z=(z+1)%L.length,I()}function Ne(e){L=e,R=Object.fromEntries(e.map(e=>[e,0])),z=0,I()}function I(){for(let e of L){let t=document.getElementById(`score-${e}`);t&&(t.textContent=String(R[e]??0))}let e=document.getElementById(`game-bar`);e&&(e.dataset.activePlayer=P())}var L,R,z,Pe=e((()=>{L=[`blue`,`orange`],R={},z=0}));function Fe(e,t,n,r){q=e,Q=n,$=r,Z=de(t.playerCount),J=A(t.theme,t.boardSize),Y=[],X=!1,document.body.dataset.theme=t.theme,Ie(t),Ne(p(t.playerCount))}function Ie(e){let t=p(e.playerCount);q.innerHTML=`<main class="game-screen">${Ee(t,Z)}${Ce(J,e.boardSize)}</main>`,q.addEventListener(`click`,Le),q.querySelector(`#exit-game-btn`)?.addEventListener(`click`,()=>ke(q,$))}function B(e){return q.querySelector(`.card[data-id="${e.id}"]`)}function Le(e){let t=e.target.closest(`.card`);if(X||!t||P()===Z)return;let n=J.find(e=>e.id===Number(t.dataset.id));!n||n.isFlipped||n.isMatched||(H(n,t),Y.length===2&&U())}function Re(){let e=J.filter(e=>!e.isFlipped&&!e.isMatched);return e[Math.floor(Math.random()*e.length)]}function V(){let e=Re();e&&(H(e,B(e)),Y.length===2?U():window.setTimeout(V,K))}function ze(){P()===Z&&window.setTimeout(V,K)}function H(e,t){e.isFlipped=!0,t.classList.add(`is-flipped`),Y.push(e),v()}function U(){let[e,t]=Y;if(X=!0,e.pairId===t.pairId){Be(e,t);return}me(),window.setTimeout(()=>Ve(e,t),G)}function Be(e,t){let n=P();for(let r of[e,t])r.isMatched=!0,B(r).classList.add(`is-matched`,`is-matched--${n}`);y(),je(),W(!0)}function Ve(e,t){for(let n of[e,t])n.isFlipped=!1,B(n).classList.remove(`is-flipped`);W(!1)}function W(e){if(Y=[],X=!1,e||Me(),J.every(e=>e.isMatched))return He();ze()}function He(){Q(F())}var G,K,q,J,Y,X,Z,Q,$,Ue=e((()=>{M(),we(),De(),Ae(),g(),Pe(),C(),G=800,K=700,J=[],Y=[],X=!1,Z=null,Q=()=>{},$=()=>{}}));t((()=>{n(),a(),ue(),xe(),Ue();function e(e){i(e,()=>t(e))}function t(e){le(e,t=>r(e,t))}function r(t,n){Fe(t,n,e=>o(t,e),()=>e(t))}function o(t,n){be(t,n,()=>e(t))}function s(){let t=document.getElementById(`content`);t&&e(t)}document.addEventListener(`DOMContentLoaded`,s)}))();