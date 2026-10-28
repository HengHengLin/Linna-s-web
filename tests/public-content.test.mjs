import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSnapshot } from '../src/public-content.js';
import { loadContent } from '../scripts/content.mjs';
const snapshot = entries=>({schemaVersion:1,updatedAt:'2026-10-10T09:00:00+08:00',entries});
test('remote public snapshots retain all validated history',()=>assert.equal(validateSnapshot(snapshot(loadContent())).length,loadContent().length));
test('remote writes cannot introduce private records, drafts, unsafe links or fake approvals',()=>{
 const original=loadContent().find(x=>x.kind==='research');
 for(const changes of [{kind:'trading'},{status:'draft'},{status:'approved',approvedBy:'AI'},{sources:[{title:'x',url:'javascript:alert(1)'}]}]) assert.throws(()=>validateSnapshot(snapshot([{...original,...changes}])));
 assert.throws(()=>validateSnapshot(snapshot([original,original])));
});
test('remote curated learning cannot count as completed personal learning',()=>{
 const original=loadContent().find(x=>x.status==='curated');
 assert.throws(()=>validateSnapshot(snapshot([{...original,kind:'journal'}])));
});
