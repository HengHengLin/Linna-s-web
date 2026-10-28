import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,rocketCost} from '../src/aerospace/cost.js';
import {aerospaceCompanyProfiles} from '../src/data/companies/aerospace.js';
import {validateCompanies} from '../src/data/companies/model.js';
import {aerospaceArticles} from '../src/aerospace/articles.js';
import {parseRoute} from '../src/routes.js';
test('rocket model charges full fleet and charges refurbishment only after first flight',()=>{
 const one=rocketCost({...defaults,uses:1});assert.equal(one.vehicles,12);assert.equal(one.refurbishments,0);const r=rocketCost(defaults);assert.equal(r.vehicles,2);assert.equal(r.refurbishments,10);assert.equal(r.total,r.manufacturing+r.operations+r.refurbishment+r.fixed);
});
test('high refurbishment, low frequency, price and payload sensitivity are economically consistent',()=>{
 const r=rocketCost(defaults);assert.ok(rocketCost({...defaults,refurbishment:1000}).perKg>rocketCost({...defaults,uses:1}).perKg);assert.ok(rocketCost({...defaults,launches:1}).perKg>r.perKg);assert.ok(rocketCost({...defaults,price:40}).margin<r.margin);assert.equal(rocketCost({...defaults,payload:defaults.payload/2}).perKg,r.perKg*2);assert.equal(rocketCost({...defaults,utilization:.4}).perKg,r.perKg*2);assert.equal(rocketCost({...defaults,uses:100,launches:1}).vehicles,1);
});
test('invalid units, negative and zero denominator inputs are rejected',()=>{
 for(const patch of [{uses:0},{uses:1.5},{launches:0},{payload:0},{years:0},{manufacturing:0},{price:0},{utilization:0},{utilization:2},{refurbishment:-1},{operations:NaN},{moneyUnit:'元'},{payloadUnit:'tonnes'}])assert.throws(()=>rocketCost({...defaults,...patch}));
 assert.doesNotThrow(()=>rocketCost({...defaults,refurbishment:0,operations:0,fixedAnnual:0}));
});
test('eight candidates reuse company schema without inventing membership or financial exposure',()=>{
 assert.equal(validateCompanies(aerospaceCompanyProfiles,['star50','sse50','chinext']).length,8);assert.equal(aerospaceArticles.length,3);for(const c of aerospaceCompanyProfiles){assert.deepEqual(c.indices,[]);assert.equal(c.aerospaceResearch.revenueExposure,null);assert.equal(c.ownerApproved,false);}assert.deepEqual(parseRoute('#/industry/aerospace'),{page:'industry',id:'aerospace'});
});
