# 读书笔记内容管理

正式入口：`#/reading`。一书一份 `content/reading/<稳定英文ID>.md`。这是公开原创整理，不存储私人批注，也不转载书籍全文。

## 新增书籍，不改网页代码

1. 在 GitHub 仓库打开 `content/reading/antifragile.md`，参照其结构，在 `content/reading/` 使用 Add file 新建 `<id>.md`。
2. 文件以 `---` 包围 JSON 元数据，后接 Markdown 正文。ID 必须等于文件名，不得重复。保留字段和类型；修改书名、作者、首版年份、整理日期、摘要、主题、来源及核验日期。
3. 来源必须是可核验的 HTTPS 原始资料。正文使用原创概括与评论，区分作者论点、本站分析、教学案例与事实；不声称 Linna 的阅读体验或投资立场。`status: curated`、`ownerViewpoint: false` 不代表 Linna 已批准的投资观点。
4. 在提交前运行 `node scripts/reading.mjs` 生成快照，提交 Markdown、`public/reading.json` 与 `src/reading.generated.json`。若直接在 GitHub 编辑，可只提交 Markdown：PR 校验会验证源文件，合并后自动生成公开快照。
5. 使用普通 PR 审核后合并 main。工作流生成并提交 `public/reading.json`，只更新读书数据，不改每日 `public/content.json`、资金数据或其他页面。不需要下载 ZIP、修改 React 或每本书重新部署。

前端首次使用构建内置副本，然后读取 GitHub Raw 的 `public/reading.json`；页面打开、重新聚焦和十分钟轮询刷新。失败保留最后有效内容，仅记录控制台日志。Raw/CDN 缓存可能导致短暂延迟。前端功能更新仍由现有 Pages 工作流构建部署。

## 校验与边界

`npm run reading:check` 检查源文件与快照一致性。`npm test` 测试字段、重复 ID、审核状态、来源、检索和失败回退。任何私密草稿请保存在仓库外的本地私有目录或私有仓库；本目录、快照、Git 历史均为公开。

只支持安全 Markdown 子集：二/三级标题、段落、列表、引文与 HTTPS 链接。任意 HTML 不执行。不要粘贴原书长篇文字、付费内容、账户信息、私人交易或个人批注。十条思想和七部分是主题梳理，并非完整替代书籍。

《反脆弱》本次由 Linna 明确授权公开原创整理；不添加 approvedBy 或伪造个人观点审核记录。其他书籍沿用公开资料核验与普通 PR 审核流程。
