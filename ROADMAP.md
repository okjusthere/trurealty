# Tru Realty → Kevv Integration Roadmap

## 项目定位

这个项目的最终目标不是一个独立的经纪公司官网，而是 **Kevv AI CRM 的 Sites 模块原型**。
当前以 Tru International Realty Corp 为第一个客户验证，之后抽象为多租户 SaaS。

---

## Phase 1 — 独立官网 ✅ 已完成

单租户 Payload CMS 网站，替代 iHouseWeb ($150-400/月)。

- [x] Next.js 15 + Payload CMS 3 + SQLite + Tailwind CSS 4
- [x] 7 个 Payload Collections (Agents, Listings, NewDevelopments, Pages, Testimonials, Media, Inquiries)
- [x] 1 个 Global (CompanyInfo)
- [x] 12 个前端页面 (首页、经纪人、房源、新楼盘、联系、博客、Home Value)
- [x] Home Value 卖家 Lead 捕获工具
- [x] Payload Admin 后台 (/admin)
- [x] 种子数据：16 经纪人、9 新楼盘、5 房源、7 博客

**待补充（非阻塞）：**
- [ ] 上传真实经纪人头像和楼盘照片
- [ ] About Us 独立页面
- [ ] Privacy Policy / Terms 页面
- [ ] 部署到 Vercel + 绑定域名

---

## Phase 2 — Kevv CRM 对接

### 2A: 表单 → Kevv Lead（优先级最高）

**目标：** 网站上所有联系表单和 Home Value 表单提交后，自动在 Kevv 中创建 Lead。

```
网站表单提交
  → 调用 Kevv API: POST /api/leads
  → Kevv AI 5 秒内自动短信/邮件响应
  → Lead 分配给对应经纪人
```

**需要做的：**
- [ ] Kevv 暴露 Lead 创建 API（public endpoint，带 API key 鉴权）
- [ ] 新建 `/api/inquiries` Server Action，提交到 Kevv
- [ ] ContactForm 和 HomeValue 表单对接 Server Action
- [ ] Lead 来源标记（website-contact / website-home-value / website-listing）
- [ ] 可选：Inquiries Collection 存一份本地副本（备份）

### 2B: Agent 数据同步

**目标：** Kevv CRM 中的 Agent 数据和网站的 Agents Collection 保持同步。

**两个方向考虑：**
- **方案 1（简单）：** Kevv 是数据源，网站定时拉取 → 适合 Agent 数据主要在 Kevv 管理的场景
- **方案 2（双向）：** Webhook 双向同步 → 复杂但灵活

**推荐方案 1：**
- [ ] Kevv API: GET /api/agents（按 brokerage 过滤）
- [ ] 网站 Cron Job / ISR：每小时同步一次 Agent 数据到 Payload
- [ ] 或者：去掉网站的 Agents Collection，直接从 Kevv API 读取渲染

### 2C: Listing 管理增强

- [ ] 支持从 MLS 自动同步本公司 Listing（对接 SimplyRETS / Trestle API）
- [ ] 或者：Kevv 侧管理 Listing，网站从 Kevv 读取
- [ ] Listing 状态变更自动更新网站（Active → Pending → Sold）

---

## Phase 3 — 多租户改造

**目标：** 一套代码服务 N 个经纪公司，每个公司有独立域名和品牌。

### 技术方案

```
请求流程：
www.trurealtycorp.com → Vercel Edge Middleware
  → 识别域名 → 查找 tenant (brokerage_id)
  → 注入 tenant context
  → 同一套 Next.js 代码，渲染该公司的数据
```

**需要做的：**
- [ ] 添加 Payload 多租户插件（@payloadcms/plugin-multi-tenant）
- [ ] 所有 Collection 加 `tenant` 字段
- [ ] Next.js Middleware 根据域名识别租户
- [ ] 自定义域名管理（Vercel API 自动添加域名 + SSL）
- [ ] 子域名方案：{company}.kevvsites.com（免费默认）
- [ ] 自定义域名：www.{company}.com（CNAME 指向 Vercel）
- [ ] 模板系统：3-5 套可选模板，每个租户选一套
- [ ] 品牌设置：Logo、主色调、字体（存在 CompanyInfo Global 中）

