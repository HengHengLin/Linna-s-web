import {createServer} from 'vite';import React from 'react';import {renderToStaticMarkup as render} from 'react-dom/server';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const server=await createServer({optimizeDeps:{noDiscovery:true,entries:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{const {default:Monitor}=await server.ssrLoadModule('/src/components/FlowMonitor.jsx');const {default:Chart}=await server.ssrLoadModule('/src/components/FlowChart.jsx');const {securities}=await server.ssrLoadModule('/src/flows/data.js');let checks=0;
for(const s of securities){const html=render(React.createElement(Monitor,{selectedId:s.id}));assert.ok(html.includes(s.id));assert.ok(html.includes(s.name));assert.ok(html.includes('暂无数据'));assert.ok(!html.includes('今天学到了什么'));checks++;}
const btc=render(React.createElement(Monitor,{selectedId:'btc'}));assert.match(btc,/最近 20 个交易日/);assert.match(btc,/CC BY 4.0/);checks++;
assert.match(render(React.createElement(Monitor,{selectedId:'unknown'})),/未找到/);checks++;
const rows=JSON.parse(readFileSync('public/data/flows/btc.json')).rows.slice(-20);const chart=render(React.createElement(Chart,{rows,title:'BTC flow',bar:true,series:[{key:'netFlowUsd',label:'net',unit:'USD',divisor:1,color:'#0d9488'}]}));assert.match(chart,/<rect/);assert.match(chart,/放大图表/);assert.ok(!chart.includes('NaN'));checks++;
console.log(`${checks} flow render checks passed`);
}finally{await server.close();}
