import {withoutRetiredContent} from '../public-visibility.js';
import {CONTENT_URL,validateSnapshot} from '../public-content.js';
export async function fetchPublicContent({fetcher=fetch,signal,previousUpdatedAt=null,url=CONTENT_URL}={}){
 let response;try{response=await fetcher(url,{cache:'no-store',signal});}catch(e){throw Error(e?.name==='TimeoutError'||e?.name==='AbortError'?'同步超时，请重试':'网络请求失败：请检查网络、GitHub Raw可达性或浏览器CORS/扩展拦截');}
 if(!response.ok)throw Error(`内容请求失败：HTTP ${response.status}`);
 let snapshot;try{snapshot=await response.json();}catch{throw Error('远程内容不是有效JSON');}
 let entries;try{entries=validateSnapshot(withoutRetiredContent(snapshot));}catch(e){throw Error(`内容校验失败：${e.message}`);}
 if(previousUpdatedAt&&Date.parse(snapshot.updatedAt)<Date.parse(previousUpdatedAt))throw Error('收到较旧的内容版本，保留上次同步结果');
 return {entries,updatedAt:snapshot.updatedAt,url};
}
export function assertExpectedIds(entries,expectedIds){const ids=new Set(entries.map(x=>x.id));const missing=expectedIds.filter(id=>!ids.has(id));if(missing.length)throw Error(`网站数据缺少文章：${missing.join('、')}`);return true;}
