export const smicSources={
 quarter:{id:'smic-q2-2026',title:'中芯国际 2026 第二季度业绩（IFRS，未经审计）',url:'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0813/2026081300353.pdf',publishedAt:'2026-08-13',asOf:'2026-06-30',verifiedAt:'2026-10-28',locator:'PDF 第1、3、5–6页'},
 interim:{id:'smic-h1-2026',title:'中芯国际 2026 中期报告',url:'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0903/2026090300630.pdf',publishedAt:'2026-09-03',asOf:'2026-06-30',verifiedAt:'2026-10-28',locator:'PDF 第6–8、10、14、58页'},
 competition:{id:'intel-2025-10k',title:'Intel 2025 Form 10-K · Competition',url:'https://www.intc.com/filings-reports/annual-reports/content/0000050863-26-000011/intc-20251227.htm',publishedAt:null,asOf:'2025-12-27',verifiedAt:'2026-10-28',locator:'Intel Foundry · Competition'}
};
export const publicProfiles={
 '688981.SH':{
  level:'full',name:'中芯国际',securities:['688981.SH（科创板）','00981.HK（香港）'],asOf:'2026-06-30',reviewedAt:'2026-10-28',
  summary:'中芯国际向芯片设计企业提供晶圆制造与配套技术服务。研究重点是把产能、产品结构与定价变化，同折旧、资本开支和现金回收放在一起看。',
  facts:[
   {label:'主营业务',text:'晶圆代工及技术服务，提供 8 英寸与 12 英寸晶圆制造。',source:'quarter'},
   {label:'产品与服务',text:'工艺平台涵盖逻辑、功率/模拟、高压显示驱动、非易失存储、混合信号/RF 与图像传感器；另有设计、IP 与光罩配套。',source:'interim'},
   {label:'商业模式',text:'客户完成芯片设计，晶圆厂按工艺与订单制造；由试产、风险生产走向量产。良率与认证影响交付，固定成本使利用率尤其重要。',source:'interim'},
   {label:'下游应用',text:'手机、计算机与平板、消费电子、互联与物联网、工业与汽车。应用类别不是已确认的具体客户名单。',source:'quarter'},
   {label:'制造能力',text:'以多工艺平台和规模制造服务不同应用；8 英寸等效口径用于产能比较，不能当作实际 12 英寸片数，也不用于推断具体先进节点良率。',source:'quarter'}
  ],
  flow:['中芯国际','晶圆制造与技术服务','8 / 12 英寸晶圆及配套服务','消费电子 / 工业汽车 / 互联应用'],
  financials:[
   {label:'季度营业收入',value:3005.6,display:'3,005.6 百万美元',period:'2026 Q2',basis:'IFRS，未经审计',source:'quarter'},
   {label:'季度毛利率',value:25.3,display:'25.3%',period:'2026 Q2',basis:'毛利 / 营业收入',source:'quarter'},
   {label:'产能利用率',value:93.7,display:'93.7%',period:'2026 Q2',basis:'晶圆产出 / 估计季度产能',source:'quarter'},
   {label:'资本开支',value:1835.7,display:'1,835.7 百万美元',period:'2026 Q2',basis:'公司季度披露口径',source:'quarter'},
   {label:'经营活动现金流净额',value:3207.101,display:'3,207.101 百万美元',period:'2026 H1',basis:'中期报告现金流量表；原表 USD thousand 换算',source:'interim'},
   {label:'购置固定资产现金支出',value:2853.006,display:'2,853.006 百万美元',period:'2026 H1',basis:'现金流量表购置物业、厂房及设备；不等同季度资本开支',source:'interim'}
  ],
  competition:'台积电、联电、GlobalFoundries 与中芯国际处在相互竞争的代工市场。Intel 年报提供同业竞争的原始披露；具体工艺、客户及规模不同，不能据此给出统一技术排名或市场份额。',
  assessment:'研究判断：高利用率有助于分摊固定制造成本，但扩产后的折旧和产品价格会改变利润兑现。技术平台的广度、认证与稳定交付是业务能力；它们不能单独证明股票估值便宜。',
  risks:['终端需求与客户库存波动可能改变利用率和售价。','设备与技术获取受贸易及监管环境影响，扩产不等于有效产出。','新产线折旧、良率爬坡及资本开支可能压低投资回报。'],
  watch:['同口径利用率、晶圆出货及平均售价','产品组合、毛利率与折旧变化','经营现金流与设备付款的差额、扩产后的回收周期'],
  limits:'数据覆盖至 2026 年中期，不使用管理层三季度指引代替实际业绩。具体客户、供应商、最新市场份额和指数权重未建立可确认关系，本页不展示这些关系。',
  sources:smicSources
 }
};
export function companyPublication(c){
 if(publicProfiles[c.id])return {level:'full',sources:Object.values(publicProfiles[c.id].sources)};
 if(c.aerospaceResearch?.source)return {level:'partial',sources:[{title:c.aerospaceResearch.sourceTitle,url:c.aerospaceResearch.source,publishedAt:c.aerospaceResearch.publishedAt,verifiedAt:c.aerospaceResearch.verifiedAt,scope:c.aerospaceResearch.scope}]};
 if(c.aiResearch?.productEvidence?.length)return {level:'partial',sources:c.aiResearch.productEvidence};
 if(c.id==='688506.SH'&&c.biopharmaResearch)return {level:'partial',sources:[{title:'百利天恒历史年报与授权业务资料',url:c.biopharmaResearch.source,verifiedAt:c.biopharmaResearch.verifiedAt,scope:'历史业务材料，不作为最新临床结论'}]};
 return {level:'hidden',sources:[]};
}
export const visibleCompanies=companies=>companies.filter(c=>companyPublication(c).level!=='hidden');
