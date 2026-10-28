// All values in this dataset are synthetic; IDs do not identify real securities.
const weights=[.35,.25,.08,.07,.06,.05,.04,.03,.025,.02,.015,.01];
export const simulation={mode:'simulation',asOf:'2026-10-28',basis:'教学期初权重',returnBasis:'price',rows:weights.map((weight,i)=>({id:`SIM${i+1}`,name:`模拟公司 ${i+1}`,weight,return:i<2?.08:-.02,asOf:'2026-10-28',basis:'教学期初权重',industry:i<2?'模拟科技':'模拟其他',ownership:'模拟类别（非真实所有制）'}))};
export const demandMappings=[['300308.SZ','高速光模块'],['300502.SZ','高速光模块'],['300394.SZ','光器件'],['300476.SZ','PCB']].map(([companyId,stage])=>({companyId,stage,factor:'AI 数据中心需求',status:'hypothesis',sources:[],exposureFraction:null,note:'研究假设；部分业务可能共享需求，不表示收入全部暴露或收益率相关性已验证'}));
export const realData={star50:null,sse50:null,chinext:null};
export const etfFields=['ETF 名称','代码','跟踪指数','基金规模及币种','管理费（年）','托管费（年）','跟踪误差及计算区间','成交额与观察区间','数据日期','来源与核验日期'];
