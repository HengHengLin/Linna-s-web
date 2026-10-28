import React, {useRef} from 'react';
import {diagramTitles} from '../diagrams';
export default function Diagram({id,alt,caption}) {
 const dialog=useRef(null);
 if(!Object.hasOwn(diagramTitles,id))return null;
 const title=diagramTitles[id];
 const src=`${import.meta.env.BASE_URL}research/diagrams/${id}.svg`;
 return <figure className="research-diagram"><img src={src} alt={alt || `${title}：研究框架示意图`} width="1280" height="755" loading="lazy"/><figcaption>{caption || `${title} · 研究框架示意图（非实时行情、非真实权重）`}</figcaption><button type="button" className="diagram-open" onClick={()=>dialog.current.showModal()} aria-label={`放大查看${title}`}>放大查看</button><dialog ref={dialog} className="diagram-dialog" aria-label={`${title}放大图`}><button type="button" className="diagram-close" onClick={()=>dialog.current.close()}>关闭放大图</button><p>可横向滚动查看完整图表；按 Esc 关闭。</p><div className="diagram-scroll"><img src={src} alt={alt || title} width="1280" height="755"/></div><a href={src} target="_blank" rel="noopener noreferrer">单独打开 SVG</a></dialog></figure>;
}