### 数据隔离

```sql
-- 所有表加 tenant_id
agents: tenant_id → brokerage A 只能看到自己的经纪人
listings: tenant_id → brokerage B 只能看到自己的房源
...
```

---

## Phase 4 — Kevv Sites 产品化

**目标：** 作为 Kevv 的增值模块销售给经纪公司。

### 产品定价

```
Kevv Starter ($29/agent/月) — 已有
├── AI CRM + 自动跟进
├── 无网站
└── 适合：已有网站的经纪人

Kevv Pro ($49/agent/月) — 新增
├── AI CRM + 自动跟进
├── 经纪人个人页（yourname.kevvsites.com）
├── Lead 表单 → Kevv AI 跟进
└── 适合：想要个人品牌页的经纪人

Kevv Brokerage ($249 基础 + $19/agent/月) — 新增
├── 公司官网（自定义域名）
├── 经纪人目录 + 个人页（自动生成）
├── Listing 管理
├── New Development 展示
├── Home Value Lead 捕获
├── 博客 / 社区页面
├── 所有表单 → Kevv AI 跟进
└── 适合：经纪公司

Kevv Enterprise — 大型经纪公司
├── 白标完全定制
├── MLS Listing 自动同步
├── API 对接
└── 多办公室支持
```

### 竞品对比定位

```
              网站功能  CRM   AI 跟进  月费
iHouseWeb     ████████  ██░░  ░░░░░░  $150-400
Real Geeks    ████████  ████  ░░░░░░  $249
kvCORE        ██████░░  ██████ ████░░  $500+

Kevv:         ████░░░░  ██████ ████████ $49-79
              ↑轻量够用  ↑强    ↑最强    ↑最便宜
```

---

## Phase 5 — 高级功能（长远）

这些功能优先级低，等前面 Phase 验证后再考虑：

- [ ] Google Places API 地址自动补全（Home Value 页面）
- [ ] 对接房产估值 API（HouseCanary / ATTOM）展示真实估值
- [ ] 市场报告自动生成（Monthly Market Report 邮件）
- [ ] 社交媒体内容 AI 生成（Listing 自动生成 Instagram 帖子）
- [ ] 中英双语完整支持（i18n）
- [ ] Google Analytics / Facebook Pixel 集成
- [ ] SEO 优化：sitemap.xml, robots.txt, JSON-LD structured data
- [ ] 经纪人个人子域名（david-chen.kevvsites.com）

---

## 关键决策记录

### 不做 IDX 搜索

**原因：** 买家搜房去 Zillow（96% 买家用线上工具，但都去 Zillow/Realtor.com），经纪公司 IDX 网站转化率 <1%，跟 Zillow 展示的房源完全一样，没有差异化。MLS 接入审批复杂、成本高、维护重。

### 不做客户登录体系

**原因：** 客户来官网是为了了解公司和联系经纪人，不是注册账号。强制注册只会增加摩擦减少 Lead。用"价值交换"（免费 CMA 报告 → 留联系方式）替代强制注册，Lead 质量更高。Agent 登录直接用 Kevv 账号。

### CMS 选择 Payload CMS

**原因：** Next.js 原生（同一个应用内，零网络开销）、多租户官方插件、自托管数据完全自有、TypeScript 100%、以后跟 Kevv 融合最容易（同 Node.js/Next.js 生态）。

### 网站是 CRM 数据的"投影"

**核心理念：** 经纪公司不需要"维护网站"。他们在 Kevv/Payload 后台管理业务数据（经纪人、房源、楼盘），网站自动从数据库读取渲染。数据变了，网站自动变。一个后台管一切。
