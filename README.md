# Gate Screener

Gate 合约全市场扫描与筛选系统。项目采用前后端分离 monorepo，前端提供单页高密度筛选界面，后端负责 Gate 全市场合约扫描、均线/涨跌幅/形态判断、策略存储与结果返回。

## 技术栈

- 前端: React 19, TypeScript, Vite, 原生 CSS, `echarts-for-react`, `lucide-react`
- 后端: Node.js, TypeScript, Fastify, `gateio-api`, `zod`, `p-limit`, `lru-cache`
- 测试: Vitest, Testing Library

## 目录结构

```text
gate-screener/
├─ apps/
│  ├─ api/
│  └─ web/
├─ packages/
│  ├─ shared-types/
│  └─ shared-utils/
├─ examples/
│  └─ strategies/
├─ pnpm-workspace.yaml
└─ README.md
```

## 已完成能力

- 单页筛选界面，首屏直接展示基础筛选、均线筛选、涨跌幅筛选、形态筛选、结果区
- 顶部条件摘要标签、策略保存、策略加载、策略删除
- Gate USDT 永续市场 contracts/tickers/candles 接入
- 扫描引擎: 初筛、K 线并发拉取、均线/涨跌幅/形态判断、排序与裁剪
- 结果表格 + ECharts K 线详情图 + MA 叠加 + 命中标记
- 本地 JSON 策略存储
- 14 个后端测试 + 2 个前端交互测试

## 环境准备

- Node.js 20+
- `pnpm` 10+

## 本地运行

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. 启动前后端

```bash
pnpm dev
```

默认地址:

- Web: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001](http://localhost:3001)

## 构建与测试

```bash
pnpm build
pnpm test
```

单独运行:

```bash
pnpm dev:web
pnpm dev:api
pnpm --filter @gate-screener/web test
pnpm --filter @gate-screener/api test
```

## API 说明

### `GET /api/meta/contracts`

返回 Gate USDT 永续合约基础列表。

### `POST /api/scan`

提交完整筛选条件并返回扫描结果。

请求示例:

```json
{
  "settle": "usdt",
  "timeframe": "1h",
  "minVolume": 500000,
  "minTurnover": 5000000,
  "limit": 50,
  "sortBy": "change",
  "sortDirection": "desc",
  "maRules": [
    {
      "id": "ma-5",
      "period": 5,
      "direction": "UP",
      "slopeRange": "45_90",
      "klineRelation": "ABOVE_MA"
    }
  ],
  "maPairRules": [
    {
      "maA": 5,
      "maB": 20,
      "relation": "CROSS_UP"
    }
  ],
  "changeRules": [
    {
      "timeframe": "4h",
      "operator": "GT",
      "value": 3
    }
  ],
  "patterns": ["FLAG_BREAKOUT"]
}
```

返回字段:

- `requestId`: 本次扫描 ID
- `durationMs`: 扫描耗时
- `totalContracts`: 总合约数
- `candidates`: 初筛候选数
- `matched`: 命中数
- `results`: 命中标的列表，内含 K 线、MA 序列、命中原因、形态与图表标注

### `POST /api/strategies`

保存策略。

```json
{
  "name": "趋势突破扫描",
  "request": { "...": "完整 ScanRequest" }
}
```

### `GET /api/strategies`

返回全部策略列表。

### `GET /api/strategies/:id`

返回单个策略。

### `DELETE /api/strategies/:id`

删除策略。

## 示例策略

已提供 3 个 JSON 示例:

- [trend-breakout.json](/Users/Administrator/Documents/gate%20scaner/examples/strategies/trend-breakout.json)
- [mean-reversion-pins.json](/Users/Administrator/Documents/gate%20scaner/examples/strategies/mean-reversion-pins.json)
- [bearish-reversal.json](/Users/Administrator/Documents/gate%20scaner/examples/strategies/bearish-reversal.json)

## 关键实现说明

- 扫描引擎先用 ticker 做成交量/成交额初筛，只对候选标的拉 K 线
- K 线默认 60 根，复杂形态自动扩展到 120 根
- Gate 公共数据接口结果使用 15 秒短缓存
- 默认并发数 10，可在 `apps/api/src/utils/constants.ts` 中调整
- 形态识别采用工程可用近似版，函数已独立拆分，便于后续精修

## 已知取舍

- 当前仅启用 `USDT` 永续，`BTC` 永续保留了前端入口但未接后端
- 形态筛选按“命中任一所选形态”通过，便于扫描速度和结果规模控制
- 图表使用 ECharts 全量打包，生产构建会有 chunk size 警告，但功能可正常使用
