import React,{useState} from 'react';
import {numeric,fmt} from '../flows/data';
export default function FlowChart({title,rows,series,bar=false}){
 const [hover,setHover]=useState(null),[zoom,setZoom]=useState(false);
 const available=series.some(s=>rows.some(r=>numeric(r[s.key])));
 const width=900,height=270,left=78,right=110,top=24,bottom=44,w=width-left-right,h=height-top-bottom;
 const scales=series.map(s=>{const values=rows.map(r=>r[s.key]).filter(numeric);const min=Math.min(0,...values),max=Math.max(0,...values);return {min,max,y:v=>top+h-(v-min)/(max-min||1)*h};});
 const x=i=>left+(i+.5)/Math.max(1,rows.length)*w;
 const active=hover!==null?rows[hover]:null;
 return <figure className="flow-chart"><figcaption><h3>{title}</h3><div className="flow-legend">{series.map((s,i)=><span key={s.key} style={{color:s.color}}>{s.label}（{s.unit}，{i?'右':'左'}轴）</span>)}</div></figcaption>{available?<><button className="flow-zoom-btn" aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?'收起放大':'放大图表'}</button><div className={zoom?'flow-canvas zoom':'flow-canvas'}><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}，可在下方数据表查阅具体数值`} onPointerMove={e=>{const b=e.currentTarget.getBoundingClientRect(),p=(e.clientX-b.left)/b.width*width;setHover(Math.max(0,Math.min(rows.length-1,Math.floor((p-left)/w*rows.length))));}} onPointerLeave={()=>setHover(null)}>
 {[0,.5,1].map(t=><g key={t}><line x1={left} y1={top+t*h} x2={width-right} y2={top+t*h} stroke="#dbe3ed"/>{series.map((s,i)=><text key={s.key} x={i?width-right+8:left-8} y={top+t*h+4} textAnchor={i?'start':'end'} fill={s.color} fontSize="12">{fmt((scales[i].max-t*(scales[i].max-scales[i].min))/s.divisor)}</text>)}</g>)}
 {series.map((s,j)=>bar&&j===0?rows.map((r,i)=>numeric(r[s.key])?<rect key={r.date} x={x(i)-Math.max(1,w/rows.length*.35)} y={Math.min(scales[j].y(0),scales[j].y(r[s.key]))} width={Math.max(1,w/rows.length*.7)} height={Math.max(1,Math.abs(scales[j].y(r[s.key])-scales[j].y(0)))} fill={r[s.key]>=0?'#0d9488':'#b45363'}/>:null):<path key={s.key} d={rows.map((r,i)=>numeric(r[s.key])?`${i===0||!numeric(rows[i-1][s.key])?'M':'L'}${x(i)},${scales[j].y(r[s.key])}`:'').join(' ')} fill="none" stroke={s.color} strokeWidth="2"/>)}
 {hover!==null&&<line x1={x(hover)} x2={x(hover)} y1={top} y2={top+h} stroke="#64748b" strokeDasharray="3 3"/>}
 {[0,rows.length-1].map((i,j)=><text key={j} x={j?width-right:left} y={height-14} textAnchor={j?'end':'start'} fontSize="13" fill="#475569">{rows[i]?.date}</text>)}
 </svg></div><div className="flow-tooltip" aria-live="polite">{active?`${active.date} · ${series.map(s=>`${s.label} ${fmt(numeric(active[s.key])?active[s.key]/s.divisor:null,s.unit)}`).join(' · ')}`:'移动鼠标或触摸图表查看每日数值；完整数据见下表。'}</div></>:<div className="flow-no-chart">暂无数据</div>}</figure>;
}
