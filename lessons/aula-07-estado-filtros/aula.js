(() => {
'use strict';const $=id=>document.getElementById(id),S=window.SLIDES7,L=window.Lab7,A=window.Aula7;let current=0,reading=innerWidth<1100||innerHeight<620,lectureGame=null,printBackup=null;const labs=new Map();
$('deck').innerHTML=S.map((s,i)=>`<section class="slide ${i===0?'cover':''}" id="${s.id}" aria-labelledby="t${i}"><div class="meta"><span>AULA 07 · ${s.kind} · ${s.time}</span><strong>IFMA</strong></div><h1 class="title" id="t${i}">${s.title}</h1><div class="content">${s.body}</div><footer><span>${s.url?`<a href="${s.url}" target="_blank" rel="noopener">${s.source}</a>`:s.source} · dados fictícios</span><b>${String(i+1).padStart(2,'0')} / ${S.length}</b></footer></section>`).join('');
const slides=[...document.querySelectorAll('.slide')];$('indexList').innerHTML=S.map((s,i)=>`<button type="button" data-jump="${i}">${i+1} · ${s.title}</button>`).join('');
function setup(el){const o=JSON.parse(el.dataset.demo);labs.get(el)?.dispose();labs.set(el,L.montar(el,{...o,config:{...A.GOOD,...(o.config||{})}}));}
document.querySelectorAll('[data-demo]').forEach(setup);
function fit(){const bar=$('toolbar').offsetHeight+6;document.documentElement.style.setProperty('--toolbar-space',(bar+24)+'px');document.documentElement.style.scrollPaddingBottom=(bar+24)+'px';$('viewport').style.bottom=bar+'px';document.documentElement.style.setProperty('--scale',String(Math.max(.1,Math.min((innerWidth-10)/1280,(innerHeight-bar-6)/720))));if(reading)$('deck').style.marginBottom=(bar+20)+'px';}
function show(n,hash=true){if(printBackup)return;current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>{s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',String(!reading&&i!==current));});$('counter').textContent=(current+1)+' / '+slides.length;$('prev').disabled=!current;$('next').disabled=current===slides.length-1;$('notesText').textContent=S[current].time+' · '+S[current].note;if(hash){try{history.replaceState(null,'','#'+slides[current].id);}catch{}}if(reading&&hash)slides[current].scrollIntoView({block:'start'});fit();}
function readHash(){if(printBackup)return;const m=location.hash.match(/^#s(\d{2})$/);show(m?Number(m[1])-1:0,false);if(reading&&m)slides[current].scrollIntoView({block:'start'});}
function setReading(v){
 if(printBackup)return;
 const entering=!reading&&Boolean(v);
 reading=Boolean(v);
 document.body.classList.toggle('reading',reading);
 $('readingBtn').textContent=reading?'Modo slides':'Leitura';
 $('readingBtn').setAttribute('aria-pressed',String(reading));
 slides.forEach((s,i)=>s.setAttribute('aria-hidden',String(!reading&&i!==current)));
 fit();
 if(entering)slides[current].scrollIntoView({block:'start',behavior:'instant'});
}
function reset(){slides[current].querySelectorAll('[data-demo]').forEach(setup);slides[current].querySelectorAll('[data-answer]').forEach(b=>{b.setAttribute('aria-expanded','false');b.nextElementSibling.hidden=true;});if(current===4){$('eventoBusca').value='';$('eventoValor').textContent='""';}}
$('prev').onclick=()=>show(current-1);$('next').onclick=()=>show(current+1);$('readingBtn').onclick=()=>setReading(!reading);$('resetBtn').onclick=reset;
for(const [b,d]of [['indexBtn','indexDialog'],['codeBtn','codeDialog'],['conceptBtn','conceptDialog'],['notesBtn','notesDialog']])$(b).onclick=()=>$(d).showModal();
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('indexList').onclick=e=>{const b=e.target.closest('[data-jump]');if(b){$('indexDialog').close();show(Number(b.dataset.jump));}};
document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const a=b.nextElementSibling;a.hidden=!a.hidden;b.setAttribute('aria-expanded',String(!a.hidden));});
$('eventoBusca').oninput=e=>$('eventoValor').textContent=JSON.stringify(e.target.value);
document.querySelector('[data-fix-source]').onclick=e=>{const el=e.target.closest('.slide').querySelector('[data-demo]');labs.get(el).dispose();labs.set(el,L.montar(el));};
document.querySelector('[data-reverse]').onclick=e=>{const lab=labs.get(e.target.closest('.slide').querySelector('[data-demo]'));lab.modelo.base.reverse();lab.render();};
function save(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
const code=window.CODIGO7||{};Object.keys(code).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;$('codeSelect').append(o);});function setCode(){$('fullCode').textContent=code[$('codeSelect').value]||'';}$('codeSelect').onchange=setCode;setCode();
$('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText($('fullCode').textContent);$('codeStatus').textContent='Copiado.';}catch{const r=document.createRange();r.selectNodeContents($('fullCode'));const s=getSelection();s.removeAllRanges();s.addRange(r);$('codeStatus').textContent='Texto selecionado; use Copiar.';}};
$('downloadCode').onclick=()=>save(new Blob([$('fullCode').textContent],{type:'text/plain;charset=utf-8'}),$('codeSelect').value.split('/').at(-1));
function beforePrint(){
 if(printBackup)return;
 if(readingScrollFrame){cancelAnimationFrame(readingScrollFrame);readingScrollFrame=0;}
 printBackup={reading,current,x:scrollX,y:scrollY,aria:slides.map(slide=>slide.getAttribute('aria-hidden'))};
 slides.forEach(slide=>slide.setAttribute('aria-hidden','false'));
 lectureGame?.preparePrint();
}
function afterPrint(){
 if(!printBackup)return;
 const backup=printBackup;
 slides.forEach((slide,i)=>backup.aria[i]===null?slide.removeAttribute('aria-hidden'):slide.setAttribute('aria-hidden',backup.aria[i]));
 reading=backup.reading;current=backup.current;printBackup=null;
 fit();window.scrollTo({left:backup.x,top:backup.y,behavior:'instant'});
 requestAnimationFrame(()=>{if(!printBackup){fit();window.scrollTo({left:backup.x,top:backup.y,behavior:'instant'});}});
}
$('printBtn').onclick=()=>{beforePrint();window.print();};window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);
document.addEventListener('keydown',e=>{if(reading||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||e.target.closest('input,select,textarea,button,a,summary'))return;const k=e.key;if(k==='ArrowRight'||k==='PageDown'){e.preventDefault();show(current+1);}if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();show(current-1);}if(k==='Home')show(0);if(k==='End')show(slides.length-1);});
let readingScrollFrame=0;window.addEventListener('scroll',()=>{if(printBackup||!reading||readingScrollFrame||document.querySelector('dialog[open]'))return;readingScrollFrame=requestAnimationFrame(()=>{readingScrollFrame=0;if(printBackup)return;const index=slides.findIndex(slide=>slide.getBoundingClientRect().bottom>80);if(index>=0&&index!==current)show(index,false);});},{passive:true});
window.addEventListener('resize',()=>{if(printBackup)return;if(innerWidth<1100||innerHeight<620)setReading(true);fit();});window.addEventListener('hashchange',readHash);lectureGame=window.LessonGame.create({lesson:7,showSlide:id=>{show(Number(id.slice(1))-1);const title=slides[current].querySelector('h1');title.tabIndex=-1;title.focus({preventScroll:true});}});document.querySelectorAll('dialog').forEach((d,i)=>{const heading=d.querySelector('h2');if(heading){if(!heading.id)heading.id='dialog-title-'+i;d.setAttribute('aria-labelledby',heading.id);}});setReading(reading);readHash();document.fonts?.ready.then(fit);window.Aula7Deck={game:lectureGame,show,setReading,get current(){return current;},slides,labs,reset,beforePrint,afterPrint};
})();
