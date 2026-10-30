import React,{useEffect,useState,useRef} from 'react';
import {securities,funds,cnDerived,changes,sumComplete,calendarSlice,numeric,fmt,pct} from '../flows/data';
import crossCheck from '../flows/cross-check.json';
import {historyQuality,completeCumulative,windowFlow,fundComparison,flowPriceObservation,compareObservations} from '../flows/analytics';
import {freshness} from '../flows/calendar';
import {fetchSnapshot,chooseSnapshot,flowUrl} from '../flows/client';
import FlowChart from './FlowChart';
import {routeUrl} from '../routes';
import './FlowMonitor.css';
const link=(url,text)=><a href={url} target="_blank" rel="noopener noreferrer">{text} ↗</a>;
const series=(key,label,unit,divisor=1,color='#0d9488')=>({key,label,unit,divisor,color});
const metric=(label,value)=><div key={label} className="flow-metric"><span>{label}</span><strong>{value}</strong></div>;
function useFlow(market){
 const [data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const current=useRef(null),generation=useRef(0),running=useRef(false);
 const load=async(remote,token)=>{
  if(running.current)return;running.current=true;setBusy(true);
  try{const next=await fetchSnapshot(flowUrl(market,remote));if(generation.current!==token)return;if(next.market!==market)throw Error('市场标识不匹配');const chosen=chooseSnapshot(current.current,next);current.current=chosen;setData(chosen);setError('');}
  catch(e){if(generation.current===token)setError(`读取失败，保留上次有效数据：${e.message}`);}
  finally{if(generation.current===token){running.current=false;setBusy(false);}}
 };
 const remote=typeof location!=='undefined'&&!import.meta.env.DEV&&!location.hostname.match(/^(127\.0\.0\.1|localhost)$/);
 const refresh=()=>load(remote,generation.current);
 useEffect(()=>{const token=++generation.current;current.current=null;running.current=false;setData(null);setError('');load(false,token).then(()=>{if(remote&&generation.current===token)load(true,token);});const timer=setInterval(refresh,600000);window.addEventListener('focus',refresh);return()=>{generation.current++;clearInterval(timer);window.removeEventListener('focus',refresh);};},[market]);
 return {data,error,busy,refresh};
}
function Status({state}){const {data,error,busy,refresh}=state;return <div className="flow-status"><p>{data?freshness(data):'正在读取数据…'}{error&&` · ${error}`}</p><p>交易日期：{data?.dataAsOf||'暂无数据'} · 最后成功更新：{data?.lastSuccessAt?new Date(data.lastSuccessAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'})+' 北京时间':'暂无数据'}</p><button disabled={busy} onClick={refresh}>{busy?'读取中…':'刷新数据'}</button></div>;}
function DataTable({rows,columns}){return <details className="flow-table"><summary>查看每日数据表（{rows.length} 条记录）</summary><div className="flow-scroll" tabIndex={0} role="region" aria-label="每日数据，可横向滚动"><table><thead><tr><th>交易日期</th>{columns.map(c=><th key={c.key}>{c.label}（{c.unit}）</th>)}</tr></thead><tbody>{[...rows].reverse().map(r=><tr key={r.date}><th scope="row">{r.date}</th>{columns.map(c=><td key={c.key}>{fmt(numeric(r[c.key])?r[c.key]/c.divisor:null)}</td>)}</tr>)}</tbody></table>{!rows.length&&<p>暂无数据</p>}</div></details>;}
function CN({selected}){
 const state=useFlow('cn'),[query,setQuery]=useState(''),[days,setDays]=useState(20);
 const security=securities.find(s=>s.id===selected)||securities[0];
 if(selected&&!securities.some(s=>s.id===selected))return <p>未找到该标的。<a href={routeUrl('market-flow')}>返回资金监测</a></p>;
 const all=(state.data?.rows||[]).filter(r=>r.id===security.id).sort((a,b)=>a.date.localeCompare(b.date));
 const rows=all.map((r,i)=>cnDerived(r,all[i-1])).slice(-days),last=rows.at(-1)||{};
 return <><div className="flow-controls"><label>搜索标的<input placeholder="名称或完整股票代码" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>历史区间<select value={days} onChange={e=>setDays(Number(e.target.value))}>{[5,20,60].map(n=><option key={n} value={n}>最近 {n} 个交易日</option>)}</select></label></div><div className="flow-security-list">{securities.filter(s=>`${s.name}${s.id}`.toLowerCase().includes(query.toLowerCase())).map(s=><a key={s.id} href={routeUrl('market-flow',s.id)} aria-current={s.id===security.id?'page':undefined}>{s.name}<small>{s.id}</small></a>)}</div>
 <h2>{security.name} <small>{security.id}</small></h2>{security.confirmationRequired&&<p className="flow-warning">本期“科创50ETF”暂采用华夏 588000，正式发布前需 Linna 确认具体产品。</p>}<Status state={state}/><div className="flow-metrics">{metric('融资余额',fmt(last.marginBalance,' 元'))}{metric('融资买入额',fmt(last.marginBuy,' 元'))}{metric('融资偿还额',fmt(last.marginRepay,' 元'))}{metric('融资净买入',fmt(last.net,' 元'))}{metric('融资余额 / 流通市值',pct(last.ratio))}{metric('融券余额（金额）',fmt(last.lendingBalance,' 元'))}</div><p className="flow-note">融资净买入 = 融资买入额 − 融资偿还额。它只描述融资交易，不等于股票市场整体资金净流入。金额为人民币元，融券股数不能冒充融券金额。</p>
 <div className="flow-chart-grid"><FlowChart title="股价与融资余额" rows={rows} series={[series('close','收盘价','元'),series('marginBalance','融资余额','亿元',1e8,'#6366f1')]}/><FlowChart title="每日融资净买入" rows={rows} series={[series('net','融资净买入','万元',1e4)]} bar/><FlowChart title="成交量与股价" rows={rows} series={[series('volume','成交量',security.type==='etf'?'万份':'万股',1e4),series('close','收盘价','元',1,'#6366f1')]} bar/><FlowChart title="融资余额占流通市值" rows={rows} series={[series('ratio','占比','%',.01)]}/></div>
 <section className="flow-observations"><h3>资金行为观察</h3>{[5,20].map(n=>{const c=changes(all,n);return <p key={n}>{n} 个交易日：{c.label} · 融资余额 {pct(c.balance)} · 股价 {pct(c.price)}</p>;})}<p>仅比较同一标的、相同交易日期的区间端点，不构成买卖信号。</p></section>
 {security.type==='etf'&&<><h3>ETF 一级市场与规模</h3><div className="flow-metrics">{metric('基金份额',fmt(last.etfShares,' 份'))}{metric('份额净变化（代理指标）',fmt(last.shareChange,' 份'))}{metric('来源披露净申购 / 赎回',fmt(last.netSubscriptionShares,' 份'))}{metric('估算资金净流量',fmt(last.estimatedFlow,' 元'))}{metric('基金规模',fmt(last.aum,' 元'))}{metric('溢价 / 折价',pct(last.premium))}</div><p className="flow-note">来源披露净申赎与份额变化分别展示。估算流量优先采用披露净申赎份额 × 当日单位净值；只有已确认相邻交易日及拆分等调整时，才用份额变化替代。估算金额不同于实际现金交收、二级市场成交额或融资净买入。当前暂无已接入的真实数据。</p></>}
 <DataTable rows={rows} columns={[series('close','收盘价','元'),series('marginBalance','融资余额','元'),series('marginBuy','融资买入','元'),series('marginRepay','融资偿还','元'),series('net','融资净买入','元'),series('volume','成交量',security.type==='etf'?'份':'股')]}/><div className="flow-source"><h3>核对原始资料</h3><p>{state.data?.reason}</p><div>{security.sources.map(s=><React.Fragment key={s.url}>{link(s.url,s.name)} </React.Fragment>)}</div><p>外部页面不代表已取得自动获取或再发布许可；暂不执行抓取。数据将按上海交易日、日频、同一口径接入。</p></div></>;
}
function BTC(){
 const state=useFlow('btc'),[days,setDays]=useState('20t'),[query,setQuery]=useState(''),[comparisonDays,setComparisonDays]=useState(1),[selectedFund,setSelectedFund]=useState('IBIT');
 const all=state.data?.rows||[],quality=historyQuality(all),timeline=completeCumulative(all);
 const rows=days==='20t'?timeline.slice(-20):calendarSlice(timeline,days),last=all.at(-1)||{};
 const comparisons=fundComparison(all,comparisonDays,Object.keys(funds));
 const maxFundFlow=Math.max(1,...comparisons.map(x=>Math.abs(x.value||0)));
 const cross=compareObservations(all,crossCheck);
 const selectedRows=rows.map(r=>({...r,fundFlow:r.perEtfUsd?.[selectedFund]??null}));
 return <>
  <div className="flow-controls"><label>历史区间<select value={days} onChange={e=>setDays(e.target.value)}>{['20t','7','30','90','all'].map(n=><option key={n} value={n}>{n==='20t'?'最近 20 个交易日':n==='all'?'全部历史':`最近 ${n} 个自然日`}</option>)}</select></label><label>搜索基金<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="IBIT、FBTC…"/></label></div>
  <Status state={state}/>
  <div className="flow-metrics">{[1,5,20].map(n=>metric(n===1?'最新交易日净流量':`近 ${n} 个交易日累计`,fmt(numeric(windowFlow(all,n))?windowFlow(all,n)/1e6:null,' 百万美元')))}{metric('起始日以来累计净流量',fmt(quality.complete?sumComplete(all,'netFlowUsd')/1e9:null,' 十亿美元'))}</div>
  <p className="flow-note">全市场总额采用供应商汇总，包含首批十只之外的基金，不能用十只基金合计替代。正数为净申购，负数为净赎回；缺失值不作零。日期为美国交易日（America/New_York），非北京时间。累计起点：{all[0]?.date||'暂无数据'}。</p>
  <div className="flow-chart-grid"><FlowChart title="每日 ETF 净流入 / 流出" rows={rows} series={[series('netFlowUsd','净流量','百万美元',1e6)]} bar/><FlowChart title="自起始日累计净流量" rows={rows} series={[series('cumulative','累计流量','十亿美元',1e9)]}/><FlowChart title="BTC 参考价格与 ETF 流量" rows={rows} series={[series('netFlowUsd','净流量','百万美元',1e6),series('btcCloseUsd','BTC 参考价格','美元',1,'#6366f1')]} bar/></div>
  <section className="flow-observations"><h3>资金流向与参考价格</h3>{[5,20].map(n=>{const c=flowPriceObservation(all,n);return <p key={n}>{n} 个交易日：{c.label} · 净流量 {fmt(numeric(c.flow)?c.flow/1e6:null,' 百万美元')} · 参考价格变化 {pct(c.priceChange)}</p>;})}<p>同向或背离只是区间描述，不证明因果关系，也不构成买卖建议。ETF 按美国交易日统计；BTC 参考价约为每日 21:00 UTC，时间切点与北京自然日不同。</p></section>
  <h3>各基金净流量对比 · {last.date||'暂无数据'}</h3>
  <div className="flow-controls"><label>基金对比区间<select value={comparisonDays} onChange={e=>setComparisonDays(Number(e.target.value))}>{[1,5,20].map(n=><option key={n} value={n}>{n===1?'最新单日':`最近 ${n} 个交易日累计`}</option>)}</select></label><label>查看单只基金<select value={selectedFund} onChange={e=>setSelectedFund(e.target.value)}>{Object.entries(funds).map(([id,name])=><option key={id} value={id}>{id} · {name}</option>)}</select></label></div>
  <p>按所选区间净流量排序，缺失值排在末尾，不参与零值比较。基金名称沿用 TFTC 当期名录；最新存续、更名与成立日仍以发行人公告为准。</p>
  <div className="flow-rank">{comparisons.filter(x=>`${x.ticker} ${funds[x.ticker]}`.toLowerCase().includes(query.toLowerCase())).map(x=><div key={x.ticker}><strong>{x.ticker}</strong><span>{funds[x.ticker]}<small>所选窗口已报告 {x.observed}/{x.required} 日</small></span><b>{fmt(numeric(x.value)?x.value/1e6:null,' 百万美元')}<span className="flow-rank-bar" style={{width:numeric(x.value)?`${Math.abs(x.value)/maxFundFlow*100}%`:'0',background:x.value<0?'#b45363':'#0d9488'}}/></b></div>)}</div>
  <FlowChart title={`${selectedFund} 每日净流量`} rows={selectedRows} series={[series('fundFlow',selectedFund,'百万美元',1e6)]} bar/>
  <DataTable rows={selectedRows} columns={[series('netFlowUsd','全市场净流量','百万美元',1e6),series('fundFlow',selectedFund,'百万美元',1e6),series('cumulative','历史累计流量','十亿美元',1e9),series('btcCloseUsd','BTC 参考价格','美元')]}/>
  <section className="flow-source"><h3>历史完整性与修订</h3><p>{all.length?`预期交易日 ${quality.complete?all.length:(state.data?.quality?.expectedSessions||'待核实')} · 已报告有效总额 ${all.filter(r=>numeric(r.netFlowUsd)).length} · 日期缺口 ${quality.missingDates.length} · 总额缺失 ${quality.nullTotals.length}`:'暂无数据'}</p><p>{quality.complete?'日历覆盖区间内未发现缺失交易日；逐基金拆分仍可能缺失。':'历史数据尚不完整；涉及缺失日期的累计结果停止计算，不补零、不跨缺口连线。'}{quality.calendarError||''}</p>{state.data?.revisions?.length>0&&<p>最近一次有效数据变更：{state.data.revisions.at(-1).checkedAt} · 新增 {state.data.revisions.at(-1).added} 日 · 修订 {state.data.revisions.at(-1).revisedFields} 个字段。</p>}</section>
  <section className="flow-source"><h3>Farside 抽样交叉核验</h3><p>核对日：{crossCheck.checkedDate} · {crossCheck.method}。{link(crossCheck.source,'原始表格')}</p><p>{crossCheck.scope} {crossCheck.automatedAccess}</p><div className="flow-scroll" tabIndex={0} role="region" aria-label="来源核验对照表，可横向滚动"><table className="flow-cross-table"><thead><tr><th>交易日 / 字段</th><th>TFTC（百万美元）</th><th>Farside（百万美元）</th><th>差额（美元）</th><th>解释</th></tr></thead><tbody>{cross.map(x=><tr key={`${x.date}:${x.field}`}><th scope="row">{x.date} · {x.field}</th><td>{fmt(numeric(x.actualUsd)?x.actualUsd/1e6:null)}</td><td>{fmt(x.comparisonUsd/1e6)}</td><td>{fmt(x.differenceUsd)}</td><td>{x.reason}</td></tr>)}</tbody></table></div><p>Farside 保留一位小数，单字段允许 ±0.05 百万美元的显示舍入差；超出范围只标记待解释，不自动更改主数据。</p></section>
  <div className="flow-source"><h3>来源与统计限制</h3><p>{link('https://www.tftc.io/bitcoin-etf-flows','The Commoner Bitcoin ETF Tracker by TFTC')} · {link('https://creativecommons.org/licenses/by/4.0/','CC BY 4.0')} · {link('https://www.tftc.io/bitcoin-etf-flows/methodology','方法与修订规则')}</p><p>数据截至 {state.data?.dataAsOf||'暂无数据'}；供应商修订时间 {state.data?.providerModifiedAt||'暂无数据'}。TFTC 汇总 SoSoValue 与 Farside / 发行人历史披露，BTC 参考价来自 mempool.space，约为每日 21:00 UTC 时点。已排除交易所确认休市的占位行 {state.data?.quality?.excludedHolidayRows??'—'} 条。</p><p>{state.data?.quality?.notes}</p><p>ETF 净流量不等于 BTC 现货即时买入金额，不能单独预测 BTC 价格。{link('https://www.sosovalue.com/assets/etf/us-btc-spot','SoSoValue 核对入口')}</p></div>
 </>;
}
export default function FlowMonitor({selectedId}){const btc=selectedId==='btc';return <section className="container section flow-monitor"><div className="page-heading"><span className="eyebrow blue">Market Flow Monitor</span><h1 tabIndex={-1}>市场资金监测</h1><p>区分融资交易、ETF 申赎与二级市场成交，用可追溯的数据观察资金行为。</p></div><nav className="flow-tabs" aria-label="资金监测市场"><a href={routeUrl('market-flow')} aria-current={!btc?'page':undefined}>A 股与 ETF</a><a href={routeUrl('market-flow','btc')} aria-current={btc?'page':undefined}>美国现货 BTC ETF</a></nav>{btc?<BTC/>:<CN selected={selectedId}/>}</section>;}
