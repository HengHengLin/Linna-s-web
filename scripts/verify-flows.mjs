import {readFileSync} from 'node:fs';
import {validateSnapshot} from '../src/flows/data.js';
import {historyQuality,compareObservations} from '../src/flows/analytics.js';
for(const market of ['cn','btc']){
 const data=validateSnapshot(JSON.parse(readFileSync(new URL(`../public/data/flows/${market}.json`,import.meta.url))));
 console.log(`${market}: ${data.rows.length} rows, as-of ${data.dataAsOf||'unavailable'}, ${data.status}`);
 if(market==='btc'){
  const quality=historyQuality(data.rows);if(quality.nonTradingDates.length||quality.unknownDates.length)throw Error('交易日历校验失败');
  const comparison=compareObservations(data.rows,JSON.parse(readFileSync(new URL('../src/flows/cross-check.json',import.meta.url))));
  console.log(JSON.stringify({complete:quality.complete,missingDates:quality.missingDates.length,nullTotals:quality.nullTotals.length,crossCheck:comparison.reduce((a,r)=>({...a,[r.status]:(a[r.status]||0)+1}),{})}));
 }
}
