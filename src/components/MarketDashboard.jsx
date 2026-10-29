import React,{useEffect,useRef,useState} from 'react';
import {marketWidgetConfig,marketLicense} from '../market-dashboard';
export default function MarketDashboard(){
 const host=useRef(null);const [failed,setFailed]=useState(false),[offline,setOffline]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  const node=host.current;if(!node)return;
  const on=()=>setOffline(false),off=()=>setOffline(true);setOffline(!navigator.onLine);
  window.addEventListener('online',on);window.addEventListener('offline',off);
  node.replaceChildren();const container=document.createElement('div');container.className='tradingview-widget-container__widget';node.appendChild(container);
  const script=document.createElement('script');script.src='https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';script.type='text/javascript';script.async=true;script.textContent=JSON.stringify(marketWidgetConfig);script.onerror=()=>setFailed(true);setFailed(false);node.appendChild(script);
  // Do not recreate the widget on connection loss: an existing last quote remains visible.
  return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off);script.onerror=null;node.replaceChildren();};
 },[attempt]);
 return <section className="market-dashboard" aria-labelledby="market-dashboard-title"><div className="section-row"><div><span className="eyebrow blue">市场速览</span><h2 id="market-dashboard-title">指数行情看板</h2></div><span className="market-data-mode">收盘数据 · 非实时</span></div><p>在同一看板查看指数点位、涨跌与走势。A 股及香港免费数据为收盘口径；具体行情日期与时间以图表悬浮信息为准，不以打开网页的时间冒充报价时间。</p><div className="market-widget" ref={host} style={{minHeight:520}} aria-label="TradingView A股与香港收盘指数行情"/><p className="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/indices/" target="_blank" rel="noopener noreferrer">指数行情</a> by <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">TradingView</a></p>{(failed||offline)&&<p role="status" className="notice">{offline?'网络已断开，已显示的图表不主动清空；其中报价仅代表图内标注的历史时点。':'行情服务暂不可用，暂时无法确认最新点位。'}<button type="button" className="text-link" onClick={()=>setAttempt(x=>x+1)}>重新连接行情</button></p>}<details className="market-source-details"><summary>数据来源与时效</summary><p>{marketLicense.provider} 官方嵌入看板 · {marketLicense.mode}。图表由来源方刷新，本站不抓取或重新分发行情，也不保存到浏览器或仓库；没有成功加载时不显示模拟价格。</p><p>行情价格和涨跌由提供方计算。交易日、延迟与停市状态以图内标注为准；收盘数据不能用于即时交易。美国主要指数暂保留原观察入口，未用差价合约替代指数。</p><p><a href={marketLicense.availability} target="_blank" rel="noopener noreferrer">公开嵌入可用市场</a> · <a href={marketLicense.faq} target="_blank" rel="noopener noreferrer">数据许可与限制</a> · 资料核对 {marketLicense.reviewedAt}</p></details></section>;
}
