import React from 'react';
export function Bars({title,rows,unit='%',signed=false}){
 const max=Math.max(...rows.map(x=>Math.abs(x.value)),.01);const height=rows.length*64+40;
 return <figure className="analysis-chart"><h3>{title}</h3><svg viewBox={`0 0 760 ${height}`} role="img" aria-label={`${title}：${rows.map(x=>`${x.name} ${x.value.toFixed(2)}${unit}`).join('；')}`}><title>{`${title} · 教学模拟数据`}</title>{rows.map((x,i)=><g key={x.name} transform={`translate(0 ${i*64+6})`}><text x="0" y="18" fontSize="15" fill="#203149">{x.name}</text><rect x={signed&&x.value<0?420-Math.abs(x.value)/max*180: signed?420:240} y="28" width={Math.abs(x.value)/max*(signed?180:360)} height="24" fill={x.value<0?'#b55b66':'#217d80'}/><text x="620" y="46" fontSize="15" fill="#203149">{x.value.toFixed(2)}{unit}</text></g>)}</svg><figcaption>教学模拟数据 · 非真实行情、权重或官方贡献</figcaption></figure>;
}
export function WeightRanking({analysis}){return <Bars title="成分股权重排行榜" rows={analysis.top.map(x=>({name:x.name,value:x.weight*100}))}/>;}
export function ContributionChart({analysis}){return <Bars title="近似涨跌贡献排序" signed unit="百分点" rows={[...analysis.rows].sort((a,b)=>b.contributionPP-a.contributionPP).map(x=>({name:x.name,value:x.contributionPP}))}/>;}
export function BreadthChart({analysis}){return <Bars title="市场广度" rows={[{name:'上涨家数占比',value:analysis.upRatio*100},{name:'下跌家数占比',value:analysis.downRatio*100}]}/>;}
export function ExposureChart({analysis}){return <Bars title="行业风险暴露（模拟）" rows={analysis.sector.map(x=>({name:x.name,value:x.weight*100}))}/>;}
export function ComparisonChart({analysis}){return <Bars title="市值加权与等权教学比较" signed rows={[{name:'模拟市值加权',value:analysis.approxReturn*100},{name:'期初等权',value:analysis.equalReturn*100}]}/>;}
