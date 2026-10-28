export const chainNames={memory:'HBM与存储',packaging:'晶圆与先进封装',robotics:'具身智能硬件',biopharma:'创新药研究',aerospace:'航空航天候选研究',semiconductor:'半导体与算力',consumer:'消费品牌',finance:'金融服务',resources:'能源与矿产资源',battery:'动力电池与储能',optical:'AI 数据中心光互连',pcb:'AI 数据中心 PCB',energy:'光伏与储能'};
export function validateCompanies(companies,topicIds){
 const ids=new Set();
 const fail=()=>{throw Error('公司数据或证据无效');};
 const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
 const evidence=items=>{if(!Array.isArray(items)||!items.length)fail();for(const s of items){let u;try{u=new URL(s.url);}catch{fail();}if(u.protocol!=='https:'||u.username||u.password||!s.title||!date(s.publishedAt)||!date(s.verifiedAt)||!s.scope)fail();}};
 for(const c of companies){
 if(!(/^(?:\d{6}\.(?:SH|SZ|KRX)|[A-Z]{1,6}\.(?:NYSE|NASDAQ)|\d{4}\.TWSE)$/.test(c.id))||c.stockCode!==c.id||ids.has(c.id)||!c.name||c.exchange!==(c.id.endsWith('.SH')?'SSE':c.id.endsWith('.SZ')?'SZSE':c.id.split('.').at(-1))||c.status!=='candidate'||c.ownerApproved!==false)fail();ids.add(c.id);
 for(const f of ['products','businessModel','controllingShareholder','actualController','ownershipType','competitivePosition','marketShare','growthDrivers','risks']){const x=c[f];if(!x||!['unverified','verified'].includes(x.status))fail();if(x.status==='unverified'&&x.value!==null)fail();if(x.status==='verified'){if(x.value===null)fail();evidence(x.evidence);}}
 for(const x of Object.values(c.advantages)){if(x.value!==null||x.status!=='unverified')fail();}
 for(const x of c.indices){if(!topicIds.includes(x.id)||!['research-sample','verified-member'].includes(x.relationship))fail();if(x.weight!==null||x.membershipVerified||x.relationship==='verified-member'){if(!x.membershipVerified||x.relationship!=='verified-member'||!date(x.asOf)||typeof x.weight!=='number'||x.weight<0||x.weight>100)fail();evidence(x.evidence);}}
 for(const x of c.chains){if(!chainNames[x.id]||!x.stage)fail();}
 for(const x of [...c.customers,...c.suppliers])evidence(x.evidence);
 for(const x of c.researchLinks)if(!topicIds.includes(x.topicId)||!['author-explicit','site-extension'].includes(x.relationship))fail();
 for(const x of c.viewpointLinks){if(!['author-explicit','site-extension'].includes(x.relationship)||!x.viewpointId)fail();if(x.relationship==='author-explicit'){if(!x.quote)fail();evidence(x.evidence);}}
 }
 return companies;
}
// Resolve only recorded associations; never infer an author's recommendation.
export function companiesForViewpoint(companies,viewpointId){
 return companies.flatMap(company=>company.viewpointLinks.filter(link=>link.viewpointId===viewpointId).map(link=>({companyId:company.id,companyName:company.name,relationship:link.relationship,label:link.relationship==='author-explicit'?'原作者明确提及':'本站延伸关联',evidence:link.evidence || []})));
}
