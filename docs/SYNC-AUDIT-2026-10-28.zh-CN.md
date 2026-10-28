# 自动内容同步与发布排查（2026-10-28）

## 实测与结论

线上目标是GitHub Pages：https://henghenglin.github.io/Linna-s-web/，不是旧Sites域名。读取主页HTTP200，实际JS为 /Linna-s-web/assets/index-DkoOuzf_.js。JS包含GitHub Raw地址、no-store、校验、焦点刷新和压缩后的6e5毫秒轮询。线上成功发布记录对应GitHub提交77c6086f9b78666c54fcde1ac3955f80c3b67416，run 40660834879成功。它没有六批本地开发的新功能，这是此前明确不推送的结果，不是每日同步功能丢失。

本次远程Raw、Pages静态JSON均HTTP200，均56条、版本2026-10-28T14:09:00+08:00，内容逐字一致。远程两篇正式研究文章ID均可在实际线上JS初始数据中找到，ID能通过现有路由按kind映射。当前未复现“远程新文章线上数据缺失”。ID research-2026-10-27-market-microstructure 的date字段为2026-10-28，筛选应按date字段而非ID中的日期；不擅自修改此历史数据。

Raw响应Access-Control-Allow-Origin:*、Cache-Control:max-age=300，类型text/plain但response.json可解析；Pages JSON也允许跨域、max-age=600。主页与资源也是正常公开响应。本次没有证据显示服务器CORS拒绝；HTTP客户端结果不能等同浏览器实际网络面板。缓存可能短暂延迟，但不能据此判定为本次根因。浏览器实际验收因工具超时未完成，用户网络、扩展与会话缓存仍未核实。

没有发现初始构建数据覆盖远程成功结果：初值仅useState，成功后setEntries，焦点和轮询使用同一远程链路；路由kind包括research/topic、briefing和english分类，未发现本次56条遗漏。首页原先“文章全为演示”的文案已过时，本地改为按各自状态标注。

## 确认的问题与本地修复

1. catch吞掉全部异常，底部只显示通用失败提示，无HTTP/JSON/校验原因。新增content-client与use-public-content统一加载，顶部SyncStatus显示失败原因、成功读取时间、内容版本、数量、最近尝试、重试和文章ID核对。
2. 旧“云端内容已同步时间”实为snapshot.updatedAt，不是请求成功时间。现在两者独立显示，北京时间格式化。
3. 没有旧版本回退防护。本地拒绝比上次成功版本更早的快照，保留已有内容；失败也不回写静态数据。返回可见页面增加刷新。
4. Pages和Test/build工作流在每次push无条件整站构建。新增纯内容路径忽略规则及content.yml：每日Markdown/JSON只运行verify-content-snapshot，核对二者完整一致，不构建不部署。前端代码或工作流变化仍测试、构建并发布；手动workflow_dispatch保留。混合代码+内容提交仍正常构建。

失败网络原因在浏览器fetch通常无法区分DNS、CORS或扩展，因此明确列为检查方向，不能伪造精确诊断。HTTP错误则显示实际状态码；JSON与校验错误分别呈现。

## 自动验收

content-sync.test.mjs验证远程读取、完整ID、日期排序、全部kind路由、失败原因、旧版本拒绝和缺失ID；其他既有测试保留。verify-content-snapshot.mjs无构建核对Markdown与JSON；audit-content-release.mjs读取只读HTTP抓取文件，核对线上JS能力、Raw数据校验与生产读取函数中所有ID。静态产物缺新ID仅作为版本差异报告，不能要求每日重建。main DOM增加公开文章ID、内容版本与状态data属性，为后续真正浏览器自动验收提供观测点。

本次56项测试通过，内容一致性检查与生产构建通过。浏览器渲染验收标记false，未声称HTTP测试等于可见页面验证。主包>500kB性能提示尚存。

## 待用户确认的生产方案（尚未执行）

实际修改发布源：HengHengLin/Linna-s-web 的远程main，通过.github/workflows/pages.yml发布到GitHub Pages；不写入Sites独立部署源，也不改现有云端任务或公开访问范围。

生产发布应从远程main最新提交单独检出，保留远程当日全部Markdown与JSON，只移植同步模块、SyncStatus、main中的同步相关最小修改、CSS与CI路径规则、验收脚本/测试。不要把本地main整体推送：六批研究内容、其路由和未审核初稿仍按用户此前要求保留本地。使用最新SHA父提交和expected_sha，遇并发内容更新重新读取合并，禁止force。

该一次性前端修复需要构建发布；之后纯每日内容只验证JSON/Markdown，不再无条件重建。上线后需检查新JS、新状态面板、浏览器实际Raw请求、当前article ID与最后成功时间，再在保持页面打开的情况下验证焦点刷新和失败提示。未经用户确认不实施以上生产操作。
