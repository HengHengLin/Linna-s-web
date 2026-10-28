# 同步修复生产发布记录

用户已明确批准本次最小范围发布。先fetch远程main，基线77c6086f9b78666c54fcde1ac3955f80c3b67416；确认56条、版本2026-10-28T14:09:00+08:00后建立独立本地分支release/content-sync-20261028，检出/private/tmp/linna-sync-release。仅移植11个同步/CI文件，未推送本地main，也未将本地研究提交设为远程父提交。

生产提交：edfc7bcb3c8657b187c7773e148a3ffdea3a23bd。正常非强制更新main，使用expected_sha；远程内容JSON与Markdown未更改。未修改Pages部署权限（contents:read/pages:write/id-token:write），未修改Sites发布源、访问权限或云端内容任务。

GitHub Actions部署run 40668266250成功，job122748231822全部步骤成功；CI run40668266288成功。生产基线22项测试、本地内容一致性与构建通过。Pages上传dist并发布，生产提交只触发这一次Pages部署。两条工作流的正常构建不等于两次部署。

线上：https://henghenglin.github.io/Linna-s-web/#/home

实测主页200；新JS /Linna-s-web/assets/index-DQceT8Hy.js 和新CSS /Linna-s-web/assets/index-Cggu1Mte.css 均200。Raw及Pages静态JSON仍56条、版本2026-10-28T14:09:00+08:00，内容完全一致。briefing-2026-10-28存在，标题“今日事实简报：中国工业利润、Boeing 季报与 USDC 储备披露”。全部远程ID在当前构建数据中均可找到；旧研究ID及brand-method-lab作品集链接保留在产物中。

新JS包含分开的内容版本时间与最近成功读取时间、具体HTTP/JSON/校验错误、重新同步入口。单元测试覆盖远程数据经生产读取函数及路由后保留全部ID，网络/HTTP/校验失败、旧快照拒绝和缺失ID报警。源码失败分支只更新sync状态，不清空或替换entries，因此保留已有内容。未经真正浏览器断网测试，不声称线上故障交互已实际通过。

浏览器验收工具再次超时。以下尚未完成：可见页面渲染、实际浏览器Raw网络请求与CORS/缓存观测、手动打开当天简报、最近成功时间实时显示、模拟故障后保留旧内容与错误提示、点击重试、旧文章和导航实际点击。HTTP/JS/数据通过不等于这些交互通过。

工作流逻辑：仅content/public/**与public/content.json变化时，pages.yml与check.yml的paths-ignore跳过整站构建；content.yml运行verify-content-snapshot.mjs，核对Markdown和JSON而不build/deploy。代码或工作流变化仍触发原构建/Pages流程；本次代码提交已实际证明该链路。未人为新增内容提交来测试内容路径，纯内容触发规则经过配置核对，下次真实自动内容更新可核对其运行结果。

保护范围：本次未上传src/aerospace、src/biopharma、src/embodied、src/knowledge、src/data/companies、7张新SVG、content/outlines或六批本地研究内容。此前生产基线已存在的第一批专题结构和既有审核文章原样保留，不能将其误称为本次发布。六批未发布增量仍留在原本地分支。

当前应称为“生产发布成功，HTTP/数据与资源验收通过；浏览器交互验收未完成”。后续日常内容由网页Raw自动拉取，无须每次重新部署。
