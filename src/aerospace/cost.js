export const defaults={manufacturing:300,uses:10,refurbishment:10,launches:12,payload:15000,price:80,operations:20,fixedAnnual:120,years:1,utilization:.8,moneyUnit:'百万元',payloadUnit:'kg'};
export function rocketCost(x){
 if(x.moneyUnit!=='百万元'||x.payloadUnit!=='kg')throw Error('单位必须为百万元与 kg');
 for(const k of ['manufacturing','uses','refurbishment','launches','payload','price','operations','fixedAnnual','years','utilization'])if(typeof x[k]!=='number'||!Number.isFinite(x[k])||x[k]<0)throw Error('输入必须为非负有限数');
 if(!Number.isInteger(x.uses)||x.uses<1||!Number.isInteger(x.launches)||x.launches<1||x.payload<=0||x.years<=0||x.utilization<=0||x.utilization>1||x.manufacturing<=0||x.price<=0)throw Error('复用、发射次数须为正整数；运载能力、年数、制造成本和售价须为正；装载率须为(0,1]');
 const vehicles=Math.ceil(x.launches/x.uses),refurbishments=x.launches-vehicles;
 const manufacturing=vehicles*x.manufacturing,operations=x.operations*x.launches,refurbishment=refurbishments*x.refurbishment,fixed=x.fixedAnnual*x.years;
 const total=manufacturing+operations+refurbishment+fixed,revenue=x.price*x.launches,deliveredKg=x.payload*x.utilization*x.launches;
 return {vehicles,refurbishments,total,revenue,contribution:revenue-total,margin:(revenue-total)/revenue,perKg:total*1e6/deliveredKg,breakEvenPrice:total/x.launches,annualFrequency:x.launches/x.years,manufacturing,operations,refurbishment,fixed,deliveredKg};
}
