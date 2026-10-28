import candidates from './candidates.json' with {type:'json'};
import {aerospaceCompanyProfiles} from './aerospace.js';
import {biopharmaProfiles} from './biopharma.js';
import {embodiedNewProfiles} from './embodied.js';
import {aiCandidates} from '../../embodied/data.js';
import {validateCompanies} from './model.js';
export const companies=validateCompanies([...candidates,...aerospaceCompanyProfiles,...biopharmaProfiles,...embodiedNewProfiles].map(c=>({...c,aiResearch:aiCandidates.find(a=>a.id===c.id)})),['star50','sse50','chinext']);
export const issuers=companies.map(c=>({id:`issuer:${c.id}`,name:c.name,securityIds:[c.id],status:'single-security-record'}));
// Additional listings must be explicitly linked by verified issuer identity, never fuzzy names.
export function validateIssuerLinks(items,securities){const seen=new Set();if(new Set(items.map(x=>x.id)).size!==items.length)throw Error('发行人ID重复');for(const x of items)for(const id of x.securityIds){if(!securities.some(c=>c.id===id)||seen.has(id))throw Error('证券归属不存在或重复');seen.add(id);}return items;}
