# 市场资金监测：最终发布准备核查

日期：2026-10-29（北京时间）。本轮不增加产品功能；允许创建统一 PR，但禁止合并、部署或启用定时任务。

## 理杏仁：文档覆盖与实测覆盖的区别

| 证券 | 文档可对应的候选接口 | 实测覆盖/历史起点 |
|---|---|---|
| 航发动力 600893.SH | company/margin-trading-and-securities-lending、company/candlestick | 未使用 Token 请求；历史起点与缺口未确认 |
| 长江电力 600900.SH | 同上 | 同上 |
| 中国卫通 601698.SH | 同上 | 同上 |
| 拓普集团 601689.SH | 同上 | 同上 |
| 华夏上证50ETF 510050.SH | fund/candlestick、fund/shares、fund/hot/fet_s | 未实测；ETF 融资明细覆盖没有取得肯定证据 |
| 华夏科创50ETF 588000.SH | 同上 | 同上 |

这些只是文档范围，不是六只标的返回成功的声明。公司信息与基金信息需由其正式标的目录核对；股票融资接口不能自动套到 ETF。

官方文档：
- [个股融资](https://www.lixinger.com/api/open-api/html-doc/cn/company/margin-trading-and-securities-lending)：文档含融资余额、买入及偿还等字段，日期查询区间不超过 10 年，需专属 Token。
- [股票 K线](https://www.lixinger.com/api/open-api/html-doc/cn/company/candlestick)：包含价格与成交量，需区分复权类型。
- [基金 K线](https://www.lixinger.com/api/open-api/html-doc/cn/fund/candlestick)：覆盖场内 ETF/LOF 类型，含价格、成交量等；需 Token，查询区间不超过 10 年。
- [基金份额](https://www.lixinger.com/api/open-api/html-doc/cn/fund/shares)：总份额与场内份额/规模是不同字段，不能相互替代。
- [基金热度份额](https://www.lixinger.com/api/open-api/html-doc/cn/fund/hot/fet_s)：区间汇总不是逐日实际现金申赎。

十年的请求窗口不等于承诺每标的都有十年完整历史。文档未提供可据以确认六标的全部最早日期、更新 SLA、每分钟/每日配额及超限政策的资料，本轮不编造这些指标。

## 费用与授权结论

开放平台公开页面在本轮读取时只返回加载外壳；[历史价格调整页](https://www.lixinger.com/marketing/price-history)不是当前 API 套餐或公开再分发报价。没有核实到可适用于所需全部字段的免费额度或明确价格，不把会员卡价格当 API 价格。

[免责声明](https://www.lixinger.com/marketing/disclaimer)提及非商业引用、展示；但[用户协议](https://www.lixinger.com/marketing/user-agreement)4.6 限定个人/单一机构范围使用，11.2 要求数据公开传播取得书面同意，10.1 规定理解不同时以协议为准。故本项目不能据此确认公开 GitHub JSON 的下载、缓存、再分发或衍生图表授权。

接入前须供应商明确：六标的及 ETF 融资覆盖、历史起点/修订、字段单位、延迟、Token 套餐价格、调用限额，以及非商业网站展示和可下载 JSON 的书面许可范围。
本轮没有注册、购买、申请试用、使用示例/第三方 Token 或发送询价邮件。新增数据服务费用为 0；后续费用未知。

结论：没有确认到同时满足免费、合法、稳定、允许公开分发的 A 股数据源，因此维持六标的空状态与外部查询入口，不改 BTC 702 行快照。

## Git、验收与 PR 边界

远程 main 本轮 fetch 成功；以最新 ref 比对公开内容相关文件，保留 57 条。既有本地改版与市场功能保留。
重新运行全量单元测试、快照校验、生产构建、18 项定向渲染和构建隐私检查。具体结果见最终交付与 PR 描述。
不把此次创建 PR 当作生产验收。市场定时工作流仍只在功能分支中；未合入默认分支、未手动触发、未启用生产计划。PR 测试可运行，Pages 部署只匹配 main。
本机 Git 缺少推送认证时可用获授权 GitHub 连接器上传精确差异，以 main 为父提交生成一个统一提交；必须核对远程树 SHA 与本地候选树一致。main 不写入，禁止强推。
