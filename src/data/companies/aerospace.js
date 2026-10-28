import base from './candidates.json' with {type:'json'};
import {aerospaceCandidates} from '../../aerospace/companies.js';
export const aerospaceCompanyProfiles=aerospaceCandidates.map(c=>({...structuredClone(base[0]),id:c.id,stockCode:c.id,name:c.name,exchange:c.id.endsWith('.SH')?'SSE':'SZSE',indices:[],chains:[{id:'aerospace',stage:c.stage,status:'candidate',evidence:[]}],researchLinks:[],researchQuestions:['产品证据','供应关系','收入暴露','订单到现金流'],verificationMetrics:['分部收入与利润','订单转化','资本开支','经营现金流'],inputSource:'第三批公开资料候选筛选；具体商业航天供应关系未确认。',sources:[],aerospaceResearch:c}));
