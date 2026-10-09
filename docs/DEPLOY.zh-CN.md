# 部署、版本与回滚

## 发布前

- 确认演示内容的公开展示范围；正式职业展示应优先准备真实批准研究。
- 确认不含真实交易数据、敏感草稿、凭证或保密信息。
- 执行 npm ci、npm test、npm run build。
- 使用 npm run preview 检查产物；检查手机布局、文章链接、来源与内容状态。

## 静态部署配置

项目基于 Vite，无需数据库或服务器。

- 构建命令：npm run build
- 输出目录：dist
- Node：建议 22 LTS
- 若整个项目文件夹上传仓库：根目录设仓库根；若上传外层目录：根目录设 linna-research-lab。
- 已配置 Sites 静态托管，站点 ID 保存在 .openai/hosting.json；使用原生 Sites 工具核对实际发布状态。生产地址：https://linna-research-lab.luckyaspen8.chatgpt.site。
- 云端内容从 GitHub public/content.json 读取，日常内容更新不需要重新部署。定时任务规则见 CLOUD-UPDATES.zh-CN.md。
- Sites 发布需要将当前源码推送至其独立部署源，保存对应构建归档后发布；GitHub 是项目及内容版本仓库。使用 Sites 插件 source helper 管理部署源，凭证仅经内存与 stdin 传递，不写文件。
- 使用 hash 路由，不依赖服务端路由重写。外部分享文章地址需要保留 `/#/research/文章id` 部分。

## Git

本地已保存原项目基线，后续修改按阶段提交。origin 指向 HengHengLin/Linna-s-web；首次源码同步保留远程原有历史。命令行凭证不可用时可使用已连接的 GitHub 工具提交，之后 fetch 并合并远程内容以保持同步，禁止强制覆盖历史。

提交前查看 git status 与 git diff。node_modules、dist、.env、private 和 backups 已忽略；src/content.generated.json 是派生文件，由脚本重新生成，不提交。

## 回滚

上线后可从托管服务选择此前成功部署回滚；或用 git revert 回退问题提交，再通过测试、构建后推送。保留批准的内容源文件和提交历史。不要把私人数据当作版本备份提交到公开仓库。

## GitHub Actions

仓库中包含测试及构建工作流。推送或 PR 时使用锁文件安装依赖并运行检查；首次连接托管服务后再确认部署分支。工作流不上传私人记录，不自动批准内容，也不代表已经上线。
