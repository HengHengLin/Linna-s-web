import test from 'node:test';
import assert from 'node:assert/strict';
import {clinical,clinicalDefaults as c,license,licenseDefaults as l,runway,runwayDefaults as r} from '../src/biopharma/models.js';
import {biopharmaProfiles} from '../src/data/companies/biopharma.js';
import {validateCompanies} from '../src/data/companies/model.js';
import {pipelines,licenseCase} from '../src/biopharma/data.js';
test('conditional phase probabilities multiply, include current phase, and handle boundaries',()=>{
 assert.ok(Math.abs(clinical(c).p-.6*.4*.65*.85)<1e-12);assert.equal(clinical({...c,probabilities:[1,1,1,1,1]}).p,1);assert.equal(clinical({...c,probabilities:[0,0,0,0,0]}).p,0);assert.ok(clinical({...c,probabilities:[0,0,0,0,0]}).rnpv<0);
 for(const probabilities of [[1,1,2,1,1],[1,-1,1,1,1]])assert.throws(()=>clinical({...c,probabilities}));
});
test('discount and research expenditure alter model valuations without duplicate license flows',()=>{
 assert.ok(clinical({...c,rd:1000}).rnpv<clinical(c).rnpv);assert.notEqual(clinical({...c,discount:.3}).npv,clinical(c).npv);assert.equal(clinical(c).flows.length,10);assert.equal(clinical(c).license,undefined);
});
test('license zeros, failure probabilities and contractual versus actual money remain distinct',()=>{
 const zero={...l,sales:0,items:l.items.map(x=>({...x,amount:0}))};assert.equal(license(zero).pv,0);const failure=license({...l,salesProbability:0,items:l.items.map(x=>({...x,p:0}))});assert.ok(failure.maximum>0);assert.equal(failure.expected,0);assert.equal(failure.received,null);assert.equal(failure.recognizedRevenue,null);assert.equal(failure.projectNPV,null);assert.equal(licenseCase.maximum,8400);assert.equal(licenseCase.receivedHistorical,800);
 assert.throws(()=>license({...l,items:[...l.items,l.items[0]]}));assert.ok(license({...l,discount:.3}).pv<license(l).pv);
});
test('cash runway distinguishes zero/negative burn, restricted cash and delayed receipts',()=>{
 const zero=runway({...r,monthlyBurn:0,capex:0,debt:0,oneOff:0,funding:0});assert.equal(zero[0].staticMonths,null);assert.equal(zero[0].months,null);assert.equal(runway({...r,monthlyBurn:-10,capex:0})[0].staticMonths,null);assert.ok(runway(r).find(x=>x.name==='融资收紧').ending<runway(r)[0].ending);assert.throws(()=>runway({...r,restricted:r.cash+1}));
});
test('units, negative costs and non-finite inputs reject rather than mix currencies',()=>{
 for(const fn of [()=>clinical({...c,currency:'CNY'}),()=>license({...l,unit:'yuan'}),()=>runway({...r,currency:'HKD'}),()=>clinical({...c,rd:-1}),()=>license({...l,sales:NaN}),()=>runway({...r,capex:-1})])assert.throws(fn);
});
test('candidate company and drug associations are valid and not approved',()=>{
 assert.equal(validateCompanies(biopharmaProfiles,['star50','sse50','chinext']).length,6);const ids=new Set(biopharmaProfiles.map(x=>x.id));assert.equal(new Set(pipelines.map(x=>x.id)).size,pipelines.length);for(const p of pipelines)for(const id of p.companyIds)assert.ok(ids.has(id));for(const x of biopharmaProfiles)assert.equal(x.ownerApproved,false);
});
