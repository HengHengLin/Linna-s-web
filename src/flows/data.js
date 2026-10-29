import {usTradingDay,tradingDates} from './calendar.js';
// All money in CNY (CN) or USD (BTC); ratios are fractions, volume/shares in units.
export const securities = [
 ['600893','航发动力','stock'],['600900','长江电力','stock'],['510050','华夏上证50ETF','etf'],['588000','华夏科创50ETF','etf'],['601698','中国卫通','stock'],['601689','拓普集团','stock'],
].map(([code,name,type])=>({id:`${code}.SH`,code,name,type,exchange:'SH',confirmationRequired:false,sources:[
 {name:'上海证券交易所',url:'https://www.sse.com.cn/'},
 {name:'同花顺',url:`https://data.10jqka.com.cn/market/rzrqgg/code/${code}/`},
 {name:'东方财富',url:`https://data.eastmoney.com/rzrq/stock/${code}.html`},
 ...(type==='etf'?[{name:'华夏基金',url:`https://www.chinaamc.com.cn/fund/${code}/index.shtml`}]:[])
]}));
export const funds = {IBIT:'iShares Bitcoin Trust',FBTC:'Fidelity Wise Origin Bitcoin Fund',GBTC:'Grayscale Bitcoin Trust',ARKB:'ARK 21Shares Bitcoin ETF',BITB:'Bitwise Bitcoin ETF',HODL:'VanEck Bitcoin Trust',BTCO:'Invesco Galaxy Bitcoin ETF',EZBC:'Franklin Bitcoin ETF',BRRR:'CoinShares Valkyrie Bitcoin Fund',BTCW:'WisdomTree Bitcoin Fund'};
export const btcSource='https://www.tftc.io/bitcoin-etf-flows/data.json';
export const validDate = x => typeof x==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString().slice(0,10)===x;
export const numeric = x => typeof x==='number' && Number.isFinite(x);
const nullable = x => x===null || numeric(x);
export function validateSnapshot(d) {
 if(!d || d.schemaVersion!==1 || !['cn','btc'].includes(d.market) || !Array.isArray(d.rows) || !['ok','unavailable','error'].includes(d.status)) throw Error('数据版本或状态无效');
 if(d.market==='btc' && d.currency!=='USD' || d.market==='cn' && d.currency!=='CNY') throw Error('币种不匹配');
 if(d.market==='btc'&&d.rows.length&&d.dataAsOf!==d.rows.at(-1).date)throw Error('基准日期与最新记录不一致');
 if(d.lastSuccessAt!==null && !Number.isFinite(Date.parse(d.lastSuccessAt))) throw Error('更新时间无效');
 let prev='';const seen=new Set();
 for(const r of d.rows){
  if(!validDate(r.date) || r.date>new Date().toISOString().slice(0,10)) throw Error('交易日期无效');
  const key=d.market==='cn'?`${r.id}:${r.date}`:r.date;
  if(seen.has(key)) throw Error('重复交易记录');seen.add(key);
  if(d.market==='btc'){
   if(r.date<=prev || !nullable(r.netFlowUsd) || !nullable(r.btcCloseUsd) || r.btcCloseUsd!==null&&r.btcCloseUsd<=0 || !nullable(r.totalNetAssetsUsd)) throw Error('BTC 数据类型或顺序错误');prev=r.date;
   if(r.perEtfUsd!==null && (typeof r.perEtfUsd!=='object'||Array.isArray(r.perEtfUsd)||Object.entries(r.perEtfUsd).some(([k,v])=>!/^\w{1,10}$/.test(k)||!nullable(v)))) throw Error('基金字段无效');
  }else{
   if(!securities.some(s=>s.id===r.id))throw Error('未知证券');
   if(r.frequency!=='daily'||!r.sourceDates)throw Error('缺少日频与字段基准日期');
   for(const f of ['close','volume','marginBalance','marginBuy','marginRepay','floatMarketCap','lendingBalance','etfShares','nav','aum','premium']) {if(!nullable(r[f]))throw Error(`无效字段 ${f}`);if(r[f]!==null&&r.sourceDates[f]!==r.date)throw Error('字段日期不一致');}
   if(r.netSubscriptionShares!==undefined&&(!nullable(r.netSubscriptionShares)||r.netSubscriptionShares!==null&&r.sourceDates.netSubscriptionShares!==r.date))throw Error('ETF 申赎字段无效');
   for(const f of ['close','volume','marginBalance','marginBuy','marginRepay','floatMarketCap','lendingBalance','etfShares','nav','aum']) if(r[f]!==null && r[f]<0)throw Error('负值余额或价格');
  }
 }
 return d;
}
export const sumComplete=(rows,key,n=rows.length)=>rows.length>=n && n>0 && rows.slice(-n).every(r=>numeric(r[key]))?rows.slice(-n).reduce((a,r)=>a+r[key],0):null;
export function tradingSum(rows,n){
 const selected=rows.slice(-n);if(selected.length<n)return null;
 for(let t=Date.parse(selected[0].date);t<=Date.parse(selected.at(-1).date);t+=864e5){const date=new Date(t).toISOString().slice(0,10),open=usTradingDay(date);if(open===null || open&&!selected.some(r=>r.date===date))return null;}
 return sumComplete(selected,'netFlowUsd',n);
}
export function cnDerived(r,prev){
 const net=numeric(r?.marginBuy)&&numeric(r?.marginRepay)?r.marginBuy-r.marginRepay:null;
 const shares=validDate(prev?.date)&&validDate(r?.date)&&r.date>prev.date&&r?.shareAdjustmentVerified===true&&r?.comparablePreviousDate===prev?.date&&numeric(r?.etfShares)&&numeric(prev?.etfShares)?r.etfShares-prev.etfShares:null;
 const creation=numeric(r?.netSubscriptionShares)?r.netSubscriptionShares:shares;
 return {...r,net,estimateBasis:numeric(r?.netSubscriptionShares)?'来源披露净申赎份额':shares!==null?'调整后份额变化估算':null,ratio:numeric(r?.marginBalance)&&r.floatMarketCap>0?r.marginBalance/r.floatMarketCap:null,shareChange:shares,estimatedFlow:creation!==null&&r.nav>0?creation*r.nav:null};
}
export function changes(rows,n){
 if(rows.length<n+1)return {price:null,balance:null,label:'暂无数据'};
 const a=rows.at(-n-1),b=rows.at(-1);
 const pct=(x,y)=>numeric(x)&&numeric(y)&&y>0?x/y-1:null;
 const price=pct(b.close,a.close),balance=pct(b.marginBalance,a.marginBalance);
 const label=price===null||balance===null?'暂无数据':`融资余额${balance>0?'增加':balance<0?'减少':'持平'} · 股价${price>0?'上涨':price<0?'下跌':'持平'}`;
 return {price,balance,label};
}
export function calendarSlice(rows,days){if(days==='all'||!rows.length)return rows;const end=Date.parse(rows.at(-1).date),start=end-(Number(days)-1)*864e5;return rows.filter(r=>Date.parse(r.date)>=start);}
export function cumulative(rows){let total=0,complete=true;return rows.map(r=>{if(!numeric(r.netFlowUsd))complete=false;else total+=r.netFlowUsd;return {...r,cumulative:complete?total:null};});}
// Source explicitly identifies zero-total/no-fund-split rows as holiday placeholders.
export function normalizeTftc(raw,now=new Date().toISOString()){
 if(raw.units!=='USD'||raw.dataUrl!==btcSource||raw.license!=='https://creativecommons.org/licenses/by/4.0/'||!validDate(raw.updatedThrough)||!Array.isArray(raw.days)||!raw.days.length)throw Error('来源格式/授权发生变化');
 let excludedHolidayRows=0;const rows=[];
 for(const original of raw.days){
  const placeholder=original.netFlowUsd===0&&original.perEtfUsd===null;
  if(validDate(original.date)&&usTradingDay(original.date)===false&&placeholder){excludedHolidayRows++;continue;}
  if(validDate(original.date)&&usTradingDay(original.date)===false)throw Error('休市日存在非占位数据，需核验');
  rows.push({date:original.date,netFlowUsd:placeholder?null:original.netFlowUsd,btcCloseUsd:original.btcCloseUsd,totalNetAssetsUsd:original.totalNetAssetsUsd,perEtfUsd:original.perEtfUsd});
 }

 const d={schemaVersion:1,market:'btc',currency:'USD',status:'ok',error:null,lastAttemptAt:now,lastSuccessAt:now,dataAsOf:raw.updatedThrough,providerModifiedAt:raw.dateModified,source:{url:raw.url,dataUrl:raw.dataUrl,methodology:raw.methodologyUrl,license:raw.license,attribution:raw.attribution,lineage:raw.sources},quality:{excludedHolidayRows,notes:'第三方汇总；逐基金历史可能有缺口，供应商不追溯修订已存逐基金拆分。总额包含首批十只之外的基金。'},rows};
 if(rows.at(-1)?.date!==raw.updatedThrough)throw Error('最新日期与记录不一致');validateSnapshot(d);
 const existing=new Map(rows.map(r=>[r.date,r])),expected=tradingDates(rows[0].date,raw.updatedThrough);
 d.rows=expected.map(date=>existing.get(date)||{date,netFlowUsd:null,btcCloseUsd:null,totalNetAssetsUsd:null,perEtfUsd:null});
 d.quality.incompleteDates=d.rows.filter(r=>!numeric(r.netFlowUsd)).map(r=>r.date);
 d.quality.expectedSessions=expected.length;
 return validateSnapshot(d);
}
export function retainOnFailure(previous,error,now=new Date().toISOString()){return {...previous,status:'error',error:String(error.message||error).slice(0,240),lastAttemptAt:now};}
export const fmt=(v,unit='')=>numeric(v)?`${new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(v)}${unit}`:'暂无数据';
export const pct=v=>numeric(v)?`${(v*100).toFixed(2)}%`:'暂无数据';
