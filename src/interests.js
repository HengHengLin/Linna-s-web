// Explicit user interests; these are study directions, not investment conclusions.
export const researchInterests = [
  { id: 'ai-biomed', title: 'AI × 生物医疗', description: '从技术能力、科学证据与商业化路径，研究 AI 如何与生物医药和医疗场景结合。', tags: ['AI 药物研发', '医疗 AI', '临床证据'], keywords: ['生物', '医疗', '医药', '药物', 'biotech', 'biomedical', 'drug discovery'], question: 'AI 药物研发的技术进展，怎样才能转化为可验证的临床与商业成果？', angle: '区分模型表现、实验验证、临床结果与收入模式，先核验原始论文、试验登记和公司披露。' },
  { id: 'aerospace', title: '航空航天', description: '围绕航空、商业航天、卫星与产业链，梳理技术进展、需求与经营模式。', tags: ['商业航天', '卫星产业', '航空制造'], keywords: ['航空', '航天', '卫星', '火箭', 'aerospace', 'satellite', 'aviation'], question: '航空航天产业链中，哪些环节的需求与商业模式值得持续跟踪？', angle: '比较技术里程碑、订单与交付、成本、资金需求及客户集中度，避免将技术突破直接等同于盈利。' },
  { id: 'wyckoff', title: '威科夫与量价分析', description: '研究价格与成交量、供需结构和交易复盘方法，逐步建立证据与验证习惯。', tags: ['威科夫', '量价分析', '交易复盘'], keywords: ['威科夫', 'wyckoff', '量价', '成交量', '价格行为', 'price action', 'volume'], question: '如何验证一个威科夫形态，而不是在行情结束后给图形贴标签？', angle: '先明确观察区间、价格与成交量证据、确认和失效条件，再用样本复盘检验；不把形态名称当作交易保证。' },
];
export function matchesInterest(entry, interestId) {
  if (!interestId) return true;
  const interest = researchInterests.find(x => x.id === interestId);
  if (!interest) return false;
  const text = [entry.title, entry.summary, entry.category, entry.topic, entry.body, entry.angle, ...(entry.tags || [])].filter(Boolean).join(' ').toLowerCase();
  return interest.keywords.some(keyword => text.includes(keyword.toLowerCase()));
}
