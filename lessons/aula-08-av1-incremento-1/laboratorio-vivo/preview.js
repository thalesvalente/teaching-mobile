/** Aula 08 · Executor React Native Web isolado em iframe sandbox, sem servidor. */
(()=>{
'use strict';
// The four trusted scripts have loaded. A cumulative policy now denies any new
// script source, while preserving the compiler's eval inside the opaque iframe.
// It is deliberately applied before accepting or compiling student source.
const runtimePolicy=document.createElement('meta');
runtimePolicy.httpEquiv='Content-Security-Policy';
runtimePolicy.content="script-src 'unsafe-eval'";
document.head.appendChild(runtimePolicy);
const sender=window.parent;
const {React,ReactDOMClient,RNWeb,Babel}=window.LabVendor||{};
let app=null, renderError=null, token='',generation=0,webRoot=null,mobileRoot=null,readyConfirmed=false;
const post=(type,details={})=>sender.postMessage({from:'ifma-mobile-a08',type,token,...details},'*');
function compile(source){return window.MobileA08Compiler.compile(source,{React,ReactDOMClient,RNWeb,Babel});}
function detach(){if(webRoot){webRoot.unmount();webRoot=null;}if(mobileRoot){mobileRoot.unmount();mobileRoot=null;}}
async function mount(){detach();renderError=null;const options={onUncaughtError:error=>{renderError=error;}};webRoot=ReactDOMClient.createRoot(document.getElementById('web-root'),{...options,identifierPrefix:'a08-web-'});mobileRoot=ReactDOMClient.createRoot(document.getElementById('mobile-root'),{...options,identifierPrefix:'a08-mobile-'});webRoot.render(React.createElement(app.default));mobileRoot.render(React.createElement(app.default));await new Promise(r=>setTimeout(r,120));if(renderError)throw renderError;}
const casos=window.MobileA08Criteria.create(new Proxy({}, {get:(_,name)=>app?.[name]}));
const byId=new Map(casos.map(t=>[t.id,t]));
function check(stage){const entry=byId.get(stage);if(!entry)throw Error('Critério inexistente.');entry.run();return {ok:true,detail:entry.descricao};}
window.addEventListener('message',async event=>{
 if(event.source!==sender)return;
 const msg=event.data;
 if(!msg||!['READY_ACK','RUN','CHECK','CHECK_ALL'].includes(msg.type))return;
 if(msg?.from==='ifma-mobile-a08-host'&&msg.type==='READY_ACK'&&typeof msg.token==='string'&&msg.token.length<=100){readyConfirmed=true;token=msg.token;return;}
 if(!msg||msg.from!=='ifma-mobile-a08-host'||typeof msg.token!=='string'||msg.token.length>100||!Number.isSafeInteger(msg.revision)||msg.revision<0||!Number.isSafeInteger(msg.runId)||msg.runId<1)return;
 if(!readyConfirmed||msg.token!==token)return;const id=++generation,version={revision:msg.revision,runId:msg.runId};
 try{
   if(msg.type==='RUN'){
     app=null;detach();app=compile(msg.source);await mount();if(id===generation)post('COMPILED',{ok:true,...version});
   } else if(msg.type==='CHECK'){
     if(!app)throw Error('Execute o TSX antes de conferir.');
     const result=check(msg.stage);if(id===generation)post('CHECKED',{stage:msg.stage,...result,...version});
   } else if(msg.type==='CHECK_ALL'){
     if(!app)throw Error('Execute o TSX antes de conferir.');
     if(!Array.isArray(msg.stages)||msg.stages.length!==casos.length||new Set(msg.stages).size!==casos.length||msg.stages.some(stage=>!byId.has(stage)))throw Error('Conjunto de critérios incompatível.');
     const results=[];for(const stage of msg.stages){
       if(id!==generation)return;
       try{const c=check(stage);results.push({stage,ok:c.ok,detail:c.detail});}
       catch(e){results.push({stage,ok:false,detail:String(e?.message||e).slice(0,450)});}
     }if(id===generation)post('CHECKED_ALL',{results,...version});
   }
 }catch(e){if(id!==generation)return;const type=msg.type==='CHECK_ALL'?'CHECKED_ALL':msg.type==='CHECK'?'CHECKED':'COMPILED';post(type,{stage:msg.stage,ok:false,detail:String(e?.message||e).slice(0,450),...version});}
});
function announceReady(attempt=0){if(readyConfirmed||attempt>=20)return;post('READY');setTimeout(()=>announceReady(attempt+1),300);}announceReady();
})();
