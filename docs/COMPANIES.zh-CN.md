# 候选公司数据结构与导入记录

新增 src/data/companies/candidates.json（15 家候选）、model.js（校验与产业链枚举）、src/components/Companies.jsx（检索与详情）、tests/companies.test.mjs。已有 IndexResearch 组件内复用专题路由，不新建重复一级页面。七张图表和第一批正文保留。

主键 id 与 stockCode 使用完整交易所后缀代码；exchange 为 SSE/SZSE。代码及行业角色来自用户清单，尚未独立核验。导入日期不是核验日期。缺失事实使用 value:null、status:unverified、evidence:[]，页面显示待核实。不得填零或推算合理数值。

chains 是多对多产业环节；indices 为多对多候选研究关联，relationship:research-sample 不表示最新成分股。真实权重使用百分比口径（0–100），须同时提供 verified-member、membershipVerified:true、asOf 和 evidence。公司与指数初稿的 researchLinks 为 site-extension，仅表明本站整理关联，不表示原作者推荐。

每条证据须保存 title、url（HTTPS）、publishedAt、scope（统计口径）和 verifiedAt。verified 字段必须有证据。客户/供应商条目必须有证据。viewpointLinks 保存 viewpointId、relationship（author-explicit 或 site-extension）；原作者明确提及须附 quote 和原始证据，不得自动从产业关系推导推荐。当前观点关联为空，等待实际原文与观点数据；前台不伪造观点入口。

技术、市场地位、盈利能力、投资价值在 advantages 中分开，第一批全部为空。补充事实时扩展核验逻辑和来源展示后再开放正式数据，不应只把状态改为 verified。研究状态 candidate 与原有内容审核状态独立。

本轮本地完成，未推送部署。浏览器工具此前拒绝访问本地页面，因此移动端视觉及弹窗人工验收待完成，不能以构建通过代替浏览器验收。
