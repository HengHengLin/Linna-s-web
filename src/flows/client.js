import {validateSnapshot} from './data.js';
export const flowUrl=(market,remote=false)=>remote?`https://raw.githubusercontent.com/HengHengLin/Linna-s-web/main/public/data/flows/${market}.json`:`${import.meta.env.BASE_URL}data/flows/${market}.json`;
export async function fetchSnapshot(url,fetcher=fetch){const r=await fetcher(url,{cache:'no-cache',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(`HTTP ${r.status}`);return validateSnapshot(await r.json());}
export function chooseSnapshot(old,next){if(old?.rows.length && (next.dataAsOf<old.dataAsOf || next.rows.length<old.rows.length || old.rows.some(r=>!next.rows.some(n=>n.date===r.date && (next.market!=='cn'||n.id===r.id)))))throw Error('远程历史短于本地快照，保留已有数据');return next;}
