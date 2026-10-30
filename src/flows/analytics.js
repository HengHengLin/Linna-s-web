import {numeric,validDate,sumComplete} from './data.js';
import {tradingDates,usTradingDay} from './calendar.js';
export function historyQuality(rows,start=rows[0]?.date,end=rows.at(-1)?.date){
 if(!rows.length)return {complete:false,missingDates:[],unknownDates:[],nonTradingDates:[],nullTotals:[]};
 const known=new Set(rows.map(r=>r.date));let expected=[],calendarError=null;try{expected=tradingDates(start,end);}catch(e){calendarError=e.message;}
 const missingDates=expected.filter(d=>!known.has(d)),unknownDates=rows.filter(r=>usTradingDay(r.date)===null).map(r=>r.date),nonTradingDates=rows.filter(r=>usTradingDay(r.date)===false).map(r=>r.date),nullTotals=rows.filter(r=>!numeric(r.netFlowUsd)).map(r=>r.date);
 return {complete:!calendarError&&!missingDates.length&&!unknownDates.length&&!nonTradingDates.length&&!nullTotals.length,missingDates,unknownDates,nonTradingDates,nullTotals,calendarError};
}
export function completeCumulative(rows){let total=0,complete=true;return rows.map((r,i)=>{if(!numeric(r.netFlowUsd)||usTradingDay(r.date)!==true || i&&tradingDates(rows[i-1].date,r.date).length!==2)complete=false;else total+=r.netFlowUsd;return {...r,cumulative:complete?total:null};});}
export function windowFlow(rows,n,ticker=null){const slice=rows.slice(-n);if(slice.length!==n||!historyQuality(slice).complete)return null;const selected=ticker?slice.map(r=>({...r,value:r.perEtfUsd?.[ticker]})):slice.map(r=>({...r,value:r.netFlowUsd}));return sumComplete(selected,'value',n);}
export function fundComparison(rows,n,tickers){return tickers.map(ticker=>({ticker,value:windowFlow(rows,n,ticker),observed:rows.slice(-n).filter(r=>numeric(r.perEtfUsd?.[ticker])).length,required:n})).sort((a,b)=>a.value===null?b.value===null?a.ticker.localeCompare(b.ticker):1:b.value===null?-1:b.value-a.value);}
export function flowPriceObservation(rows,n){
 if(rows.length<n+1)return {flow:null,priceChange:null,label:'暂无数据'};
 const window=rows.slice(-n-1),flow=windowFlow(rows,n),a=window[0].btcCloseUsd,b=window.at(-1).btcCloseUsd;
 if(flow===null||!historyQuality(window).complete||!numeric(a)||a<=0||!numeric(b)||b<=0)return {flow,priceChange:null,label:'暂无数据'};
 const priceChange=b/a-1;return {flow,priceChange,label:`ETF ${flow>0?'净流入':flow<0?'净流出':'净流量持平'} · BTC 参考价格${priceChange>0?'上涨':priceChange<0?'下跌':'持平'}`};
}
export function compareObservations(rows,check){
 if(!check||check.schemaVersion!==1||!validDate(check.checkedDate)||!Array.isArray(check.observations))throw Error('交叉核验资料无效');
 const seen=new Set();return check.observations.flatMap(o=>{
  if(!validDate(o.date)||!['total','IBIT','FBTC','BITB'].includes(o.field)||seen.has(`${o.date}:${o.field}`)||!numeric(o.valueMillions))throw Error('核验日期、字段或数值无效');seen.add(`${o.date}:${o.field}`);
  const row=rows.find(r=>r.date===o.date),actual=o.field==='total'?row?.netFlowUsd:row?.perEtfUsd?.[o.field],difference=numeric(actual)?actual-o.valueMillions*1e6:null;
  return {date:o.date,field:o.field,comparisonUsd:o.valueMillions*1e6,actualUsd:actual??null,differenceUsd:difference,status:difference===null?'missing':Math.abs(difference)<=50000.01?'rounding':'different',reason:difference===null?'主来源尚未报告该日或该字段':Math.abs(difference)<=50000.01?'与对照来源一位小数展示精度相容':'超出显示舍入范围；可能涉及修订、发布时间或统计口径，原因尚未确认'};
 });
}
export function revisionSummary(oldRows,newRows){const previous=new Map((oldRows||[]).map(r=>[r.date,r]));const changes=[];let added=0;
 for(const row of newRows){const old=previous.get(row.date);if(!old){added++;continue;}for(const field of ['netFlowUsd','btcCloseUsd','totalNetAssetsUsd','perEtfUsd'])if(JSON.stringify(old[field])!==JSON.stringify(row[field]))changes.push({date:row.date,field});}
 return {added,revisedFields:changes.length,changes:changes.slice(-100),truncated:changes.length>100};
}
