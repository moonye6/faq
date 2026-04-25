---
status: ACTIVE
date: 2026-04-25
branch: main
mode: SELECTIVE EXPANSION
repo: moonye6/faq
generator: /plan-ceo-review
---

# CEO Plan: faq schema generator → GEO/AEO Schema Platform

## TL;DR

上一轮 SEO 筛选把 `faq schema generator` 列为 S 级最优先方向。CEO 审视后**前提需要重写**：FAQ rich results 自 2023-08 起仅对权威政府/卫生站展示，2026-03 Google 核心更新进一步压制，曝光跌近 50%。**直接做"FAQ schema 生成器"=进入死赛道。**

真窗口在 **GEO/AEO（让内容被 AI 引用）**：FAQ structured data 在 Perplexity / ChatGPT / Gemini / Google AI Overviews 的引用率最高之一，但绝大多数现存工具还在用旧叙事。

**模式：SELECTIVE EXPANSION**。基线=Approach C（GEO/AEO Schema Platform）的生成器矩阵层。监测 / 健康分 / auto-extract 由用户分阶段 cherry-pick。

---

## 前提挑战 (Premise Challenge)

| 时间点 | 事件 |
|---|---|
| 2023-08 | Google 限制 FAQ rich results 仅对"权威政府/卫生站"展示 |
| 2024-2025 | SEO 工具陆续观察到 FAQ rich snippet 流量塌陷 |
| 2026-03 | Google 核心更新进一步压制，FAQ rich result 曝光跌近 50% |
| 2026-04 (现在) | FAQ schema 在 AI 搜索引用率最高之一，价值主张完成迁移 |

**前提重写：**

| 旧前提（上轮分析） | 新前提（修正后） |
|---|---|
| FAQ schema → rich result → SEO 流量 | FAQ schema → AI 引用 → GEO/AEO 流量 |
| 用户 = 想拿 rich snippet 的站长 | 用户 = 想被 ChatGPT/Perplexity 引用的内容方 |
| 价值 = 输出 JSON-LD 片段 | 价值 = AI 友好结构化数据 + 监测被引情况 |
| 竞争 = 10 家免费 FAQ generator | 竞争 = 未明确占位的 GEO/AEO 工具空间 |

---

## Existing Landscape

至少 10 家免费 FAQ schema 生成器在线，其中 **Marcitors 已经在做 pivot**（产品名里写 "AI & Voice Search Ready"）。窗口存在但不大。

主要竞品：
- iLoveSchema、Saijo George、Content Powered、SUSO Digital、Marcitors、RankWithLinks、Jasper AI、ToTheWeb、eesel AI、Digital Scholar

---

## Vision

### 10x Check

传统 FAQ generator 天花板：工具站日 IP 几千，零留存，零 LTV。

10x 版本：GEO/AEO SaaS，按域名/页数订阅 $29-$199/月，留存有意义，LTV 几百到几千美元。

### Platonic Ideal

用户输入域名 → 工具自动爬全站 → 输出：
- (a) schema 缺口分析
- (b) schema validator 报错
- (c) 你的内容被哪些 AI 引用、被引率 vs 同行
- (d) 一键生成补全 schema 并通过 GitHub PR / WordPress / Webflow 推到站上

**这是真产品，不是表单工具。**

### Delight Opportunities

1. "Steal from competitor"：输入对手域名，告诉你对手 schema 覆盖率 + AI 被引情况
2. AI Overviews 截图历史：记录页面什么时候开始被 Google AI Overviews 引用
3. Schema diff：上次扫描 vs 这次，新增/丢失了哪些 structured data
4. 公开 "AI Citation Leaderboard"（按行业）：自带 SEO 内容引擎 + 品牌
5. MCP server / ChatGPT plugin：让 AI agent 在生成内容时主动产出 schema

---

## Implementation Alternatives

### Approach A — Minimal Viable (REJECTED)

```
Summary:  单点 FAQ schema 表单工具
Effort:   人 ~3 天 / CC ~3 小时
Risk:     高（无差异化、价值主张过时、10 玩家红海）
Completeness: 4/10
```

**否决理由**：价值主张已死 2.5 年，竞争盘已饱和。

### Approach B — Schema Matrix (PARTIAL ADOPTION)

```
Summary:  覆盖 FAQ + HowTo + Product + Recipe + Article + Review +
          LocalBusiness + Event + Course + JobPosting + Breadcrumb
Effort:   人 ~2 周 / CC ~6-8 小时
Risk:     中
Completeness: 7/10
```

**部分采纳**：作为 Approach C 的流量入口层基线。

### Approach C — GEO/AEO Schema Platform (RECOMMENDED) ★

