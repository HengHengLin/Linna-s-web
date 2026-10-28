// Read-only acceptance: verifies HTTP artifacts and data pipeline, not browser rendering.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateSnapshot,CONTENT_URL} from '../src/public-content.js';
import {assertExpectedIds,fetchPublicContent} from '../src/sync/content-client.js';
import {parseRoute,pageFor,routeUrl} from '../src/routes.js';
const prefix=process.argv[2]||'/private/tmp/linna-audit-';
const raw=JSON.parse(fs.readFileSync(prefix+'raw','utf8')),staticData=JSON.parse(fs.readFileSync(prefix+'static','utf8'));
const js=fs.readFileSync(prefix+'live.js','utf8');const rows=validateSnapshot(raw);
assert.ok(js.includes(CONTENT_URL),'线上JS缺少Raw地址');assert.ok(js.includes('no-store'),'线上缺少刷新策略');assert.ok(js.includes('600000')||js.includes('6e5'),'线上缺少十分钟轮询');
const runtime=await fetchPublicContent({fetcher:async()=>({ok:true,status:200,json:async()=>raw})});assertExpectedIds(runtime.entries,rows.map(x=>x.id));const staticIds=new Set(validateSnapshot(staticData).map(x=>x.id));const staticMissingIds=rows.filter(x=>!staticIds.has(x.id)).map(x=>x.id);const idsMissingFromBundle=rows.filter(r=>!js.includes(r.id)).map(r=>r.id);
for(const r of rows){const route=parseRoute(routeUrl(pageFor(r.kind),r.id));assert.ok(rows.some(x=>x.id===route.id&&pageFor(x.kind)===route.page));}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),remoteUpdatedAt:raw.updatedAt,staticUpdatedAt:staticData.updatedAt,count:rows.length,staticMissingIds,sameSnapshot:JSON.stringify(raw)===JSON.stringify(staticData),idsMissingFromBundle,browserRenderingVerified:false,note:'静态产物与Raw不一致不必然是错误：运行时应读取Raw；验收使用生产读取函数与抓取的Raw响应验证全部ID；静态包缺新ID只报告，不阻止正常内容更新'},null,2));
