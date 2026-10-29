import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {visitorEntries,withoutRetiredContent} from '../src/public-visibility.js';
import {validateSnapshot} from '../src/public-content.js';
import {fetchPublicContent} from '../src/sync/content-client.js';
import {parseRoute} from '../src/routes.js';
import {companies} from '../src/data/companies/registry.js';
import {companyPublication,publicProfiles,visibleCompanies} from '../src/data/companies/public-profiles.js';
import {marketWidgetConfig} from '../src/market-dashboard.js';
const current=JSON.parse(fs.readFileSync(new URL('../public/content.json',import.meta.url)));
test('retired learning record is excluded from JSON; other published entries are unchanged',()=>{
 assert.ok(current.entries.some(e=>e.id==='briefing-2026-10-28'));
 assert.ok(current.entries.length>0);assert.ok(current.entries.every(e=>e.kind!=='journal'));
});
test('legacy cloud journals never reach visitor state and new public snapshots reject journals',async()=>{
 const old={...current,entries:[...current.entries,{...current.entries[0],id:'retired-test',kind:'journal',body:'private test fixture',oneLine:'fixture'}]};
 assert.throws(()=>validateSnapshot(old));
 const sanitized=withoutRetiredContent(old);assert.ok(!sanitized.entries.some(e=>e.kind==='journal'));
 const result=await fetchPublicContent({fetcher:async()=>({ok:true,json:async()=>old})});
 assert.ok(result.entries.every(e=>e.kind!=='journal'));
 assert.ok(visitorEntries(result.entries).every(e=>e.kind!=='journal'&&e.status!=='demo'));
 assert.equal(parseRoute('#/trading').page,'not-found');
});
test('empty company templates stay internal; SMIC facts and financial periods retain evidence',()=>{
 assert.equal(companies.length,42);assert.equal(visibleCompanies(companies).length,9);
 assert.equal(companies.filter(c=>companyPublication(c).level==='hidden').length,33);
 assert.equal(companyPublication(companies.find(c=>c.id==='688981.SH')).level,'full');
 const p=publicProfiles['688981.SH'];
 for(const f of [...p.facts,...p.financials]){const s=p.sources[f.source];assert.ok(s?.url.startsWith('https://'));assert.ok(s.verifiedAt);assert.ok(s.asOf);}
 assert.equal(p.financials.find(f=>f.label==='季度营业收入').period,'2026 Q2');
 assert.equal(p.financials.find(f=>f.label==='经营活动现金流净额').period,'2026 H1');
 assert.ok(!Object.hasOwn(p,'marketShare'));assert.ok(!Object.hasOwn(p,'customers'));
});
test('market watchlist uses permitted cash indices rather than substituting CFDs',()=>{
 const symbols=marketWidgetConfig.tabs.flatMap(t=>t.symbols.map(s=>s.s));
 assert.equal(symbols.length,5);assert.ok(symbols.every(s=>/^(SSE|SZSE|HSI):/.test(s)));
 assert.ok(!symbols.some(s=>s.startsWith('FOREXCOM:')));
});
