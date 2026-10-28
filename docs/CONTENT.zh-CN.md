# 内容编辑与审核

每篇公开内容是 content/public 下的一份 .md 文件。格式是 JSON 元数据加 Markdown 正文；JSON 的逗号、引号必须完整。编辑前可复制已有演示文件，但不要把演示自动改成个人观点。

## 正式研究示例格式

以下仅说明结构。请在 Linna 实际审核后填入真实内容及资料地址，不要直接发布示例。

```markdown
---
{
  "id": "unique-research-slug",
  "kind": "research",
  "title": "文章标题",
  "category": "RWA",
  "date": "2026-10-10",
  "summary": "简短摘要",
  "tags": ["RWA", "数字资产"],
  "status": "approved",
  "approvedBy": "Linna",
  "approvedAt": "2026-10-10",
  "sources": [{"title": "实际资料标题", "url": "https://example.com/source"}]
}
---

## 研究问题

写入已经审核的正文。

## 证据与反面解释

- 第一条证据
- 尚待确认的限制

## 结论与风险

写入 Linna 已确认的观点与适用范围。
```

## 支持字段

- kind：research（研究）、journal（学习笔记）、lesson（每日课程）、weekly（演讲精听）、briefing（简报）、topic（推荐选题）。
- 每条内容必须有唯一 id、标题、摘要、分类、YYYY-MM-DD 日期、标签、状态、来源数组与正文。
- status：demo 是可公开的演示，approved 是已经由 Linna 批准的内容。curated 是用户已授权定期更新的核验材料或推荐选题，必须标注 ownerViewpoint: false 和 sourceVerified: true，只可用于 lesson/weekly/briefing/topic。draft/pending 等未审核观点不能进入公开目录，会使构建失败。
- approved 内容需要 approvedBy 为 Linna、真实 approvedAt 日期和至少一条 HTTPS 来源；由用户提供的 journal 学习总结可改用 sourceType: "owner-summary" 与 sourceNote 说明来源，不能伪造外部来源。journal 必须填写 oneLine，并包含讨论、要点、纠正、详细总结和下一步练习。元数据只能记录人工批准，程序无法判断批准是否真实。AI 不得自行填入批准信息。
- 课程和演讲正式发布还需要 videoUrl 与 sourceVerified: true；请实际核对视频标题、日期、时长和片段，再标记核验。transcriptUrl 可用于官方字幕来源；用正文记录准确时间戳，禁止复制完整无授权字幕。
- 简报正式发布还需要 updatedAt，例如 `2026-10-10T09:00:00+08:00`；前台统一显示北京时间。
- reading、duration 可以补充中文阅读说明与时长。

## Markdown 范围

支持段落、二级/三级标题、无序/有序列表、引用和 HTTPS 链接。段落间空一行，标题也单独成段。HTML 会作为普通文字显示，不执行；不支持 MDX 代码、表格、图片或组件。需要这些能力时再扩展，不引入不必要的复杂功能。

## 日常更新步骤

1. 在本项目和公开仓库之外整理候选资料、自动生成笔记与未审核观点。
2. 核对来源、链接、时间与内容，明确区分事实、推断和个人观点。
3. Linna 审核并批准署名、观点与公开范围。
4. 将批准后的 Markdown 放到 content/public，填写批准日期及来源。
5. 执行 npm run content:check、npm test、npm run build，预览文章和链接。
6. 查看 Git diff，确认没有私人或未审核资料，再提交、推送、部署。

云端定时任务只自动发布 curated 学习材料、事实简报与候选选题，不能自动发布个人观点。更新流程见 CLOUD-UPDATES.zh-CN.md。修改状态文字不能替代真实审核。

## 用户授权展示的研究框架

2026-10-28 用户明确要求公开导入第一批指数与产业链研究初稿。此次例外只适用于 src/index-research.json 的 research-outline 专题结构，ownerApproved 必须为 false，前台明确显示未审核。它独立于 content/public 的正式内容流水线，不能用 demo 或 approved 冒充，也不放宽自动任务的发布权限。无核验数据保持待核验，后续公司档案、产业链环节和原始资料逐项补齐。

## 站内研究 SVG

支持独立段落格式：`![图表替代文本](/research/diagrams/star50.svg "可选图注")`。仅允许 diagrams.js 中登记的七张站内图表，路径不可包含协议、查询参数、目录穿越或外部地址。SVG 使用 img 隔离加载，不能内联 XML、HTML 或脚本。图表由仓库人工维护，新增文件必须检查 XML 仅含静态图形与文字，无脚本、事件、外链或 foreignObject。图注与放大功能统一由 Diagram 组件提供；图表不改变文章审核状态。

## 第二批授权研究初稿

用户授权本地制作的三篇指数分析初稿位于 content/outlines/，由固定模块导入专题页，明确未经 Linna 观点审核。它们不进入 content/public、不写 approved 字段，不扩大云端任务的发布权限。教学案例仅使用 SIM 虚构编号，真实数据接入仍须有原始来源与同口径日期。
