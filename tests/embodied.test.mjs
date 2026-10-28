import test from 'node:test';
import assert from 'node:assert/strict';
import {allocateCapex,capexDefaults,robotEconomics,robotDefaults,assessCompetition,scoreDimensions} from '../src/embodied/models.js';
import {aiCandidates,viewpointRecords,subsystems} from '../src/embodied/data.js';
import {embodiedNewProfiles} from '../src/data/companies/embodied.js';
import base from '../src/data/companies/candidates.json' with {type:'json'};
import {validateCompanies} from '../src/data/companies/model.js';
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-8);
test('customer capex reconciles and upstream is nested, never additional final demand',()=>{
 const a=allocateCapex(capexDefaults);near(a.tier1.reduce((s,x)=>s+x.value,0),100);near(a.upstream.reduce((s,x)=>s+x.value,0),55);assert.equal(a.total,100);assert.equal(a.valueAdded,null);
 assert.throws(()=>allocateCapex({...capexDefaults,shares:{...capexDefaults.shares,gpu:.1}}));assert.throws(()=>allocateCapex({...capexDefaults,shares:{...capexDefaults.shares,servers:.8}}));assert.throws(()=>allocateCapex({...capexDefaults,budget:0}));assert.throws(()=>allocateCapex({...capexDefaults,budget:-1}));
});
test('BOM, yield, margin and break-even quantities reconcile',()=>{
 const a=robotEconomics(robotDefaults);assert.equal(a.bom,10000);near(a.variable,10000/.9+1500);near(a.gross,30000-a.variable);near(a.margin,a.gross/30000);assert.equal(a.breakEven,Math.ceil(8000000/a.gross));near(a.fixedPerUnit,8000);assert.equal(a.available,1260);
 assert.equal(robotEconomics({...robotDefaults,price:1000}).breakEven,null);
 for(const p of [{yield:0},{deliveries:0},{utilization:0},{price:-1},{deliveries:2000},{afterSales:-1},{currency:'CNY'}])assert.throws(()=>robotEconomics({...robotDefaults,...p}));
});
test('company IDs remain unique and all candidate chain references validate',()=>{
 assert.equal(aiCandidates.length,16);assert.equal(embodiedNewProfiles.length,13);assert.equal(validateCompanies([...base,...embodiedNewProfiles],['star50','sse50','chinext']).length,28);assert.equal(new Set(aiCandidates.map(c=>c.id)).size,16);assert.equal(subsystems.length,3);assert.ok(aiCandidates.every(c=>c.revenue===null&&c.rank===null&&c.relationship==='research-candidate'));assert.equal(viewpointRecords.length,0);
});
test('missing competition evidence is not a zero score and prevents aggregate ratings',()=>{
 const d=scoreDimensions.map(name=>({name,weight:1/9,score:null,evidence:[]}));assert.equal(assessCompetition(d).score,null);assert.equal(assessCompetition(d).coverage,0);d[0].score=5;assert.throws(()=>assessCompetition(d));d[0].evidence=[{url:'https://example.com',date:'2026-10-28',scope:'教学测试证据'}];assert.equal(assessCompetition(d).score,null);near(assessCompetition(d).coverage,1/9);
});
import {validateViewpoints} from '../src/embodied/data.js';
test('viewpoints keep explicit stock mentions separate from site extensions',()=>{
 const r={id:'test',author:'教学作者',organization:'教学机构',date:'2026-10-28',source:'https://example.com',thesis:'教学观点',counterExplanation:'反方解释',evidence:[],metrics:[],explicitStocks:['300308.SZ'],extendedStocks:['300394.SZ']};assert.equal(validateViewpoints([r],aiCandidates.map(c=>c.id)).length,1);assert.throws(()=>validateViewpoints([{...r,extendedStocks:r.explicitStocks}],aiCandidates.map(c=>c.id)));assert.throws(()=>validateViewpoints([{...r,explicitStocks:['FAKE']}],aiCandidates.map(c=>c.id)));
});
