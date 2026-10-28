import test from 'node:test';
import assert from 'node:assert/strict';
import {simulation,demandMappings,realData} from '../src/analysis/data.js';
import {analyze,contributionPP,weightChanges,breadthState,validateSnapshot,demandExposures} from '../src/analysis/math.js';
const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,`${x} != ${y}`);
test('percentage points and returns are distinguished and weighted sum reconciles',()=>{
 close(contributionPP(.1,.05),.5);const a=analyze(simulation);close(a.approxReturn,.04);close(a.equalReturn,-.0033333333333333335);assert.equal(a.up,2);assert.equal(a.down,10);close(a.upRatio,2/12);close(a.topWeight,.975);close(a.rows.reduce((s,x)=>s+x.contributionPP,0),4);assert.equal(a.newHigh,null);assert.equal(a.newLow,null);assert.equal(Object.values(realData).filter(Boolean).length,0);
});
test('HHI uses percent-squared units and industry weights reconcile',()=>{
 const a=analyze(simulation);close(a.hhi,simulation.rows.reduce((s,x)=>s+(x.weight*100)**2,0));close(a.sector.reduce((s,x)=>s+x.weight,0),1);close(a.sector.reduce((s,x)=>s+x.contributionPP,0),4);close(a.ownership.reduce((s,x)=>s+x.weight,0),1);
});
test('mixed dates, invalid weights, missing full samples and false official sources fail',()=>{
 const change=f=>{const x=structuredClone(simulation);f(x);assert.throws(()=>validateSnapshot(x));};
 change(x=>x.rows[0].asOf='2026-10-27');change(x=>x.rows[0].basis='收盘权重');change(x=>x.rows.pop());change(x=>x.rows[0].weight=35);change(x=>x.rows[0].return=NaN);change(x=>x.rows[0].return=-1.1);change(x=>x.rows[1].id=x.rows[0].id);change(x=>x.mode='official');
 assert.throws(()=>contributionPP(10,5));
});
test('cross-date changes use percentage points and reject incompatible bases',()=>{
 const p=structuredClone(simulation);p.asOf='2026-10-27';p.rows.forEach(x=>x.asOf=p.asOf);const c=structuredClone(simulation);c.rows[0].weight+=.01;c.rows[1].weight-=.01;close(weightChanges(p,c)[0].changePP,1);close(weightChanges(p,c)[1].changePP,-1);assert.throws(()=>weightChanges(c,p));p.basis='另一口径';p.rows.forEach(x=>x.basis=p.basis);assert.throws(()=>weightChanges(p,c));
});
test('breadth states compare previous participation and do not predict returns',()=>{
 for(const [r,c,p,expected] of [[.01,.6,.4,'指数上涨且市场广度改善'],[.01,.4,.6,'指数上涨且市场广度恶化'],[-.01,.6,.4,'指数下跌且市场广度改善'],[-.01,.4,.6,'指数下跌且市场广度恶化']])assert.equal(breadthState(r,c,p),expected);
 assert.equal(breadthState(.1,.5,null),'数据不足');assert.equal(breadthState(0,.5,.5),'指数或广度持平');
});
test('demand hypotheses do not become evidence or correlate returns automatically',()=>{
 assert.ok(demandMappings.every(x=>x.status==='hypothesis'&&x.exposureFraction===null));const m=[{companyId:'SIM1',factor:'模拟需求',status:'hypothesis'}];close(demandExposures(simulation,m)[0].weight,.35);assert.equal(demandExposures(simulation,m)[0].status,'hypothesis');assert.throws(()=>demandExposures(simulation,[...m,...m]));assert.throws(()=>demandExposures(simulation,[{...m[0],status:'evidenced'}]));
});
