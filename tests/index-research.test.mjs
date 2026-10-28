import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseRoute,routeUrl} from '../src/routes.js';
const data=JSON.parse(fs.readFileSync(new URL('../src/index-research.json',import.meta.url)));
test('research outlines remain unapproved and link to shareable index topics',()=>{
 assert.equal(data.ownerApproved,false);
 assert.equal(data.status,'research-outline');
 assert.equal(data.indices.length,3);
 assert.equal(data.industries.length,3);
 for(const x of data.indices){assert.deepEqual(parseRoute(routeUrl('index-research',x.id)),{page:'index-research',id:x.id});assert.ok(x.companies.length);assert.ok(x.counter);assert.equal(x.weights,undefined);}
});
