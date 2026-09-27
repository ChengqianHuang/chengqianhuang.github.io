---
title: 基于 DSH 构建个人助理
date: 2026-09-26
author: ZCode
---

我给 [DeepSeek Harness（DSH）](https://github.com/ChengqianHuang/deepseek-harness) 写了一个个人助理插件 [dsh-personal](https://github.com/ChengqianHuang/dsh-personal)：用自然语言记录和查询电影、项目日志、任务、博客、网站、想法和每日记录，全部落在一个插件自有的 SQLite 文件里。设计原则只有一条：**SQLite 是唯一事实来源，LLM 只负责理解、分类和总结，永远不碰 SQL**。重启进程、换一个会话，答案仍然从数据库里查出来，而不是从聊天记忆里来。

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
| 记录/修改（11） | `record_movie` `create_project` `record_project_log` `create_task` `update_task` `complete_task` `create_blog_post` `update_blog_post` `create_idea` `record_daily_log` `register_website` |
| 查询（6） | `query_movies` `query_tasks` `query_project_logs` `query_blog_posts` `query_websites` `search_personal_data` |
| 回顾（2） | `generate_daily_review` `generate_weekly_review` |

刻意**不提供** `execute_sql` 这类通用入口——模型永远通过语义化工具表达意图，参数 schema 就是它和数据库之间唯一边界。

服务层是一个 Cordis `Service` 基类子类，以 `ctx.personal` 暴露。`inject = ['tools']` 让框架在工具注册表就绪后才实例化它；构造完成后 `[Service.init]` 依次：打开数据库 → 跑 migration → 注册 19 个工具 → 挂一个关闭句柄的 disposer。所有注册都是 effect，插件卸载时工具自动注销、连接自动关闭，有测试专门验证"卸载后 `ctx.tools` 里查不到、数据库文件可被独立打开"。

## 三、数据模型：STRICT 表、CHECK 和一次真实的 migration

九张表全部用 SQLite 的 `STRICT`，让类型在存储层就不可协商；状态类字段加 `CHECK` 枚举，标签列 `CHECK json_valid`：

```sql
CREATE TABLE movies (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  watched_at TEXT NOT NULL,
  rating     REAL CHECK (rating IS NULL OR (rating >= 0 AND rating <= 10)),
  note       TEXT NOT NULL DEFAULT '',
  tags       TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
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
  ...
) STRICT;
```

跨对象链接刻意只存一份：task→project、task→website 存在 `tasks` 的外键列，blog/idea→project 存在各自列。第一版曾经把这些链接**同时**镜像进一张 `relations` 表——写完发现全仓库没有任何代码读它，同一个事实存了两处。第二版删掉了镜像写入，`relations` 表保留、只服务显式的 `linkObjects` 调用。这是"先让数据写对，再考虑通用性"的一次具体兑现。

### migration：版本号 + 事务 + 真实重建

打开数据库的顺序是固定的：以仅属主权限建目录和文件 → 核对 `PRAGMA application_id`（`PERS` 指纹，拒绝把个人表写进别人的库）→ WAL / 外键 / busy_timeout → 按 `PRAGMA user_version` 跑 migration。

每个 migration 在同一事务里执行 DDL 和版本号盖章，失败整体回滚到上一版。migration 2 是一个真实的升级案例：评分最初是 `INTEGER`，真实使用里"7.5 分"被截成整数——但 SQLite 不能原地改列类型，只能重建：

```sql
CREATE TABLE movies_v2 ( ... rating REAL CHECK (...) ... ) STRICT;
INSERT INTO movies_v2 SELECT id, title, watched_at, rating, ... FROM movies;
DROP TABLE movies;
ALTER TABLE movies_v2 RENAME TO movies;
CREATE INDEX movies_watched_at ON movies (watched_at);
```

整个重建包在事务里，中断回滚到 v1，下次启动重试。测试里专门造了一个 v1 库验证升级：旧整数行无损迁移，之后 7.5 原样写入读出。

## 四、服务层：await 边界就是事务边界

服务方法的结构被刻意统一成两段：

```ts
async recordProjectLog(input) {
  const bundle = await this.ready()        // ← 唯一的 await
  return withTransaction(bundle.db, () => { // ← 之内全同步
    const project = this.findProjectIn(bundle, input.project)
      ?? this.createProjectIn(bundle, { name: input.project })
    const id = mintId('plog')
    bundle.projectLogs.insert({ id, projectId: project.id, /* … */ })
    bundle.projects.touch(project.id)
    return { project, log: requireRow(bundle.projectLogs.get(id), '…') }
  })
}
```

为什么要这样切？node:sqlite 是同步驱动，单进程内两条语句之间唯一可能插入其他操作的位置就是 `await`。第一版在"查项目"和"建项目"之间各挂了一个 await，写库序列就可能被并发的工具调用交错。第二版把规则定死：**await 只出现在 `ready()` 上，其后到事务提交之间是纯同步代码**，进程内不再有交错点；`BEGIN IMMEDIATE` 再把跨进程写入者（比如同时开着 web 和 headless 两个实例）挡在写锁外面。`withTransaction` 里回调一抛异常就 `ROLLBACK`，"建了项目但没写日志"这种半成品状态不可能落盘。

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
2. **输出 schema**：执行返回的规范值先过 schema 再渲染，`record_project_log` 现在回显解析后的项目行——模型能看到"Forge"被归一到了哪条记录；
3. **描述即行为契约**：工具描述是模型可见的提示词，容易误用的边界都写在描述里——

- "想研究一下 AST 解析器"（无行动承诺）→ `create_idea`；"明天研究 AST"（有行动和期限）→ `create_task`；
- `record_daily_log` 只在用户明确要求记日记时调用，一条消息里报了几件事就分别写入各自的结构化工具，**不要**顺带生成一篇日记摘要——这是真实使用里踩出来的误触发。

查询工具的返回也是同一套纪律：记录工具返回完整行（模型需要 id 做后续更新），查询工具返回行列表加计数，render 把行渲染成一行人类可读文本。事实永远来自 SQL 结果，模型只做叙述。

## 七、查询与回顾：确定性的部分用确定性实现

Store 层用预编译语句缓存（按 SQL 文本缓存 `StatementSync`），查询一律绑定参数；用户文本进 `LIKE` 前转义 `%`、`_` 和反斜杠；标签过滤不用字符串包含，而是 `json_each` 精确匹配：

```sql
SELECT * FROM movies
WHERE watched_at >= ? AND watched_at <= ?
  AND EXISTS (SELECT 1 FROM json_each(tags) WHERE json_each.value = ? COLLATE NOCASE)
ORDER BY watched_at DESC LIMIT ?
```

回顾工具是这套原则的集中体现：`generate_daily_review` 把当天项目日志按项目归组，连同当日完成的任务、仍然未完的任务、看过的电影、创建的博客和想法、有未完成任务的网站、保存的日记——全部从 SQL 查出来组装成事实包，渲染成分节文本。模型拿到的是事实清单，它的工作是叙述，不是回忆。周报同理，外加从本周日志反推活跃项目。

`search_personal_data` 是唯一的跨类型入口：把转义后的子串分派给八个 Store 各自查（title/note/content/summary/domain…），窗口按各自的时间列比对，结果按类型分组返回。它是子串匹配，不是检索引擎——这是刻意的边界。

## 八、验证：怎么证明答案来自 SQLite

测试分四层，全部跑真实 SQLite 临时文件，不 mock 存储：

- **迁移**：全新建库、重开不动、外来库拒绝、新版本库拒绝、v1→v2 升级保数据、migration 中途失败回滚；
- **Store/Service**：每张表的约束与过滤、事务回滚（回调抛异常后零残留）、打开失败后的重试、大小写归一、未知引用报错；
- **Loader 组合**：真实 cordis.yml 引导，验证 19 个工具注册、卸载后注销、数据库句柄释放（卸载后能立刻重新打开同一文件）；
- **真实 Provider E2E**：起真实的 headless 进程发自然语言——"今天看了《灵媒》，7 分"后直接查 SQLite 断言行存在；"我最近看了什么电影"后检查 session log 里有 `query_movies` 调用；然后**杀掉进程、保留数据库、新起一个会话**再问同样的问题——新会话没有聊天记忆，仍然调用查询工具并读出旧记录，这才证明答案来自磁盘而不是上下文。

架构审查版的四类真实输入也进了 E2E：小数评分按原值入库、"想研究 X"进 ideas 而不是 tasks、周末任务落在约定窗口、批量记录不产生日记。

## 九、安装与配置

```sh
pnpm dsh plugin --profile web add /path/to/dsh-personal
pnpm dsh web
```

然后直接说话：「今天看了《灵媒》，7.5 分」「Forge 今天定位了中文错位问题」「周末检查博客 HTTPS 证书」「我有哪些事情没做？」「本周回顾」。配置只有四项：`databasePath`（默认 `~/.dsh/personal/personal.db`）、`timezone`、`enableDailyReview`、`enableWeeklyReview`。

刻意不做的：向量检索、知识图谱、多 Agent、自动定时回顾、多用户隔离。这是一个人的结构化记忆，不是第二个任务系统——每一层都保持能被一个读懂 SQL 的人直接审计。

源码：[github.com/ChengqianHuang/dsh-personal](https://github.com/ChengqianHuang/dsh-personal)，设计决策的完整记录在仓库的 [DESIGN.md](https://github.com/ChengqianHuang/dsh-personal/blob/main/DESIGN.md)。
