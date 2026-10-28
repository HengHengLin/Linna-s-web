export const diagramTitles = {'index-map':'三大指数研究地图',star50:'科创50产业研究',sse50:'上证50盈利驱动',chinext:'创业板指产业共振',aerospace:'航空航天产业链',biopharma:'创新药研发商业化','embodied-ai':'AI 与具身智能产业链'};
export function diagramId(path) {
 const match=typeof path==='string' && path.match(/^\/research\/diagrams\/([a-z0-9-]+)\.svg$/);
 return match && Object.hasOwn(diagramTitles,match[1]) ? match[1] : null;
}
export function parseDiagram(block) {
 const match=block.match(/^!\[([^\]\n]+)\]\((\/research\/diagrams\/[a-z0-9-]+\.svg)(?: "([^"\n]+)")?\)$/);
 return match && diagramId(match[2]) ? {id:diagramId(match[2]),alt:match[1],caption:match[3]} : null;
}
