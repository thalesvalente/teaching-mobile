/** Browser-only TSX compiler. Opaque iframe+CSP isolate credentials and network.
 * Cooperative budgets catch common loops/recursion; this is NOT an OS resource sandbox.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MobileA08Compiler=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function compile(source,{React,RNWeb,Babel}){
 if(!Babel||!React||!RNWeb)throw Error('Bundle React Native Web indisponível.');
 if(typeof source!=='string'||!source.trim()||source.length>30000)throw Error('Fonte TSX deve ter entre 1 e 30 mil caracteres.');
 const guardName='_a08CooperativeBudget_'+Math.random().toString(36).slice(2);
 const forbidden=new Set(['window','document','parent','top','opener','frames','globalThis','self','location','navigator','fetch','XMLHttpRequest','WebSocket','EventSource','Worker','SharedWorker','importScripts','eval','Function','WebAssembly','localStorage','sessionStorage','indexedDB','caches','require','module','exports','process','Buffer','Deno','Bun','global']);
 const safetyPlugin=({types:t})=>({visitor:{
  ReferencedIdentifier(path){if(forbidden.has(path.node.name)&&!path.scope.getBinding(path.node.name))throw path.buildCodeFrameError('API fora do contrato da bancada: '+path.node.name+'. Use apenas funções de domínio, React e react-native.');},
  ImportDeclaration(path){if(!['react','react-native'].includes(path.node.source.value))throw path.buildCodeFrameError('Importação indisponível nesta bancada.');},
  Import(path){throw path.buildCodeFrameError('Importação dinâmica não é permitida na bancada.');},
  MemberExpression(path){const n=path.node.property;if((!path.node.computed&&n.name==='constructor')||(path.node.computed&&n.value==='constructor'))throw path.buildCodeFrameError('Construção dinâmica de código não é permitida.');},
  ThisExpression(path){throw path.buildCodeFrameError('Use componentes funcionais e funções puras nesta bancada.');},
  Loop(path){const body=path.get('body');if(!body.isBlockStatement())body.replaceWith(t.blockStatement([body.node]));path.get('body').unshiftContainer('body',t.expressionStatement(t.callExpression(t.identifier(guardName),[])));},
  Function(path){if(!path.get('body').isBlockStatement())path.get('body').replaceWith(t.blockStatement([t.returnStatement(path.node.body)]));path.get('body').unshiftContainer('body',t.expressionStatement(t.callExpression(t.identifier(guardName),[])));}
 }});
 const instrumented=Babel.transform(source,{filename:'ProjetoUniversal.tsx',parserOpts:{sourceType:'module',plugins:['typescript','jsx']},plugins:[safetyPlugin],comments:false}).code;
 const transformed=Babel.transform(instrumented,{filename:'ProjetoUniversal.tsx',presets:[['typescript',{isTSX:true,allExtensions:true}],['react',{runtime:'classic'}]],plugins:['transform-modules-commonjs'],comments:false}).code;
 const module={exports:{}};
 function allowed(name){if(name==='react')return React;if(name==='react-native')return RNWeb;throw Error('Importação indisponível nesta bancada: '+String(name));}
 let fuel=0,last=0,started=0;
 const tick=()=>{const now=performance.now();if(now-last>250){fuel=0;started=now;}last=now;if(++fuel>100000||now-started>1500)throw Error('Limite de execução atingido. Revise loops/recursão e execute novamente.');};
 tick();
 (new Function('module','exports','require',guardName,'process','Buffer','global',transformed))(module,module.exports,allowed,tick,undefined,undefined,undefined);
 if(typeof module.exports.default!=='function')throw Error('Exporte o componente padrão ProjetoUniversal.');
 for(const name of ['estadoTela','filtrarOrdenar','obterPorId','validarFormulario','inserirImutavel','resumir'])if(typeof module.exports[name]!=='function')throw Error('Contrato ausente: '+name);
 return module.exports;
}
return Object.freeze({compile});
});
