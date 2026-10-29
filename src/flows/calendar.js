// NYSE published 2024–2027 closures. Unknown years fail closed; no guessed calendar.
export const calendarSource='https://www.nyse.com/markets/hours-calendars';
const closures={2024:['01-01','01-15','02-19','03-29','05-27','06-19','07-04','09-02','11-28','12-25'],2025:['01-01','01-09','01-20','02-17','04-18','05-26','06-19','07-04','09-01','11-27','12-25'],2026:['01-01','01-19','02-16','04-03','05-25','06-19','07-03','09-07','11-26','12-25'],2027:['01-01','01-18','02-15','03-26','05-31','06-18','07-05','09-06','11-25','12-24']};
export function usTradingDay(date){const y=Number(date.slice(0,4));if(!closures[y])return null;const w=new Date(date+'T12:00:00Z').getUTCDay();return w!==0&&w!==6&&!closures[y].includes(date.slice(5));}
export function latestClosedSession(now=new Date()){
 // IANA zone handles DST. Run after source's 02/10 UTC publication, not market-close guesswork.
 const local=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const val=k=>local.find(p=>p.type===k).value;let d=new Date(`${val('year')}-${val('month')}-${val('day')}T12:00:00Z`);
 if(Number(val('hour'))<17)d.setUTCDate(d.getUTCDate()-1);
 for(let i=0;i<12;i++){const key=d.toISOString().slice(0,10),valid=usTradingDay(key);if(valid===null)throw Error('美国交易日历尚未更新');if(valid)return key;d.setUTCDate(d.getUTCDate()-1);}throw Error('无法确定已收盘交易日');
}
export function freshness(d,now=new Date()){if(d.market==='cn')return '暂无数据：历史接口与再发布许可尚未确认';if(d.status==='error')return `更新失败，保留上次有效数据：${d.error}`;try{return d.dataAsOf<latestClosedSession(now)?'数据尚未覆盖最近已收盘交易日，等待来源发布或更新':'最近已发布数据（非实时）';}catch{return '交易日历待更新，时效性待核实';}}

export function tradingDates(start,end){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||!Number.isFinite(Date.parse(start))||!Number.isFinite(Date.parse(end))||new Date(start).toISOString().slice(0,10)!==start||new Date(end).toISOString().slice(0,10)!==end||start>end||Date.parse(end)-Date.parse(start)>3660*864e5)throw Error('交易日区间无效');
 const dates=[];for(let t=Date.parse(start);t<=Date.parse(end);t+=864e5){const d=new Date(t).toISOString().slice(0,10),open=usTradingDay(d);if(open===null)throw Error('交易日历未覆盖该年份');if(open)dates.push(d);}return dates;
}
