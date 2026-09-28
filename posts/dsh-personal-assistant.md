---
title: 基于 DSH 构建个人助理
date: 2026-09-26
author: ZCode
---

我给 [DeepSeek Harness（DSH）](https://github.com/ChengqianHuang/deepseek-harness) 写了一个个人助理插件 [dsh-personal](https://github.com/ChengqianHuang/dsh-personal)：用自然语言记录和查询经历、项目日志、任务、博客、网站、想法和每日记录，全部落在一个插件自有的 SQLite 文件里。SQLite 保存事实，模型负责理解输入、选择工具和组织回答。重启进程、换一个会话，仍能从数据库查出之前的记录。

这篇文章沿着"一次写入 → 一次查询 → 一次重启"的路径，把插件的每一层实现讲清楚：bundle 如何挂进 DSH、数据模型怎么定、事务边界画在哪里、日期为什么由程序算、以及怎么验证模型真的在查库。

## 一、形态选择：为什么是仓库外的 bundle

DSH 是全插件架构，官方文档给了两条插件路径：

- **仓库内包**：给 DSH 团队自己用的，要进 `packages/`、注册进目录生成器、过覆盖率门禁——那是修改 DSH 仓库本身的路线；
- **用户 bundle**：[`docs/user/develop`](https://github.com/ChengqianHuang/deepseek-harness/tree/master/docs/user/develop) 教的路线，插件是仓库外的独立 npm 包，在 `package.json` 里声明 `dsh.bundle` 清单，用 `dsh plugin --profile web add ./dsh-personal` 链接进 profile。

个人插件选后者，DSH 仓库**零修改**：

```json
{
  "name": "dsh-personal",
  "main": "lib/index.mjs",
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

`cordis.patch.yml` 声明这个 bundle 贡献什么——一行插件插入：

```yaml
- insert:
    - id: personal
      name: dsh-personal
```

`dsh plugin add` 会把包链接进 profile 目录并自动把 bundle 追加进 `dsh.profile.bundles`；`dsh --profile web --dump-config` 能看到 `# == dsh-personal` 这一层被叠在 `dsh-base`、`dsh-web-app` 之上。层与层之间按行 id 覆盖，后层赢——所以用户可以在自己的 patch 层里改我的配置（比如时区），不用碰插件代码。

## 二、架构分层：工具薄、服务厚、存储专用

调用链固定为四层，每层职责不越界：

```text
用户输入
  → Agent（模型选工具、填参数）        ← LLM 只在这里
    → tools/（19 个薄适配器）          ← 参数 schema 校验 + 结果渲染
      → PersonalService（ctx.personal）← 业务规则、名称解析、日期归一、事务
        → store/（领域 Store）         ← 预编译 SQL、行映射
          → SQLite（node:sqlite）
```

19 个工具分三组：

| 组 | 工具 |
|---|---|
| 记录/修改（11） | `record_experience` `create_project` `record_project_log` `create_task` `update_task` `complete_task` `create_blog_post` `update_blog_post` `create_idea` `record_daily_log` `register_website` |
| 查询（6） | `query_experiences` `query_tasks` `query_project_logs` `query_blog_posts` `query_websites` `search_personal_data` |
| 回顾（2） | `generate_daily_review` `generate_weekly_review` |

刻意**不提供** `execute_sql` 这类通用入口——模型永远通过语义化工具表达意图，参数 schema 就是它和数据库之间唯一边界。

服务层是一个 Cordis `Service` 基类子类，以 `ctx.personal` 暴露。`inject = ['tools']` 让框架在工具注册表就绪后才实例化它；构造完成后 `[Service.init]` 依次：打开数据库并检查 schema 版本 → 注册 19 个工具 → 挂一个关闭句柄的 disposer。所有注册都是 effect，插件卸载时工具自动注销、连接自动关闭，有测试专门验证“卸载后 `ctx.tools` 里查不到、数据库文件可被独立打开”。

## 三、数据模型：用一张表记录不同的经历

九张表全部用 SQLite 的 `STRICT`，让类型在存储层就不可协商；状态类字段加 `CHECK` 枚举，标签列 `CHECK json_valid`：

```sql
CREATE TABLE experiences (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL CHECK (length(trim(category)) > 0),
  action      TEXT NOT NULL CHECK (length(trim(action)) > 0),
  title       TEXT NOT NULL CHECK (length(trim(title)) > 0),
  occurred_on TEXT NOT NULL,
  rating      REAL CHECK (rating IS NULL OR (rating >= 0 AND rating <= 10)),
  note        TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags)),
  created_at  TEXT NOT NULL
) STRICT;

CREATE TABLE tasks (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('TODO','DOING','DONE','CANCELLED')),
  priority    TEXT NOT NULL CHECK (priority IN ('LOW','MEDIUM','HIGH')),
  due_at      TEXT,
  done_at     TEXT,
  project_id  TEXT REFERENCES projects (id),
  website_id  TEXT REFERENCES websites (id),
  source_type TEXT,
  source_id   TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
) STRICT;
```

`record_experience` 接收开放的 `category` 和 `action`：看电影是 `movie/watched`，读书是 `book/read`，听专辑是 `album/listened`，看展览是 `exhibition/visited`。它们进入同一张表，新增类别不必加工具或表。服务拒绝空类别、空动作、空标题和未来日期；日期没给时按配置时区取今天。评分必须是 0 到 10 的有限数，小数可以原样保存。Store 在写入和查询时都把类别与动作去首尾空白、转小写并折叠内部空白。

已经发生的经历与计划中的活动分开：说“今天看了《灵媒》，7.5 分”会写经历；说“下周末看《沙丘 3》”会建任务。`record_experience` 的工具描述给模型说明了这条规则，Service 也拒绝把未来日期写进经历表。

跨对象链接只存一份：task→project、task→website 存在 `tasks` 的外键列，blog/idea→project 存在各自列。`relations` 表保留给显式的 `linkObjects` 调用，不镜像这些外键。

### schema 版本：新库建表，旧库明确拒绝

打开数据库的顺序是固定的：以仅属主权限建目录和文件 → 核对 `PRAGMA application_id`（`PERS` 指纹，拒绝把个人表写进别人的库）→ WAL / 外键 / busy_timeout → 检查 `PRAGMA user_version`。

当前 schema 版本是 **4**。空库在一个事务中创建九张表并写入版本号；失败则回滚，下一次启动可以重试。旧 v1–v3 库不会自动迁移或删除，打开时会报出版本不兼容。如果不需要旧数据，手动移走或删除旧 `personal.db` 后重启即可。数据库保存个人记录，不包含 DSH 的会话或 Agent 运行状态。

## 四、服务层：await 边界就是事务边界

服务方法的结构被刻意统一成两段：

```ts
async recordProjectLog(input) {
  const bundle = await this.ready()        // ← 唯一的 await
  return withTransaction(bundle.db, () => { // ← 之内全同步
    const existing = this.findProjectIn(bundle, input.project)
    const project = existing
      ?? this.createProjectIn(bundle, { name: input.project })
    const id = mintId('plog')
    bundle.projectLogs.insert({ id, projectId: project.id, /* … */ })
    bundle.projects.touch(project.id)
    return {
      project,
      log: requireRow(bundle.projectLogs.get(id), '…'),
      projectCreated: existing === undefined,
    }
  })
}
```

这里使用同步的 `node:sqlite`。`recordProjectLog()` 在 `ready()` 后把查项目、必要时建项目、写日志、更新项目放进一个同步事务；进程内不会在这些语句之间因 `await` 交错。`BEGIN IMMEDIATE` 让跨进程写入遵守 SQLite 写锁；回调抛错就 `ROLLBACK`，不会留下只有项目、没有日志的半成品。`projectCreated` 在同一事务里计算，避免另做一次查询时与并发写入的结果不一致。

`ready()` 本身也处理了一个生命周期陷阱：打开失败时清除共享的打开尝试，下一次调用带着新错误重试，而不是永远重放缓存的 rejection。服务卸载后置 disposed 标记，任何操作直接拒绝——一个 fiber 生命周期只有一次开合，重载插件就是新实例。

## 五、日期系统：模型识别词语，程序计算日期

LLM 不该心算日历。"下周检查证书"里的"下周"由模型映射成 `due_in` 枚举，具体日期由服务算：

```ts
export function dueDateOn(dueIn: DueIn, today: string): string {
  switch (dueIn) {
    case 'today':        return today
    case 'tomorrow':     return addDays(today, 1)
    case 'this-week':    return weekRangeOf(today).to      // 周日
    case 'next-week':    return addDays(weekRangeOf(today).from, 7)
    case 'this-weekend': return weekendSaturdayOf(today)   // 周六
    case 'next-weekend': return addDays(weekendSaturdayOf(today), 7)
    case 'this-month':   return monthRangeOf(today).to
    case 'next-month':   return nextMonthOf(today)
  }
}
```

这是纯函数——每个分桶都能用固定锚点测试（2026-09-26 是周六：周三→09-26、周六→今天、周日→今天、`next-weekend`→10-03）。"周末截止"约定为**周六**：任务应当在进入周末时已完成；锚点本身落在周末（周六或周日）时回退为今天，保证截止日永不落在过去。

两个容易漏的细节：所有"今天"都从配置时区用 `Intl` 算出，不假设进程时区；ISO 校验不是正则过了就算，还要经过 UTC 往返比对——`2026-02-30` 这种 `Date` 会静默滚动的日期直接拒绝。用户显式给出的 `YYYY-MM-DD`（`due_at`）优先于枚举，模型只负责识别词语。

## 六、工具契约：schema 挡住参数，描述挡住误用

每个工具经 `defineTool` 定义，三道关口：

1. **参数 schema**（DSH 的 DSL，编译成 JSON Schema）：模型填错类型、漏必填项、填进枚举之外的值，会在进入业务代码前被 `ToolArgsError` 挡下，错误文本原样回到模型让它重试；
2. **输出 schema**：执行返回的值先过 schema 再渲染；`record_experience` 返回保存后的经历行，`record_project_log` 返回日志行和 `projectCreated`，模型能据此确认写入结果；
3. **描述即行为契约**：工具描述是模型可见的提示词，容易误用的边界都写在描述里——

- "想研究一下 AST 解析器"（无行动承诺）→ `create_idea`；"明天研究 AST"（有行动和期限）→ `create_task`；
- `record_daily_log` 只在用户明确要求记日记时调用，一条消息里报了几件事就分别写入各自的结构化工具，**不要**顺带生成一篇日记摘要——这是真实使用里踩出来的误触发。

查询工具的返回也是同一套纪律：记录工具返回完整行（模型需要 id 做后续更新），专用查询工具返回行列表加计数。跨类型搜索返回分词结果和按相关性排列的命中列表，每条命中包含类型、分数和完整记录；render 同时给出摘要和记录 JSON，让模型能读到命中的正文，也能拿到后续操作所需的 id。事实来自 SQLite，模型负责组织回答。

## 七、查询与回顾：结构化筛选与关键词检索

“最近看了什么电影”和“找一下博客证书的记录”需要两种查询方式。前者知道记录类别，按字段筛选就够了；后者只知道主题，需要跨记录类型找关键词。

### 按字段筛选

Store 层缓存预编译语句，查询绑定参数；标签过滤用 `json_each` 精确匹配：

```sql
SELECT * FROM experiences
WHERE category = ? AND occurred_on >= ? AND occurred_on <= ?
  AND EXISTS (SELECT 1 FROM json_each(tags) WHERE json_each.value = ? COLLATE NOCASE)
ORDER BY occurred_on DESC, id DESC LIMIT ?
```

问“最近看了什么电影”时，Agent 调用 `query_experiences`，用 `category: movie` 和日期窗口筛选。还可以组合 `action` 和标签；默认最多 20 条，上限 200 条。不带 `text` 时按日期倒序返回。类别和动作先按写入规则规范化，再精确匹配：`Movie` 能查到 `movie`，`movies` 不会被猜成 `movie`。

### 中文分词与相关性排序

`search_personal_data` 使用 `jieba-wasm` 做中文分词，再用 SQLite FTS5 检索。索引覆盖经历、项目、项目日志、任务、博客、网站、想法和每日记录八类对象；标题、标签、备注和正文等可搜索字段按各自类型提取。例如任务“检查博客的 HTTPS 证书”，可以用“博客证书”找到，不要求这四个字在原文里连续出现。

写入索引时使用 Jieba 的搜索分词，保留中文复合词的子词；查询时使用普通分词。文本先做 NFKC 规范化和小写转换，再提取词语和数字。每个查询词都作为字面值进入 FTS 表达式，用户输入中的 `OR` 等文字不会被当成检索操作符。

模型从问题中提取主题关键词放进 `text`，把日期和对象类型分别放进窗口参数与 `types`。默认 `match: all` 要求命中全部关键词；`match: any` 允许命中其中一个词，适合扩大查询范围。`query_experiences` 的 `text` 也使用同一引擎，并可同时叠加类别、动作、日期和精确标签过滤。

结果按 BM25 相关性跨类型统一排序，默认标题权重 5、标签权重 3、正文权重 1。标题字段也包含项目名称、网站名称和域名。分数只在当前查询内可比；同分时按日期倒序、类型和 id 排列。`limit` 是所有类型合计的条数，默认 20，上限 200。日期过滤对经历、项目日志和每日记录使用发生日期，对其他类型使用创建日期。

### 索引从 SQLite 记录重建

搜索索引存在于当前连接的内存 TEMP 表里，持久化的九张表和 schema v4 保持不变，现有 v4 数据无需迁移。

首次搜索从已有记录建立索引。本连接的新增、修改和删除由 TEMP trigger 在同一事务中同步，写入回滚时索引也回滚。其他连接提交变更后，通过 `PRAGMA data_version` 检测；下一次搜索在同一个读取事务中重建并检索，避免结果混用不同时间的记录。关闭连接会释放索引，重启后重新从数据库建立。

代价是内存里保留一份检索内容和完整记录，首次搜索以及其他连接提交后的搜索需要扫描现有数据。目前个人记录规模适合这个实现；数据量变大或跨进程写入频繁时，索引重建的耗时需要重新评估。

这仍是词法检索：不保证任意字符片段命中，也不自动处理同义词。“看展”和“参观展览”可能需要模型换关键词再查，没有向量语义检索。

### 回顾读取结构化事实

`generate_daily_review` 把当天项目日志按项目归组，连同当日完成的任务、仍然未完的任务、当天的经历、创建的博客和想法、有未完成任务的网站、保存的日记，从 SQL 组装成事实包并渲染成分节文本。周报读取本周经历，并从本周日志找出活跃项目。模型拿到事实清单，再据此写叙述。

## 八、验证：怎么证明答案来自 SQLite

存储和检索测试使用真实 SQLite，不 mock 数据库：

- **schema**：全新建库、重开不动、外来库拒绝、旧 v1–v3 库拒绝、新版本库拒绝、建表中途失败回滚；
- **Store/Service**：每张表的约束与过滤、事务回滚（回调抛异常后零残留）、打开失败后的重试、大小写归一、未知引用报错；
- **检索**：覆盖 20 组中英文关键词、全部词与任一词匹配、跨类型排序和总条数限制、日期与标签过滤、完整记录输出；还验证新增、修改、删除、事务回滚、其他连接提交后的同步，以及重建中发生外部提交时的快照一致性和失败重试；
- **Loader 组合**：真实 cordis.yml 引导，验证 19 个工具注册、卸载后注销、数据库句柄释放，以及配置权重确实改变检索排序、非法权重在加载时报错；
- **真实 Provider E2E**：起真实的 headless 进程，输入看电影、读书、听专辑、看展览，以及同一条消息里的项目进展、电影和任务；直接查 SQLite 断言各类行存在，并检查 session log 里调用了 `record_experience`、`record_project_log`、`create_task` 和 `query_experiences`。首次运行结束后，把数据库复制给新进程、新会话，再问电影和书，并跨类型搜索“博客证书”；检查日志里调用了 `query_experiences` 和 `search_personal_data`，返回《灵媒》《失控》和此前保存的“检查博客的 HTTPS 证书”，证明新会话能从磁盘记录恢复检索结果。

E2E 还检查小数评分按原值入库、计划中的电影只写入任务，以及混合消息没有额外生成日记。日期分桶和想法、任务的区分由日期及工具测试覆盖。

本次检索实现通过 82 个测试，TypeScript 类型检查和构建通过；在最低支持版本 Node 22.19 上也运行了这 82 个测试，并验证构建产物能完成中文关键词检索。真实 Provider E2E 通过。

## 九、安装与配置

```sh
pnpm dsh plugin --profile web add /path/to/dsh-personal
pnpm dsh web
```

然后直接说话：「今天看了《灵媒》，7.5 分」「Forge 今天定位了中文错位问题」「周末检查博客 HTTPS 证书」「我有哪些事情没做？」「本周回顾」。基础配置包括 `databasePath`（默认位于 `<DSH_HOME>/personal/personal.db`，通常是 `~/.dsh/personal/personal.db`）、`timezone`、`enableDailyReview` 和 `enableWeeklyReview`。检索另有三个权重配置，可以在插件的 `config` 中调整，均须为正的有限数：

```yaml
searchTitleWeight: 5
searchTagWeight: 3
searchBodyWeight: 1
```

目前实现覆盖单用户的记录、查询和回顾。向量检索、知识图谱、多 Agent、自动定时回顾和多用户隔离尚未实现。

源码：[github.com/ChengqianHuang/dsh-personal](https://github.com/ChengqianHuang/dsh-personal)，设计决策的完整记录在仓库的 [DESIGN.md](https://github.com/ChengqianHuang/dsh-personal/blob/main/DESIGN.md)。
