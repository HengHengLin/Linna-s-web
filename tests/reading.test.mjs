import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadBooks,generateReading} from '../scripts/reading.mjs';
import {validateBook,validateReading,searchBooks} from '../src/reading/schema.js';
import {fetchReading} from '../src/reading/client.js';
import {parseRoute,routeUrl} from '../src/routes.js';
const books=loadBooks(),book=books.find(b=>b.id==='antifragile'),snapshot=JSON.parse(fs.readFileSync(new URL('../public/reading.json',import.meta.url)));
test('one book per Markdown, ten ideas and seven structural parts, no fake personal approval',()=>{
 assert.equal(book.id,'antifragile');assert.equal((book.body.match(/^### \d+\./gm)||[]).length,10);assert.equal((book.body.match(/^### 第[一二三四五六七]部分/gm)||[]).length,7);assert.equal(book.ownerViewpoint,false);assert.equal(book.status,'curated');assert.equal(book.approvedBy,undefined);assert.deepEqual(generateReading({check:true}).books,books);
});
test('reading route and author/topic search',()=>{assert.deepEqual(parseRoute(routeUrl('reading','antifragile')),{page:'reading',id:'antifragile'});assert.ok(searchBooks(books,'Taleb').some(b=>b.id==='antifragile'));assert.ok(searchBooks(books,'不确定性').some(b=>b.id==='antifragile'));assert.equal(searchBooks(books,'not-a-book').length,0);});
test('reject private, unknown, invented approval and unsafe source fields',()=>{for(const change of [{visibility:'private'},{ownerViewpoint:true},{status:'approved'},{privateNotes:'secret'},{sources:[{url:'javascript:alert(1)',title:'bad',checkedAt:'2026-10-30'}]},{sources:[]},{date:'2026-99-99'},{publicationYear:0}])assert.throws(()=>validateBook({...book,...change}));});
test('duplicate IDs and invalid snapshot rejected',()=>{assert.throws(()=>validateReading({...snapshot,books:[book,book]}));assert.throws(()=>validateReading({...snapshot,updatedAt:'invalid'}));assert.throws(()=>validateReading({...snapshot,schemaVersion:2}));});
test('remote reading validation, stale snapshot refusal and errors leave previous object intact',async()=>{
 const original=JSON.stringify(snapshot);const fake=value=>async()=>({ok:true,json:async()=>value});assert.deepEqual(await fetchReading(snapshot,fake(snapshot)),snapshot);
 await assert.rejects(fetchReading(snapshot,fake({...snapshot,updatedAt:'2000-01-01T00:00:00Z'})),/过期/);
 await assert.rejects(fetchReading(snapshot,async()=>({ok:false,status:503})),/503/);
 await assert.rejects(fetchReading(snapshot,fake({...snapshot,books:[{...book,status:'approved'}]})));
 assert.equal(JSON.stringify(snapshot),original);
});
test('daily content and flow files are independent of reading generation',()=>{const paths=['public/content.json','public/data/flows/btc.json','public/data/flows/cn.json'];const before=paths.map(p=>fs.readFileSync(p,'utf8'));generateReading();assert.deepEqual(paths.map(p=>fs.readFileSync(p,'utf8')),before);});
