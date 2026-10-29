import {useEffect,useRef,useState,useCallback} from 'react';
import {fetchPublicContent} from './content-client.js';
export function usePublicContent(initialEntries){
 const [entries,setEntries]=useState(initialEntries),[sync,setSync]=useState({state:'loading',updatedAt:null,lastSuccess:null,lastAttempt:null,error:null,count:initialEntries.length});
 const running=useRef(false),mounted=useRef(false),version=useRef(null);
 const refresh=useCallback(async()=>{if(running.current||!mounted.current)return;running.current=true;setSync(s=>({...s,state:'loading',lastAttempt:new Date().toISOString()}));
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 try{const next=await fetchPublicContent({signal:controller.signal,previousUpdatedAt:version.current});if(mounted.current){version.current=next.updatedAt;setEntries(next.entries);setSync(s=>({...s,state:'ready',updatedAt:next.updatedAt,lastSuccess:new Date().toISOString(),error:null,count:next.entries.length}));}}
 catch(e){console.warn('[content-sync]',e.message);if(mounted.current)setSync(s=>({...s,state:'stale',error:e.message}));}finally{clearTimeout(timer);running.current=false;}
 },[]);
 useEffect(()=>{mounted.current=true;refresh();const visible=()=>{if(document.visibilityState==='visible')refresh();};window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',visible);const timer=setInterval(refresh,600000);return()=>{mounted.current=false;clearInterval(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visible);};},[refresh]);
 return {entries,sync,refresh};
}
