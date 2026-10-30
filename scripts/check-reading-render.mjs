import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import assert from 'node:assert/strict';
import {loadBooks} from './reading.mjs';
const server=await createServer({optimizeDeps:{noDiscovery:true,entries:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {default:Reading}=await server.ssrLoadModule('/src/components/Reading.jsx');
 const {default:Markdown}=await server.ssrLoadModule('/src/components/Markdown.jsx');
 const {default:Header}=await server.ssrLoadModule('/src/components/Header.jsx');
 const books=loadBooks();let checks=0;
 const list=render(React.createElement(Reading,{books}));assert.match(list,/#\/reading\/antifragile/);assert.match(list,/查找书籍/);checks++;
 const detail=render(React.createElement(Reading,{books,selectedId:'antifragile'}));
 for(const text of ['十条核心思想','七部分框架','适用边界与批判性分析','原始资料与延伸阅读','60 秒表达版本']){assert.ok(detail.includes(text));checks++;}
 assert.match(render(React.createElement(Reading,{books,selectedId:'missing'})),/未找到/);checks++;
 const unsafe=render(React.createElement(Markdown,{body:'<script>alert(1)</script>\n\n[bad](javascript:alert(1))'}));assert.ok(!unsafe.includes('<script>'));assert.ok(!unsafe.includes('href="javascript:'));checks++;
 const nav=render(React.createElement(Header,{page:'reading'}));assert.match(nav,/读书笔记/);assert.ok(!nav.includes('交易日志'));assert.ok(!nav.includes('今天学到了什么'));checks++;
 console.log(`${checks} reading render checks passed`);
}finally{await server.close();}
