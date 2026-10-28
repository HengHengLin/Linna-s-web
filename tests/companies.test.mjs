import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateCompanies} from '../src/data/companies/model.js';
import {parseRoute,routeUrl} from '../src/routes.js';
const rows=JSON.parse(fs.readFileSync(new URL('../src/data/companies/candidates.json',import.meta.url)));
const topics=['star50','sse50','chinext'];
test('15 stable company IDs retain candidate status and shareable detail routes',()=>{
 assert.equal(validateCompanies(rows,topics).length,15);
 for(const c of rows){assert.equal(c.ownerApproved,false);assert.equal(c.indices[0].weight,null);assert.deepEqual(parseRoute(routeUrl('index-research',`company:${c.id}`)),{page:'index-research',id:`company:${c.id}`});}
});
test('unsupported ownership, weights, customer evidence and author attribution fail',()=>{
 const change=fn=>{const x=structuredClone(rows);fn(x[0]);assert.throws(()=>validateCompanies(x,topics));};
 change(c=>c.actualController.value='未经证实的控制人');
 change(c=>c.indices[0].weight=12);
 change(c=>c.customers=[{name:'未经证实的客户',evidence:[]}]);
 change(c=>c.viewpointLinks=[{viewpointId:'x',relationship:'author-explicit',quote:'明确提及',evidence:[]}]);
 change(c=>c.researchLinks=[{topicId:'unknown',relationship:'site-extension'}]);
 assert.throws(()=>validateCompanies([...rows,rows[0]],topics));
});
import {companiesForViewpoint} from '../src/data/companies/model.js';
test('viewpoint lookup preserves explicit mentions versus site extensions',()=>{
 const x=structuredClone(rows);x[0].viewpointLinks=[{viewpointId:'v1',relationship:'site-extension'}];
 assert.equal(companiesForViewpoint(x,'v1')[0].label,'本站延伸关联');
 assert.equal(companiesForViewpoint(x,'v1')[0].companyId,'688981.SH');
 assert.equal(companiesForViewpoint(x,'unknown').length,0);
});
