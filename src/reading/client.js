import {validateReading} from './schema.js';
export const READING_URL='https://raw.githubusercontent.com/HengHengLin/Linna-s-web/main/public/reading.json';
export async function fetchReading(previous,fetcher=fetch){const response=await fetcher(READING_URL,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error(`Reading HTTP ${response.status}`);const snapshot=validateReading(await response.json());if(previous&&Date.parse(snapshot.updatedAt)<Date.parse(previous.updatedAt))throw Error('拒绝过期读书快照');return snapshot;}
