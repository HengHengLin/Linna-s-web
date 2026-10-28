export const aerospaceCandidates=[
['300699.SZ','光威复材','上游材料及元器件','碳纤维与复合材料',null],
['002179.SZ','中航光电','上游材料及元器件','互连与连接器','https://static.cninfo.com.cn/finalpage/2026-03-28/1225044952.PDF'],
['002025.SZ','航天电器','核心分系统','连接器、微特电机与控制组件','https://static.cninfo.com.cn/finalpage/2026-03-31/1225054265.PDF'],
['600879.SH','航天电子','核心分系统','电子信息与测控候选',null],
['600118.SH','中国卫星','整机制造','小卫星制造候选',null],
['601698.SH','中国卫通','发射与运营','通信广播卫星运营','https://static.cninfo.com.cn/finalpage/2026-04-01/1225067883.PDF'],
['002465.SZ','海格通信','下游商业应用','无线通信与北斗导航','https://static.cninfo.com.cn/finalpage/2026-03-28/1225044009.PDF'],
['688333.SH','铂力特','上游材料及元器件','金属增材制造候选',null]
].map(([id,name,stage,product,url])=>({id,name,stage,product,source:url,sourceTitle:url?'2025 年年度报告':'原始披露待补',publishedAt:url?.includes('04-01')?'2026-04-01':url?.includes('03-31')?'2026-03-31':url?'2026-03-28':null,verifiedAt:url?'2026-10-28':null,evidenceLevel:url?'已核验业务方向披露':'待核实候选',supplyRelation:'未确认具体商业火箭客户或核心配套关系',revenueExposure:null,competitors:null,position:null,risk:'订单转化、交付认证、客户集中与现金流需逐项核实',scope:url?'2025年年报业务方向，不是特定商业火箭客户、订单或利润证据':'待核实',indices:[]}));
