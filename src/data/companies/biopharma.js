import base from './candidates.json' with {type:'json'};
import {bioCompanies} from '../../biopharma/data.js';
export const biopharmaProfiles=bioCompanies.map(c=>({...structuredClone(base[0]),id:c.id,stockCode:c.id,name:c.name,exchange:'SSE',chains:[{id:'biopharma',stage:'创新药研发候选',status:'candidate',evidence:[]}],indices:[],researchLinks:[],researchQuestions:['管线','临床概率','授权条款','现金跑道'],verificationMetrics:['临床终点','财报现金','研发支出'],inputSource:c.identityScope,sources:[],biopharmaResearch:c}));