```
Summary:  让你的内容被 AI 引用的结构化数据平台。包含:
          1. 多 schema 类型生成器矩阵          (SEO 流量入口 / 必做)
          2. URL/PDF → 自动抽取生成全套 schema (省力工具 / cherry-pick)
          3. AI 引用监测                       (留存机制 / cherry-pick)
          4. Schema 健康监控 + 覆盖率 dashboard (留存机制 / cherry-pick)
          5. AI 友好度评分                     (告诉用户为什么没被引 / cherry-pick)
Effort:   人 ~3-4 周 / CC ~30-40 小时（分阶段）
Risk:     中（叙事新但需要验证"监测 AI 引用"真有人付费）
Completeness: 9/10
```

---

## Scope Decisions (SELECTIVE EXPANSION)

| # | Module | Effort (CC) | Decision | Reasoning |
|---|--------|-------------|----------|-----------|
| 1 | 多 schema 类型生成器矩阵 | ~6-8h | **ACCEPTED (基线)** | SEO 流量入口，差异化最低风险，不做没入口 |
| 2 | URL/PDF auto-extract | ~8-12h | **PENDING (cherry-pick)** | 强差异化，但取决于 LLM API 成本结构 |
| 3 | AI 引用监测 (Perplexity/ChatGPT/Gemini/AI Overviews) | ~10-15h | **PENDING (cherry-pick)** | C 路核心商业假设，必须等 outside voice 审完再定 |
| 4 | Schema 健康监控 + dashboard | ~6-10h | **PENDING (cherry-pick)** | 留存机制，依赖 #3 决策 |
| 5 | AI 友好度评分 | ~4-6h | **PENDING (cherry-pick)** | 锚点产品，依赖 #3 决策 |

**当前批准的 scope：仅 #1（生成器矩阵层）。** 其余 4 个模块在下一轮 outside voice 审视 + 商业假设验证后再决定。

---

## 现在就要拍板的 4 个决策（如果 cherry-pick 上层模块）

| # | 决策点 | 选项 | 影响 |
|---|---|---|---|
| 1 | SERP / AI Overviews 数据来源 | SerpAPI / DataForSEO / 自爬 | 月度数据成本（$0 到几百） |
| 2 | Schema validator | 自写 / Schema Markup Validator API / Rich Results Test API | 准确度与维护成本 |
| 3 | AI 引用监测实现路径 | query-and-scrape / Perplexity API / 第三方 GEO 数据 | **核心技术护城河，也是核心风险** |
| 4 | 变现模型 | 免费引流+付费监测 / 全 pay-walled / freemium 双层 | 流量天花板和现金流曲线 |

---

## NOT in Scope (本轮明确不做)

- 单点 FAQ schema 生成器（Approach A）
- 任何不带 GEO/AEO 叙事框架的 schema 工具
- 上轮 shortlist 的其他方向（mii creator online、square face generator）——本仓库聚焦 schema 平台，其他方向另立项目

---

## TODOS / 下一步

1. **下一轮 outside voice 审视**（codex / 独立 agent）：核心 challenge "用户会为监测 AI 引用付费吗"
2. 关键词数据补齐（上轮审稿要求未完成）：搜索量 / 趋势 / KD / CPC / SERP 前 10 结构 / 点击空间
3. 生成器矩阵层（#1）的具体 schema 类型清单 + 优先级
4. SERP / AI Overviews 数据来源选型（SerpAPI vs DataForSEO vs 自爬）
5. MVP 部署路径（域名 / 静态站 / 函数后端 / 支付）

---

## Reviewer Concerns (待 outside voice 验证)

1. **C 路最大未验证假设**：现成 SEO 工具栈（Ahrefs / Semrush / Sistrix）是否已经在路线图里加 AI 引用监测？如果是，独立工具的窗口可能更窄。
2. **数据成本估算缺失**：监测 N 个域名在 4 个 AI 平台的引用情况，按周扫描，月度 LLM/SerpAPI 成本未估。
3. **目标人群的支付意愿密度未验证**：是 SEO 从业者（密度高、单价中）还是 AI-native 内容创作者（密度低、单价高）？

---

## Sources

- [Google Search Central: Changes to HowTo and FAQ rich results (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Search Engine Journal: Google Downgrades FAQ Rich Results](https://www.searchenginejournal.com/google-downgrades-visibility-of-howto-and-faq-rich-results/493522/)
- [DigitalApplied: Schema Markup After March 2026](https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies)
- [GreenSerp: Stop Using FAQ Schema (2026)](https://greenserp.com/high-impact-schema-seo-guide/)
- [Frase.io: Are FAQ Schemas Important for AI Search, GEO & AEO?](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [EngageCoders: Google Structured Data Update 2026](https://www.engagecoders.com/google-retires-7-structured-data-features-to-streamline-search-results/)
- [Marcitors: FAQ Schema Generator (AI & Voice Search Ready)](https://marcitors.com/free-tools/faq-schema-generator)
