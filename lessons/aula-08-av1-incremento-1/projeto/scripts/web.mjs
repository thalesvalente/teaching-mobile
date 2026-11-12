import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import path from 'node:path';
import {PROJECT_ROOT} from './preflight.mjs';
const port=Number(process.env.PORT || 8088);
if (!Number.isInteger(port)||port<1024||port>65535) throw new Error('Use PORT entre 1024 e 65535.');
const allowed=new Set(['/web/index.html','/web/app.mjs','/web/style.css','/src/equipe.mjs','/src/dados.mjs']);
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const base=await realpath(PROJECT_ROOT);
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost'),pathname=url.pathname==='/'?'/web/index.html':url.pathname;
    if (req.method!=='GET'||!allowed.has(pathname)) {res.writeHead(404);res.end('Arquivo não disponível.');return;}
    const filename=path.join(base,pathname);
    if (await realpath(filename)!==filename) throw new Error('Link não permitido');
    const bytes=await readFile(filename);
    res.writeHead(200,{'Content-Type':types[path.extname(filename)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});res.end(bytes);
  } catch {res.writeHead(500);res.end('Não foi possível abrir o laboratório.');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Porta ${port} ocupada. Feche o outro laboratório e tente novamente.`:'Não foi possível iniciar o servidor local.');process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Aula 08: abra http://127.0.0.1:${port}\nEdite src/equipe.mjs, salve e atualize a página. Ctrl+C encerra.`));
