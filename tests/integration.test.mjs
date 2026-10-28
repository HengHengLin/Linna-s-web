import test from 'node:test';
import assert from 'node:assert/strict';
import {assessCompetition,scoreDimensions} from '../src/embodied/models.js';
import {license,licenseDefaults} from '../src/biopharma/models.js';
import {researchRouteTitle} from '../src/route-titles.js';
import {searchKnowledge} from '../src/knowledge/search.js';
import * as knowledge from '../src/knowledge/data.js';
import {companies} from '../src/data/companies/registry.js';
test('full evidence coverage tolerates decimal weight summation without inventing missing scores',()=>{
  const rows=scoreDimensions.map(name=>({name,weight:1/9,score:5,evidence:[{url:'https://example.org/evidence',date:'2026-10-28',scope:'test fixture only'}]}));
  assert.ok(Math.abs(assessCompetition(rows).score-5)<1e-8);
  rows[0].score=null;assert.equal(assessCompetition(rows).score,null);
});
test('license cash flow years must be integer calendar years',()=>{
  assert.throws(()=>license({...licenseDefaults,salesYear:2032.5}));
  const x=structuredClone(licenseDefaults);x.items[0].year=2026.5;assert.throws(()=>license(x));
});
test('local research routes have meaningful titles independent of public JSON entries',()=>{
  for(const id of ['aerospace','biopharma','embodied-ai'])assert.ok(researchRouteTitle({page:'industry',id}));
  assert.equal(researchRouteTitle({page:'industry',id:'missing'}),null);
  assert.equal(researchRouteTitle({page:'knowledge',id:'hypothesis:ai-optical-demand'}),'研究假设档案');
  assert.equal(researchRouteTitle({page:'perspectives',id:'bl-potential-2023'}),'研究者观点档案');
});
test('knowledge search follows explicit IDs and respects perspective and hypothesis filters',()=>{
  const byCode=searchKnowledge(knowledge,companies,{q:'688506.SH'});
  assert.equal(byCode.views.length,2);assert.equal(byCode.matchingCompanies.length,1);
  const byAuthor=searchKnowledge(knowledge,companies,{researcher:'yi-zhu'});
  assert.equal(byAuthor.views.length,1);assert.deepEqual(byAuthor.matchingCompanies.map(c=>c.id),['688506.SH']);
  assert.equal(byAuthor.hypotheses.length,0);
  assert.equal(searchKnowledge(knowledge,companies,{company:'600519.SH'}).hypotheses.length,0);
  assert.equal(searchKnowledge(knowledge,companies,{q:'300308.SZ'}).hypotheses.length,1);
  assert.equal(searchKnowledge(knowledge,companies,{stance:'负面'}).matchingCompanies.length,0);
});
