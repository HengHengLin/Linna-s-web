import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const load=p=>server.ssrLoadModule(`/src/${p}`);
 const {visitorEntries}=await load('public-visibility.js');
 const entries=visitorEntries(JSON.parse(readFileSync('public/content.json')).entries);
 const {default:Home}=await load('components/Home.jsx');
 const {default:Header}=await load('components/Header.jsx');
 const {CompanyDetail,CompanyList}=await load('components/Companies.jsx');
 const {default:Knowledge}=await load('components/Knowledge.jsx');
 const {default:Index}=await load('components/IndexResearch.jsx');
 const checks=[];
 const home=render(React.createElement(Home,{entries}));
 assert.match(home,/你好，我是 Linna/);assert.doesNotMatch(home,/云端|今天学到了什么|最新学习材料|审核|模板|待核实/);checks.push('personal-home');
 const nav=render(React.createElement(Header,{page:'home'}));assert.doesNotMatch(nav,/交易日志|观点库/);assert.match(nav,/English Lab/);checks.push('navigation');
 const smic=render(React.createElement(CompanyDetail,{id:'688981.SH'}));assert.match(smic,/3,005.6/);assert.match(smic,/2026 H1/);assert.doesNotMatch(smic,/待核实|候选产业链环节/);checks.push('smic-evidence-profile');
 const hidden=render(React.createElement(CompanyDetail,{id:'688012.SH'}));assert.match(hidden,/尚未公开/);assert.doesNotMatch(hidden,/中微公司|主要产品待核实/);checks.push('hidden-empty-profile');
 const list=render(React.createElement(CompanyList,{}));assert.match(list,/中芯国际/);assert.doesNotMatch(list,/中微公司/);checks.push('curated-company-list');
 for(const topicId of ['star50','sse50','chinext']){const html=render(React.createElement(Index,{topicId}));assert.match(html,/产业链拆解/);assert.doesNotMatch(html,/科技产业的发展，如何转化为上市公司的财务表现/);checks.push(topicId);}
 const knowledge=render(React.createElement(Knowledge,{entries}));assert.match(knowledge,/研究知识网络/);assert.doesNotMatch(knowledge,/学习笔记模板|候选产业链环节|不是 Linna 已批准/);checks.push('knowledge');
 const snapshot=JSON.parse(readFileSync('public/content.json'));
 assert.ok(snapshot.entries.length>0);assert.ok(entries.every(e=>e.status!=='demo'&&e.kind!=='journal')); 
 // Sensitive record payloads must not reach any built asset, even on a hidden route.
 const {readdirSync}=await import('node:fs');for(const file of readdirSync('dist/assets')){const body=readFileSync(`dist/assets/${file}`,'utf8');assert.ok(!body.includes('演示：练习区分投资逻辑、交易执行与组合风险'),'retired record in build');}
 writeFileSync('docs/public-experience-checks.json',JSON.stringify({checks,publicJsonEntries:snapshot.entries.length,visitorEntries:entries.length,retiredJournalIdsExcluded:['j1'],browserChecksRecordedSeparately:true},null,2)+'\n');
 console.log(`${checks.length} targeted render checks passed; public content and visitor filtering verified; retired journal absent from build`);
}finally{await server.close();}
