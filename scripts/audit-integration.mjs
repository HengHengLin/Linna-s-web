import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const rows=[];
try {
 const load=path=>server.ssrLoadModule(`/src/${path}`);
 const {companies}=await load('data/companies/registry.js');
 const {chainNames}=await load('data/companies/model.js');
 const k=await load('knowledge/data.js');
 const {pipelines}=await load('biopharma/data.js');
 const {default:Index}=await load('components/IndexResearch.jsx');
 const {default:Knowledge}=await load('components/Knowledge.jsx');
 const render=(route,Component,props={})=>{
   const html=renderToStaticMarkup(React.createElement(Component,props));
   assert.match(html,/<h1[ >]/,route);assert.doesNotMatch(html,/NaN|undefined|Infinity/,route);
   for(const [,src] of html.matchAll(/<img[^>]+src="([^"]+)"/g))if(src.startsWith('/research/'))assert.ok(existsSync(`public${src}`),src);
   rows.push({route,htmlBytes:Buffer.byteLength(html),inputs:(html.match(/<input/g)||[]).length,buttons:(html.match(/<button/g)||[]).length});
 };
 for(const topicId of [null,'star50','sse50','chinext','article:a','article:b','article:c',...companies.map(c=>`company:${c.id}`),...Object.keys(chainNames).map(id=>`chain:${id}`)])render(`index-research/${topicId||''}`,Index,{topicId});
 for(const selectedId of [null,...k.perspectives.map(p=>p.id),...k.hypotheses.map(h=>`hypothesis:${h.id}`)])render(`knowledge/${selectedId||''}`,Knowledge,{selectedId});
 for(const [name,route] of [['Aerospace','aerospace'],['Biopharma','biopharma'],['EmbodiedAI','embodied-ai']]){const {default:Component}=await load(`components/${name}.jsx`);render(`industry/${route}`,Component);}
 const prodTests=execFileSync('git',['ls-tree','-r','--name-only','e356581','tests'],{encoding:'utf8'}).trim().split('\n');
 const names=s=>[...s.matchAll(/test\(\s*['"]([^'"\n]+)['"]/g)].map(x=>x[1]);
 const baseline=prodTests.flatMap(path=>names(execFileSync('git',['show',`e356581:${path}`],{encoding:'utf8'})));
 const integrated=readdirSync('tests').filter(p=>p.endsWith('.test.mjs')).flatMap(p=>names(readFileSync(`tests/${p}`,'utf8')));
 assert.equal(baseline.length,22);for(const name of baseline)assert.ok(integrated.includes(name),`missing baseline: ${name}`);
 const protectedFiles=['.github/workflows/check.yml','.github/workflows/pages.yml','.github/workflows/content.yml','src/sync/content-client.js','src/sync/use-public-content.js','src/components/SyncStatus.jsx','src/public-content.js','public/content.json'];
 for(const path of protectedFiles)assert.equal(readFileSync(path,'utf8'),execFileSync('git',['show',`e356581:${path}`],{encoding:'utf8'}),`production regression: ${path}`);
 const content=JSON.parse(readFileSync('public/content.json','utf8'));
 assert.equal(content.entries.length,56);assert.equal(content.updatedAt,'2026-10-28T14:09:00+08:00');assert.ok(content.entries.some(x=>x.id==='briefing-2026-10-28'));
 const report={verification:'static component rendering, not browser interaction',productionMirrorTree:execFileSync('git',['rev-parse','e356581^{tree}'],{encoding:'utf8'}).trim(),baselineTestsRetained:baseline.length,companies:companies.length,companyChainLinks:companies.reduce((n,c)=>n+c.chains.length,0),perspectives:k.perspectives.length,researchers:k.researchers.length,perspectiveCompanyLinks:k.relationships.length,hypotheses:k.hypotheses.length,canonicalSources:k.sources.length,pipelines:pipelines.length,unlinkedPipelines:pipelines.filter(p=>!p.companyIds.length).map(p=>p.id),contentCount:content.entries.length,updatedAt:content.updatedAt,rendered:rows};
 writeFileSync('docs/integration-audit-results.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,renderedRoutes:rows.length,rendered:undefined},null,2));
} finally {await server.close();}
