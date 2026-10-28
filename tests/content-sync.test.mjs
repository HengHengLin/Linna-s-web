import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContent} from '../scripts/content.mjs';
import {fetchPublicContent,assertExpectedIds} from '../src/sync/content-client.js';
import {routeUrl,parseRoute,pageFor} from '../src/routes.js';
const rows=loadContent();const snap={schemaVersion:1,updatedAt:'2026-10-28T14:09:00+08:00',entries:rows};
const response=data=>({ok:true,status:200,json:async()=>data});
test('remote articles survive fetch, validation, sort and route selection without static replacement',async()=>{
 let options;const result=await fetchPublicContent({fetcher:async(url,opts)=>{options=opts;return response(snap);}});assert.equal(options.cache,'no-store');assertExpectedIds(result.entries,rows.map(x=>x.id));for(const r of result.entries){const route=parseRoute(routeUrl(pageFor(r.kind),r.id));assert.equal(result.entries.find(x=>x.id===route.id&&pageFor(x.kind)===route.page)?.id,r.id);}assert.equal(result.updatedAt,snap.updatedAt);
});
test('HTTP, network, JSON and validation failures retain actionable reasons',async()=>{
 await assert.rejects(()=>fetchPublicContent({fetcher:async()=>({ok:false,status:503})}),/HTTP 503/);
 await assert.rejects(()=>fetchPublicContent({fetcher:async()=>{throw Error('failed');}}),/网络请求失败/);
 await assert.rejects(()=>fetchPublicContent({fetcher:async()=>({ok:true,json:async()=>{throw Error('parse');}})}),/有效JSON/);
 await assert.rejects(()=>fetchPublicContent({fetcher:async()=>response({...snap,entries:[{id:'private',kind:'trading'}]})}),/内容校验失败/);
});
test('older snapshots and missing remote IDs fail acceptance instead of reporting success',async()=>{
 await assert.rejects(()=>fetchPublicContent({fetcher:async()=>response(snap),previousUpdatedAt:'2026-10-29T00:00:00Z'}),/较旧/);assert.throws(()=>assertExpectedIds(rows,['missing-id']),/missing-id/);
});
