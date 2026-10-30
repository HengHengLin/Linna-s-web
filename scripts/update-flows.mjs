import {readFile,writeFile,rename} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {btcSource,normalizeTftc,retainOnFailure,validateSnapshot} from '../src/flows/data.js';
import {revisionSummary} from '../src/flows/analytics.js';
import {latestClosedSession,usTradingDay} from '../src/flows/calendar.js';
export async function update(previous,fetcher=fetch,now=new Date()){
 try{
  const closed=latestClosedSession(now); // fail closed beyond maintained calendar
  const response=await fetcher(btcSource,{signal:AbortSignal.timeout(20000),headers:{Accept:'application/json'}});
  if(!response.ok)throw Error(`TFTC HTTP ${response.status}`);
  const raw=await response.text();if(raw.length>3000000)throw Error('来源体积异常');
  const next=normalizeTftc(JSON.parse(raw),now.toISOString());
  if(next.dataAsOf>closed)throw Error('来源日期晚于最近已收盘交易日');
  if(previous?.rows?.length && (next.rows.length<previous.rows.length || next.dataAsOf<previous.dataAsOf || previous.rows.some(r=>!next.rows.some(n=>n.date===r.date))))throw Error('来源历史缩短，拒绝覆盖');
  if(next.rows.some(r=>usTradingDay(r.date)===false))throw Error('来源包含非交易日有效记录，需人工核验');
  const revision=revisionSummary(previous?.rows,next.rows);
  next.revisions=[...(previous?.revisions||[]),...(revision.added||revision.revisedFields?[{checkedAt:now.toISOString(),...revision}]:[])].slice(-20);
  return next;
 }catch(error){if(!previous)throw error;return retainOnFailure(previous,error,now.toISOString());}
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const path=new URL('../public/data/flows/btc.json',import.meta.url);
 let previous;try{previous=validateSnapshot(JSON.parse(await readFile(path,'utf8')));}catch{}
 const next=await update(previous);await writeFile(new URL('./btc.json.tmp',path),JSON.stringify(next,null,2)+'\n');await rename(new URL('./btc.json.tmp',path),path);
 console.log(JSON.stringify({status:next.status,date:next.dataAsOf,rows:next.rows.length,error:next.error}));
 if(next.status==='error')process.exitCode=1;
}
