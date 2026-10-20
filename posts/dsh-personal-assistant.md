---
title: 基于 DSH 构建个人助理
date: 2026-09-26
author: ZCode
updated: 2026-10-20
---

我给 [DeepSeek Harness（DSH）](https://github.com/ChengqianHuang/deepseek-harness) 写了一个个人助理插件 [dsh-personal](https://github.com/ChengqianHuang/dsh-personal)。它把经历、项目日志、任务、博客、网站、想法和每日记录存进 SQLite，通过工具让模型记录、查询、修改和回顾这些数据。换会话后，插件仍可以从同一个数据库查询记录。

例如，我可以告诉它：“今天看了《灵媒》，7.5 分；博客证书下周检查。”这句话会涉及两种记录：已经发生的观影经历，以及尚未完成的任务。之后问“最近看了哪些电影”，用类别和日期筛选；问“博客证书那件事”，用关键词检索；说“刚才评分记错了，改成 8 分”，则需要定位记录、读取当前版本，再修改。

这篇文章解释这些操作如何实现。重点是三个具体问题：记录类别怎样扩展，检索结果怎样与数据库保持一致，以及模型修改旧记录时怎样避免覆盖更新。

**本文于 2026-10-20 更新，对应 dsh-personal 的 [`13b12b6`](https://github.com/ChengqianHuang/dsh-personal/tree/13b12b6ed31a6c99193ece203741fe7a8bdfe588)。** 文中的 DSH 接口和无 key 测试对照 [`49a606b`](https://github.com/ChengqianHuang/deepseek-harness/tree/49a606bc5b5934603f22a26957a07dc799ab0291) 源码。这个组合默认提供 22 个工具、使用 schema v4；它不是对任意后续 DSH 版本的兼容承诺。后文附可下载的实验、实际输出和复现命令。

## 阅读路线

- [一、先分清会话、个人数据与模型输出](#responsibilities)
- [二、把能力装进独立 bundle](#bundle)
- [三、DSH 的工具接口如何接到数据库](#tools)
- [四、数据模型：开放类别，明确记录类型](#data-model)
- [五、同步 SQLite 事务保护什么](#transactions)
- [六、日期是程序规则，也包含产品约定](#dates)
- [七、从子串匹配到中文关键词检索](#retrieval)
- [八、连接私有索引的一致性](#index-consistency)
- [九、读取 revision 后才能修改](#guarded-edits)
- [十、删除时如何处理引用](#deletion)
- [十一、工具结果如何进入模型上下文](#transcript)
- [十二、运行实验与检查证据](#experiments)
- [十三、安装配置与适用范围](#installation)

<a id="responsibilities" style="scroll-margin-top: 120px"></a>

## 一、先分清会话、个人数据与模型输出

DSH 会话日志保存一次 Agent 交互中发生的事情：用户输入、模型响应、工具调用及结果等。个人数据库保存可以跨会话使用的领域记录。两者的寿命和查询方式不同。

如果用户关闭当前会话，“检查博客的 HTTPS 证书”这个任务仍然存在；如果用户删除这个任务，旧会话中曾经返回过它的工具结果，也不会因此改写。插件没有把 SQLite 当成会话日志的另一个存储后端，也没有把全部聊天自动写成个人资料。

职责可以按一次操作分开看：

<div style="overflow-x: auto">

| 环节 | 负责什么 | 不能据此保证什么 |
|---|---|---|
| 模型 | 识别用户意图，选择工具，填写参数，组织最终回答 | 不能保证每次都选对记录类型、对象和日期表达 |
| 工具定义 | 声明参数与返回值，转换命名，渲染结果 | 描述中的自然语言规则不等于程序校验 |
| PersonalService | 业务校验、引用解析、日期计算、事务、revision 比较 | 不替用户判断两个同名记录究竟指哪一个 |
| Store 与 SQLite | 执行 SQL，维护约束与持久记录 | 不验证自然语言陈述是否真实 |
| DSH | 调度工具，把工具结果纳入交互和会话记录 | 工具成功不等于模型最后一句话一定准确 |

</div>

“事实来自 SQLite”在这里有一个具体含义：查询工具从已经保存的行返回内容。它不意味着用户输入经过了外部核实，也不意味着模型无法在最终回答里补出数据库中没有的内容。验证时必须分别检查数据库、工具结果和最终叙述。

<a id="bundle" style="scroll-margin-top: 120px"></a>

## 二、把能力装进独立 bundle

这个插件是 DSH 仓库之外的独立包。它使用 DSH 已有的 bundle 和工具注册能力，不需要修改 Agent Loop。

包清单里的关键部分是：

```json
{
  "name": "dsh-personal",
  "main": "lib/index.mjs",
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

对应的 patch 是：

```yaml
- insert:
    - id: personal
      name: dsh-personal
```

`dsh plugin --profile web add /path/to/dsh-personal` 把这个 bundle 加入指定 profile。启动 profile 时，DSH 组合基础配置与 bundle 的 patch，加载 `lib/index.mjs`。本地链接指向包目录，修改 TypeScript 后仍然需要重新构建这个文件。

这里有两种扩展尺度。增加一本书、一部电影、一场展览的记录，不需要改变 DSH；增加个人数据的检索和修改工具，也通过插件完成。若要改变 Agent 本身如何调度工具，则是 DSH 运行机制的另一层工作。这个项目使用现成接口，把领域规则留在插件里。

### 插件生命周期与资源归属

服务通过 Cordis 声明合并暴露为 `ctx.personal`：

```ts
declare module '@deepseek-ai/cordis' {
  interface Context {
    personal: PersonalService
  }
}
```

`PersonalService` 继承 `Service`，声明 `static inject = ['tools']`。框架在工具服务可用时初始化它。初始化先打开数据库，再注册工具，最后为数据库句柄注册关闭回调。

工具注册由 `ctx.tools.register(tool)` 完成。DSH 的注册方法把贡献纳入当前插件的 effect 生命周期；卸载插件时注销工具。数据库则由这个服务实例关闭，持久文件保留。现有 Loader 组合测试覆盖了真实配置加载、22 个工具出现、卸载后注销和句柄释放，见 [loader-composition.spec.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/tests/loader-composition.spec.ts)。

这类生命周期归属有实际作用：热重载不应留下同名工具或失去引用的数据库连接。另一方面，单看“文件还能重新打开”并不足以证明所有句柄都关闭；测试还需要检查原服务的关闭行为和注册表状态。

<a id="tools" style="scroll-margin-top: 120px"></a>

## 三、DSH 的工具接口如何接到数据库

默认配置下有 22 个工具。关闭日报或周报配置后，对应工具不会注册。

<div style="overflow-x: auto">

| 分组 | 工具 |
|---|---|
| 记录与专用修改，11 个 | `record_experience`、`create_project`、`record_project_log`、`create_task`、`update_task`、`complete_task`、`create_blog_post`、`update_blog_post`、`create_idea`、`record_daily_log`、`register_website` |
| 查询，6 个 | `query_experiences`、`query_tasks`、`query_project_logs`、`query_blog_posts`、`query_websites`、`search_personal_data` |
| 精确读取与通用修改，3 个 | `get_personal_record`、`update_personal_record`、`delete_personal_record` |
| 回顾，2 个 | `generate_daily_review`、`generate_weekly_review` |

</div>

这里保留任务完成、博客状态更新等常用入口，同时让八类记录共享一套精确读取、修改和删除机制。电影、书、专辑共用经历工具；SQL 由插件实现持有。

### 3.1 defineTool 声明了哪些东西

DSH 的 [`DefineToolOptions`](https://github.com/ChengqianHuang/deepseek-harness/blob/49a606bc5b5934603f22a26957a07dc799ab0291/packages/core/tools/src/schema.ts#L483) 中，与这里直接有关的成员可摘成下面这段。它省略了呈现和执行策略相关的其他可选成员：

```ts
interface DefineToolOptions<S extends ParameterSchemaSpec, O extends ValueSchemaSpec> {
  readonly name: string
  readonly description: string
  readonly parameters: S
  readonly output: {
    readonly schema: O
    render(args: InferArgs<S>, value: InferValue<NoInfer<O>>): ContentBlock[]
    presentationMeta?(args: InferArgs<S>, value: InferValue<NoInfer<O>>): JsonValue
  }
  isConcurrencySafe?(args: InferArgs<S>): boolean
  execute(args: InferArgs<S>, exec: ToolRunContext): Promise<InferValue<NoInfer<O>>>
  // 其余可选成员见源码。
}
```

插件的实际工具定义采用这个接口。以下是 `record_experience` 的执行部分，保留原实现：

```ts
async execute(args, exec) {
  throwIfAborted(exec.signal)
  const { occurred_on, ...rest } = args
  return {
    experience: await service.recordExperience({
      ...rest,
      ...(occurred_on !== undefined ? { occurredOn: occurred_on } : {}),
    }),
  }
}
```

工具参数使用 `occurred_on`，服务输入使用 `occurredOn`。转换集中在薄适配层，Store 只处理领域行和 SQL。完整定义见 [tools/write.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/tools/write.ts#L44)。

### 3.2 结构校验、业务校验和模型指引各自有效到哪里

`defineTool` 编译参数 schema，并在执行前校验。缺少必填字段、类型不符或枚举越界会抛出 `ToolArgsError`。服务随后检查空标题、非法日历日期、未来经历等业务条件。SQLite 再检查 `STRICT` 类型、`CHECK`、唯一约束和外键。

通用修改工具的 `patch` 则声明为 JSON：不同记录类型可以修改不同字段，类型相关的字段允许列表由业务解析器检查。

<div style="overflow-x: auto">

| 输入问题 | 实际处理位置 |
|---|---|
| `rating` 是字符串，必填 `title` 缺失 | 工具参数 schema |
| `rating: 11`，标题全为空白，`2026-02-30` | Service / 字段解析器，部分规则另有 SQL 约束 |
| 修改 `id`、`createdAt` 或不存在的字段 | `parseRecordPatch` 的字段允许列表 |
| 指向不存在的项目 | 服务精确引用检查与外键 |
| “下周看电影”误选为经历 | 描述引导；如果传入未来日期，服务也拒绝，但不能识别所有自然语言误选 |
| 两条同名电影，用户说“改那条” | 模型应询问；数据库无法替用户消除歧义 |

</div>

工具描述仍然很重要。例如：已发生的事情用经历；有行动承诺的事情用任务；只有想法时用 `create_idea`；只有用户明确要求记日记时才用 `record_daily_log`。这些指令减少误调用，但其效果要通过模型交互验证，不能借用 schema 校验的确定性。

### 3.3 返回值与模型读到的文本是两件事

成功的工具执行先产生 canonical value，DSH 工具运行时校验 `output.schema`，再调用 `output.render()` 生成模型可见的内容。可以在 [`createSuccessResult`](https://github.com/ChengqianHuang/deepseek-harness/blob/49a606bc5b5934603f22a26957a07dc799ab0291/packages/core/tools/src/index.ts#L1784) 看到这个顺序。

这不意味着每个工具都把完整返回对象打印给模型。当前记录工具常用一行摘要并带 id；跨类型搜索会渲染摘要与完整记录 JSON；精确读取工具会输出完整行及 revision。需要做后续修改时，模型必须调用精确读取工具，拿到当前 revision。

这种区分也影响测试：直接调用 `tool.execute()` 能检查参数包装和业务结果；要验证 DSH 的返回值校验、渲染、日志和下一次模型请求，必须走实际注册表或 Agent Loop。

<a id="data-model" style="scroll-margin-top: 120px"></a>

## 四、数据模型：开放类别，明确记录类型

数据分成八类对象和一张显式关系表：`experiences`、`projects`、`project_logs`、`tasks`、`blog_posts`、`websites`、`ideas`、`daily_logs`，以及 `relations`。

为什么把经历统一，而任务和项目仍独立？因为电影、书和展览在这里共享同一组操作：记录做过什么、发生日期、评分、备注和标签。任务却有截止时间、状态和完成日期，项目日志必须归属项目。把这些都塞进“任意 JSON 记忆”，会把规则搬到查询和模型提示中。

### 4.1 经历的 category 与 action 是开放值

经历表定义如下：

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
```

`movie/watched`、`book/read`、`album/listened`、`exhibition/visited` 进入同一张表。新增 `concert/attended` 不需要新表、新工具或 schema 迁移。服务和 Store 对类别、动作去首尾空白、转小写、折叠内部空白；写入和筛选采用相同规则。

开放值也有成本：`Movie` 可以归一成 `movie`，`movies` 不会自动变成 `movie`，中文“电影”也不会自动映射到它。当前工具描述建议小写单数类别，但没有受控词表或别名系统。长期使用需要观察类别是否逐渐分裂，不能把开放性等同于已经解决分类治理。

评分接受 0–10 的有限数，`7.5` 原样保存。经历日期不能在未来。这个规则使“已经看了”和“计划去看”在可检查的日期上分开，至于一句含糊输入到底属于哪类，仍由模型理解。

### 4.2 领域链接只保留一份

任务与项目、网站的关联保存在 `tasks.project_id`、`tasks.website_id`；博客和想法关联项目则在各自的 `related_project_id`。这些列有外键，不再往 `relations` 复制同一条关系。

`relations` 用于显式的类型、id、关系类型链接。`linkObjects` 当前仅供 Service 调用，未注册为模型工具。多态的 `source_type/source_id` 和 `relations` 端点没有普通外键那样的数据库级目标约束，后文会说明删除时如何处理。

### 4.3 SQL 约束不是完整业务规范

九张持久表都使用 `STRICT`。它能拒绝不符合列类型的值，但不会验证任意文本是不是合法日期。`json_valid(tags)` 能验证 JSON 语法，但不能保证它是非空字符串组成的数组。这些更细的规则由 Service 和修改解析器负责。

外部 SQLite 客户端可以读取和写入文件，也必须自行遵守这些规则、启用所需连接选项。插件没有把所有跨表业务规则编码成数据库 trigger。独立可读写是数据可移植性，不是对任意手工写库的正确性承诺。

### 4.4 新库创建与旧格式拒绝

打开数据库时先创建缺失目录和文件，新建时请求仅属主可访问的权限；已有路径的权限不会被这里强制重设。之后检查 `application_id`：空库可以接收 `PERS` 标记，外来标记或没有标记但已经有用户表的库会被拒绝。

通过身份检查后才应用 WAL、外键和 `busy_timeout` 等连接设置，再处理 `user_version`。空库在事务里创建当前 schema 并写版本号；失败回滚，允许下一次重试。当前版本是 4，旧 v1–v3 和更高版本会明确拒绝，不自动删除旧文件，也不执行历史数据迁移。

这里的 `application_id` 只是误用防护，不是身份认证或加密。整个 SQLite 文件保存明文个人数据，文件访问权限仍然重要。

<a id="transactions" style="scroll-margin-top: 120px"></a>

## 五、同步 SQLite 事务保护什么

以记录项目日志为例，用户第一次提到一个项目时，服务会创建项目，再写日志并更新项目时间。这几步必须作为整体提交，否则日志失败后可能残留一个空项目。

下面省略了插入字段，保留原方法的事务结构：

```ts
async recordProjectLog(input) {
  const bundle = await this.ready()
  return withTransaction(bundle.db, () => {
    const existing = this.findProjectIn(bundle, input.project)
    const project = existing
      ?? this.createProjectIn(bundle, { name: input.project })
    const id = mintId('plog')
    bundle.projectLogs.insert({ id, projectId: project.id, /* 其余字段 */ })
    bundle.projects.touch(project.id)
    return {
      project,
      log: requireRow(bundle.projectLogs.get(id), '…'),
      projectCreated: existing === undefined,
    }
  })
}
```

[`withTransaction`](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/store/statements.ts#L123) 执行 `BEGIN IMMEDIATE`、同步回调、`COMMIT`，抛错则 `ROLLBACK`。回调不能 `await`，也不支持嵌套事务。

这里要分清两个保证：同步 `node:sqlite` 调用使同一 JavaScript 线程不会在中间因 `await` 让出执行；事务保证多条 SQL 的原子提交，并用 SQLite 写锁协调其他连接。只有前者时，其他进程仍能在语句之间写库；只有事务但允许任意异步等待时，又会长时间占锁，甚至让同一连接的其他调用误入事务。

`projectCreated` 也在同一事务内根据读取结果决定。不能在插入完成后再独立查询一次，然后猜测这个项目是否由本次调用创建。

这也解释了工具上的 `isConcurrencySafe: () => true`：它允许 DSH 将这些工具放入可重叠的调用组，不代表同一连接会并行执行 SQL。服务在 `ready()` 后的关键操作是同步的，多个连接则由 SQLite 锁和 revision 共同协调。若以后在事务回调内引入网络等待，就不能沿用这个判断而不重新检查。

不过，一条自然语言消息可能触发多个工具。“记录电影并创建任务”仍然是两个独立操作，当前没有覆盖整句消息的事务，也没有写入请求的幂等键。如果第一个工具提交后第二个失败，第一条记录会保留；如果工具已提交而结果没有送达，直接重试创建可能产生重复记录。SQLite 事务解决的是选定 SQL 操作组的原子性。

<a id="dates" style="scroll-margin-top: 120px"></a>

## 六、日期是程序规则，也包含产品约定

“下周检查证书”由模型识别为 `due_in: next-week`，具体日期由服务计算。用户明确给出 `YYYY-MM-DD` 时用 `due_at`；两者同时出现时显式日期优先。专用 `update_task` 也使用这两个名字；通用修改工具 `update_personal_record` 的 patch 则使用 `dueIn`、`dueAt`。

程序处理日历可以避免模型自行计算星期和月末，但还需要明确产品约定：`this-week` 是本周日，`next-week` 是下周一，`this-month` 是本月末，`next-month` 是下月末。这些值不是自然语言唯一正确的解释，工具描述和用户预期需要对齐。

当前 `this-weekend` 取本周六；锚点已经在周末时取当天。以下是固定日期下的实际函数结果：

<div style="overflow-x: auto">

| 锚点 | `this-weekend` | `next-weekend` | `next-week` |
|---|---|---|---|
| 2026-09-23，周三 | 2026-09-26 | 2026-10-03 | 2026-09-28 |
| 2026-09-26，周六 | 2026-09-26 | 2026-10-03 | 2026-09-28 |
| 2026-09-27，周日 | 2026-09-27 | 2026-10-04 | 2026-09-28 |

</div>

最后一行值得直接列出：实现是 `next-weekend = weekendSaturdayOf(today) + 7`，周日分支的基准是当天，因此得到下周日。这个结果与函数说明中的“下周六”不一致，是当前实现中需要修正的一处日期语义。

所有“今天”从配置时区通过 `Intl.DateTimeFormat` 计算。日期校验先检查格式，再经过 UTC 往返验证，拒绝 `2026-02-30` 这种会被 JavaScript 自动滚动到下个月的输入。跨天加减采用日历日期对应的 UTC 值，避免把本地夏令时的一天机械理解成固定本地小时数。

另一个细节是发生日期与创建时间不同：经历、项目日志、每日记录有日期字段，项目和任务等对象则有 UTC ISO 创建时间。跨类型搜索按前者的发生日期或后者创建时间的前十位过滤，并没有把 UTC 创建时间逐条转换成配置时区的当地日期。临近午夜时，两种日期可能不同；调用者需要知道自己问的是“什么时候发生”还是“什么时候录入”。

源码见 [dates.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/dates.ts)。

<a id="retrieval" style="scroll-margin-top: 120px"></a>

## 七、从子串匹配到中文关键词检索

“最近看了什么电影”可以使用结构化筛选：`category: movie` 加日期窗口，按发生日期倒序返回。“找博客证书相关的事情”则需要在任务、日志、文章和想法之间检索。

如果使用 `LIKE '%博客证书%'`，标题“检查博客的 HTTPS 证书”不会命中。把结果按创建时间排列，也无法表达标题命中通常比正文偶然提及更有用。插件因此使用 Jieba 分词与 SQLite FTS5，将八类对象放在同一个检索集合里。

### 7.1 索引分词与查询分词不完全相同

当前实现使用 `jieba-wasm@2.4.0`。文本先 NFKC 规范化，再小写化，最后保留字母和数字组成的 token。入索引使用 `cut_for_search()`，保留中文复合词及子词；查询使用普通 `cut()`，去掉重复词。

核心函数如下，省略类型说明注释：

```ts
export function tokenizeSearch(text: string, indexing = false): string[] {
  const normalized = text.normalize('NFKC').toLowerCase()
  const words = (indexing
    ? cut_for_search(normalized, true)
    : cut(normalized, true)) as string[]
  return words.flatMap(word => word.match(/[\p{L}\p{N}]+/gu) ?? [])
}
```

“博客证书”查询得到 `博客`、`证书`，可以命中两个词不连续出现的标题。FTS5 的 `unicode61` 接收已经分好的文本；它负责建立倒排索引，而不是独自承担中文词语切分。

分词也不是任意子串搜索。一个字是否成为独立 token，取决于分词结果；同义表达不会自动归并。“看展”与“参观展览”仍可能需要重新措辞查询。当前没有向量索引、自动同义词扩展或查询召回率基准，不能把这次改进等同于完整语义检索。

### 7.2 用户输入不能直接成为 FTS 表达式

实现把每个查询 token 包进引号，然后用程序选定的 `AND` 或 `OR` 连接：

```ts
const terms = [...new Set(tokenizeSearch(filter.text))]
const expression = terms.map(term => `"${term}"`)
  .join(filter.match === 'any' ? ' OR ' : ' AND ')
```

默认 `match: all` 要求全部词命中；`match: any` 允许任一词命中。用户输入里的 `OR` 被当成普通单词，不会获得操作符含义。标点处理后没有 token 时返回空结果。实际 SQL 的值仍通过参数绑定传入。

模型需要把主题放进 `text`，时间放进 `from/to/period`，记录类型放进 `types`。把“我上周记录过的关于博客证书的事情”整句当作所有关键词的交集，会不必要地降低召回。没有命中时，模型可以换更短关键词或明确选择 `any`，并向用户说明查询范围变化。

### 7.3 一个索引，一次排序，一个总 limit

八类对象统一投影成 `title`、`tags`、`body` 加元数据。比如网站标题包含名称和域名，博客正文包含摘要与内容，经历正文使用备注。类别、动作和日期用于筛选；经历的 `category/action` 本身没有被放入全文字段，不能指望搜“movie”必然找出全部电影。

FTS5 用 BM25 计算相关性，默认标题、标签、正文权重分别为 5、3、1。权重会影响词频贡献，但标题命中并不在所有语料下绝对胜过正文命中，文档长度和词语在整个索引中的分布也参与计算。

SQL 排序的主体是：

```sql
SELECT object_type, row_json,
       bm25(personal_search_documents, ?, ?, ?) AS score
FROM personal_search_documents
WHERE personal_search_documents MATCH ?
ORDER BY score, occurred_on DESC, object_type, object_id
LIMIT ?
```

SQLite BM25 值越小越相关，插件对外返回 `-score`，所以返回值越大越相关。两者容易在调试时看反。分数只应在同一次查询中比较，不能把两次查询的分数直接拿来判断“哪个事实更可靠”。

`limit` 在八类对象统一排序后应用，默认 20、上限 200。分别查每一类的前 20 条、拼接结果，会得到另一种语义；分别建立索引再比较原始 BM25 分数，也缺少同一个语料统计基础。

当前使用单一 FTS 表，所以按 `types` 筛选结果时，BM25 语料统计仍来自整个索引，而不是只针对筛出的某一类型重新计算。全文返回顺序是相关性，结构化经历查询不带 `text` 时则是日期顺序。标签的精确筛选另用 `json_each`，不把全文分词命中当作标签相等。

源码见 [store/search.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/store/search.ts)。

<a id="index-consistency" style="scroll-margin-top: 120px"></a>

## 八、连接私有索引的一致性

检索不只是分词和排序。修改任务标题之后，旧关键词不能继续返回旧记录；事务回滚后，索引不能留下已经撤销的新内容；别的 SQLite 连接写入后，当前连接也需要发现变化。

这里选择将索引作为连接私有的派生数据：

```text
磁盘上的 schema v4：八类领域记录 + relations
                    │
       打开连接，安装 TEMP FTS5 和 TEMP triggers
                    │
       首次搜索从领域记录填充 / 重建索引
                    │
      本连接变更由 trigger 同步，外部提交使缓存失效
                    │
       关闭连接：TEMP 对象消失，持久记录保留
```

`PRAGMA temp_store = MEMORY` 让这些 TEMP 对象放在内存。索引中保存分词文本、筛选元数据和完整行 JSON；完整行是用于返回结果的未索引列。它没有写进持久 schema，因此增加检索能力没有把 v4 数据库升级成另一个文件格式。

### 8.1 本连接：让索引跟随原事务

打开连接时安装八类表的 TEMP insert、update、delete triggers。触发器调用注册到此连接的分词函数，写入或移除 `personal_search_documents`。

这里不采用“先提交领域记录，再从 JavaScript 更新索引”的顺序。两步之间进程退出或第二步失败，会形成旧索引；回滚路径也要额外补偿。当前 trigger 在领域写入事务中执行，领域记录和索引的变化一同提交或回滚。

即使第一次全文搜索尚未发生，触发器已经安装；首次搜索仍会从主库重建完整索引。这里的“懒初始化”准确说是首次完整填充，FTS 表和触发器本身在打开连接时就存在。

这也有代价：插件连接上的写入会执行分词，分词或索引维护失败能使写入失败。索引虽然可丢弃，当前实现并没有把检索故障隔离成一个不会影响写入的后台服务。

### 8.2 其他连接：检测提交，重新建立投影

TEMP trigger 只属于当前连接，不能同步其他 SQLite 客户端的操作。插件因此读取当前连接的 `PRAGMA main.data_version`：其他连接提交后，这个值变化，使当前索引需要重建。同一连接自己的提交不依靠它检测，已经由 trigger 覆盖。

`data_version` 不是整个数据库共享的业务 revision，也不能跨连接拿数值直接比较。它在这里的用途只是同一连接先后读取时的变化检测。

关键顺序摘录如下，省略查询构造和结果映射：

```ts
this.db.exec('BEGIN')
try {
  this.db.prepare('SELECT id FROM main.experiences LIMIT 1').get()
  const { data_version: version } = this.db
    .prepare('PRAGMA main.data_version').get()
  if (version !== this.dataVersion) {
    this.db.exec('DELETE FROM personal_search_documents')
    for (const projection of this.projections) this.db.exec(projection)
  }
  // 在这个事务里执行 MATCH、排序、limit，并读取 row_json。
  this.db.exec('COMMIT')
  this.dataVersion = version
  // 返回本次查询结果。
} catch (error) {
  this.db.exec('ROLLBACK')
  throw error
}
```

有三处顺序不能随意交换。

第一，`BEGIN` 之后还要读取主库表。延迟读取事务仅执行 `BEGIN` 时还没有固定主库读取快照；读表后，后续重建的八张表使用同一个 WAL 快照。

第二，重建和 MATCH 查询放在同一个读取事务里。否则，即使每张表单独读取都正确，拼起来也可能混合不同提交的记录。完整行 JSON 同样来自这次投影，避免“排序按旧文本、返回正文却是另一版本”的混合结果。

第三，只有 `COMMIT` 成功后，才把 `version` 写入 JavaScript 的 `this.dataVersion`。如果提前标记为已同步，随后重建失败回滚，下一次可能误认为旧索引已经代表新提交。SQLite 能回滚 TEMP 表变化，不能替 JavaScript 回滚一个普通字段。

### 8.3 一个可控的双连接时序

实验让 A 先索引“旧证书”，B 将它改为“新证书”。A 开始下一次搜索并重建时，在分词回调里精确触发 B 再提交“域名续费”。这样不需要依赖随机延时碰撞。

<div style="overflow-x: auto">

| 时刻 | A：搜索连接 | B：写连接 |
|---|---|---|
| 1 | 已有“旧证书”的索引 | 提交“新证书” |
| 2 | BEGIN、读主库，固定“新证书”所在快照 | |
| 3 | 检测变化，开始重建 | 在分词回调期间提交“域名续费” |
| 4 | 本次搜“证书”返回“新证书” | 最新持久值已是“域名续费” |
| 5 | 下次搜索发现外部变化，重新建立索引 | |
| 6 | 搜“证书”无结果，搜“域名”返回“域名续费” | |

</div>

第 4 步允许结果不包含搜索期间新提交的修改。它保证的是一次搜索内部使用一致的读取快照，而不是工具响应时必然包含所有最新提交。后文的实验实际检查了这组输出。

### 8.4 这份一致性需要付出的成本

设记录数为 N，可检索文本和行 JSON 总量为 B。每个打开的连接拥有自己的索引；首次搜索或检测到外部提交后，要扫描 N 条记录、重新分词并写入约 B 大小的派生内容。热查询使用 FTS 倒排索引，但持续的外部写入可能让许多搜索都走重建。

目前没有实测容量阈值。决定是否改成持久索引之前，应测量冷搜索耗时、外部提交频率、分词成本和每连接内存。持久索引会减少重建，同时要求所有写入路径遵守索引维护机制，并承担分词器升级的重建规则。

<a id="guarded-edits" style="scroll-margin-top: 120px"></a>

## 九、读取 revision 后才能修改

记录和查询之后，下一件实际需要的事是纠错。但让模型拿一个搜索结果直接执行 `UPDATE` 有两个问题：搜索排名不能识别用户到底指哪条记录；搜索之后记录也可能已经被其他连接修改。

当前工具流程是：

```text
查询 / 搜索 / 会话中的明确 id
        ↓
多个候选无法区分 → 先询问用户
        ↓
get_personal_record(type, id)
        ↓ 完整 row + revision
update_personal_record(type, id, expected_revision, patch)
        ↓
新 snapshot，或者明确的冲突错误
```

`get_personal_record` 按类型和精确 id 读取。类型选错、id 不存在都会失败，不会退回相似标题猜测。

### 9.1 revision 是全部持久字段的内容指纹

读取实现使用原始 SQL 行计算 SHA-256：

```ts
const revision = createHash('sha256')
  .update(JSON.stringify([type, raw]))
  .digest('hex')
```

返回的 `row` 则转换成 camelCase，并把标签 JSON 转回数组。指纹覆盖类型和整行持久字段，因此外部 SQLite 客户端直接修改标题，即使没有更新 `updated_at`，也能导致旧指纹失效。

为什么不只比较 `updated_at`？有的表没有这个字段，外部写入也可能不维护它；时间精度和相同时间戳也不适合承担全部版本语义。内容指纹不需要增加列或要求所有写入者递增计数器，schema 仍保持 v4。

它也有明确限制：这是当前内容的指纹，不是单调版本号。如果整行内容 A 改成 B，再完全恢复为 A，旧指纹可以再次匹配。它不记录历史，不提供审计，也不是用户授权凭证。能复制指纹并不意味着程序已经验证了用户对本次修改的同意。

### 9.2 比较必须在写事务里面

服务的顺序是：

```text
BEGIN IMMEDIATE
  → 重新读取目标
  → 比较 expected_revision
  → 校验并规范化 patch
  → 写入、同步索引、维护相关项目时间
  → 读取新 snapshot
COMMIT
```

如果把 revision 比较放在事务外，另一个写入者可能在“比较通过”与 UPDATE 之间提交。当前先取得 SQLite 写事务，再读和比较，其他连接不能在核对之后插入另一笔写提交。第二个拿着旧指纹的写入者等到锁后，重新读取会发现内容已变并拒绝。

冲突错误要求“重新读取并重新考虑这次修改”，不能仅刷新 token 就盲目重试。例如用户说“把刚才的截止日期推迟一天”，其他连接已将日期改到下个月，原先算好的日期不一定仍符合意图。

`update_task`、`complete_task` 和 `update_blog_post` 也要求 `expected_revision`，最终委托给同一套服务方法。否则通用编辑器有版本检查，常用快捷工具却能绕过它。

### 9.3 部分修改如何区分保留与清空

`parseRecordPatch` 逐项查该类型的可编辑字段，并把字段映射到程序持有的 SQL 列名。用户输入不能直接成为 SQL 标识符。所有值用参数绑定；未知字段、空 patch、数组和非对象输入都被拒绝。

<div style="overflow-x: auto">

| patch | 含义 |
|---|---|
| `{ "rating": 8 }` | 只改评分，其他字段保留 |
| `{ "rating": null }` | 清空可空评分 |
| `{ "note": "" }` | 清空可为空的文本 |
| `{ "tags": [] }` | 清空标签 |
| `{ "relatedProjectId": null }` | 解除可空项目链接 |
| `{ "id": "another" }` | 拒绝；标识符不可改 |
| `{ "createdAt": "..." }` | 拒绝；创建时间不可改 |

</div>

并非每个字段都允许 `null`。任务的 `sourceType/sourceId` 修改后必须同时有值或同时为 null；项目、网站引用要求精确且存在的 id。任务进入 `DONE` 自动设置完成日期，已经完成时再次设为 `DONE` 保留原完成日期，离开 `DONE` 清空它。客户端不能直接补写 `doneAt`。

修改任务同时提供 `dueAt` 与 `dueIn` 时，显式 `dueAt` 优先，包括用 `null` 清空。解析器用字段是否存在判断，不能写成 `patch.dueAt ?? 相对日期`，否则清空的意思会被覆盖。

源码见 [record-edit.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/record-edit.ts)、[store/records.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/store/records.ts) 和 [updateRecord](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/src/index.ts#L659)。

<a id="deletion" style="scroll-margin-top: 120px"></a>

## 十、删除时如何处理引用

删除也要求精确类型、id 和 revision。它是永久删除，没有软删除标记或撤销入口。工具描述要求用户明确提出删除；不能因为两条标题相同就自行清理“重复”。这条要求由模型遵守，当前工具没有额外实现一套弹窗确认流程。

引用需要分三类处理：

<div style="overflow-x: auto">

| 引用 | 行为 |
|---|---|
| 项目日志、任务、博客、想法的项目外键；任务的网站外键 | 阻止删除，列出引用记录的类型和 id |
| 任务 `source_type/source_id` 精确对应目标类型和 id | 阻止删除；自由文本别名不能被推断成同一对象 |
| 显式 `relations` 以目标为任一端点 | 删除目标时一并移除这些链接 |

</div>

用户决定先解除或重新关联哪些引用，服务不级联删除相关任务、博客或日志。引用检查、关系清理、目标删除和 revision 核对都在同一写事务里。删除项目日志还会更新其所属项目时间。

一个值得保留的失败测试是：给目标表安装一个会拒绝 DELETE 的测试 trigger。删除流程已经清理 `relations`，随后真正删除目标时报错，此时事务必须把关系也恢复；目标和全文索引同样保持原状。只检查“抛出了错误”会漏掉前半段已经生效的副作用。

现有 [records.spec.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/tests/records.spec.ts#L156) 验证了这条路径，以及解除引用后成功删除、外键检查和冷重开后的结果。它的价值在于在真实 SQLite 事务中制造中途失败，而不是 mock 一个永远返回错误的 Store。

<a id="transcript" style="scroll-margin-top: 120px"></a>

## 十一、工具结果如何进入模型上下文

服务能改库只是其中一部分。模型还必须读到最新结果，后续上下文也应该能从会话日志恢复。

当前有一个无 key 的组装测试 [record-transcript.spec.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/tests/record-transcript.spec.ts)。它安装真实 Personal 插件与 Agent Loop，使用脚本化 MockAdapter 依次发出：读取《灵媒》、携带读取到的 revision 修改评分、输出确认文字。

测试观察三个位置：

1. SQLite 中评分从 7.5 变为 8。
2. 会话的 `tool/result` 包含读取结果、修改后的完整行与新 revision。
3. 第二次模型请求包含先前读取的 revision，第三次请求包含修改结果。

这说明工具返回的事实进入了实际交互链，而不是只在测试里直接调用了一个服务方法。MockAdapter 的选择已经预先安排，因此它不证明真实模型一定会主动先读、主动询问歧义或正确理解用户意图。

真实 Provider 测试检查模型在未预设工具序列时的行为。仓库的 [experiences.e2e.ts](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/tests/experiences.e2e.ts) 包含记录多类经历、混合输入、评分、任务与经历区分、纠错、删除和冷启动查询等场景。

### 回顾也要标出范围

日报和周报工具先从 Store 组装事实，再交给模型叙述。日报按项目归组日志，加入完成任务、未完成任务、经历、创建的博客与想法、有开放任务的网站和每日记录。周报按周一至周日取窗口，用周内日志确定活跃项目。

这里的“未完成任务”是查询时仍开放的任务，不是历史日期那一天的任务状态快照。当前记录表保存现状，不保存完整状态变更历史。回顾有些查询还设置了 200 条上限，多个 SQL 读取也没有统一包在一个跨表读取事务里。高频外部写入或大量记录时，不能承诺一份无限完整、历史状态准确且具有统一读取快照的报表。

这些限制和全文搜索的一致快照不同；不能因为两者都从 SQLite 读取，就默认所有读取接口具有同样保证。

<a id="experiments" style="scroll-margin-top: 120px"></a>

## 十二、运行实验与检查证据

这次修订在 Node `v26.10.0` 下，用本文固定的源码组合运行个人助理现有测试：**9 个文件、91 个测试通过**；另附实验作为 1 个测试单独运行通过。本次执行范围是无 key 的源码测试，未重新运行真实 Provider E2E、最低支持版本 Node 或干净机器安装。

为方便复现，文章另附一个小型实验：下载 [personal-consistency-experiment.spec.ts](post-assets/dsh-personal/personal-consistency-experiment.spec.ts) 和 [实际运行输出 JSON](post-assets/dsh-personal/personal-consistency-observations.json)。它导入项目的实际 Service 与索引实现，使用临时 SQLite 文件，不需要模型 key，也不会读取你的个人数据库。

### 12.1 固定源码和依赖环境

以下从新目录开始，将插件放在 DSH 检出目录内。测试配置会通过 DSH 的 tsconfig paths 指向工作区源码；dsh-personal 的 peerDependencies 是 `*`，因此这里必须同时固定 DSH 提交，不能只固定插件。

```sh
git clone https://github.com/ChengqianHuang/deepseek-harness.git
cd deepseek-harness
git checkout 49a606bc5b5934603f22a26957a07dc799ab0291
pnpm install --frozen-lockfile
git clone https://github.com/ChengqianHuang/dsh-personal.git dsh-personal
git -C dsh-personal checkout 13b12b6ed31a6c99193ece203741fe7a8bdfe588
```

再安装独立插件自己的依赖：

```sh
cd dsh-personal
pnpm install --ignore-workspace --frozen-lockfile --config.auto-install-peers=false
cd ..
```

运行现有测试：

```sh
node node_modules/vitest/vitest.mjs run --config dsh-personal/vitest.config.ts
```

把下载的实验文件保存为 `dsh-personal/tests/blog-consistency-experiment.spec.ts`，然后在 DSH 根目录单独运行：

```sh
PERSONAL_EXPERIMENT_TRACE=/tmp/personal-observations.json \
node node_modules/vitest/vitest.mjs run \
  --config dsh-personal/vitest.config.ts \
  dsh-personal/tests/blog-consistency-experiment.spec.ts
```

复现环境需要满足该 DSH 提交的 Node 与 pnpm 要求；首次安装需要网络。这些是源码开发布局下的实验步骤，不是插件独立于 DSH 即可启动的公开应用入口。

### 12.2 实验观察什么

第一个实验用固定的中文语料检查非连续词匹配、统一排序和总 `limit`。它还用结构化结果核对实际命中，避免仅凭最终一句“已找到”判断检索有效。

本次实际结果如下。两条记录使用相同的检索词，task 命中标题，idea 命中正文；分数只是这个两条记录语料下的观测：

<div style="overflow-x: auto">

| 顺序 | 类型 | 标题 | 返回 score |
|---|---|---|---|
| 1 | task | 检查博客的 HTTPS 证书 | 0.0000036713735558408212 |
| 2 | idea | 整理运维笔记 | 0.0000018274760383386584 |

</div>

查询 `博客证书` 分成 `["博客", "证书"]`；标题中并不存在连续的“博客证书”子串。`limit: 1` 时只返回第一条 task。

第二个实验从同一条记录读取 revision，另一个 SQLite 连接直接修改它，再尝试使用旧 revision 更新和删除。两次操作均被拒绝，外部新内容保留。随后重新读取再修改成功。实际观测的顺序是：

```text
读取：检查博客证书 / TODO，保存 revision
外部连接修改：检查生产证书 / TODO，未改 updated_at
旧 revision 修改：拒绝；旧 revision 删除：拒绝
重新读取后完成：检查生产证书 / DONE
关闭并重开：rowEqual=true，revisionEqual=true
重开后首次搜索：返回“检查生产证书”
```

第三个实验执行前文的双连接快照时序，并让分词函数故意抛错，观察失败的索引重建回滚后，下一次搜索能重新同步。输出保留实际词语、顺序和错误路径的拒绝结果，便于与文章解释对照。

下面摘录输出中的索引观测：

```json
{
  "externalCommitDuringRebuild": "域名续费",
  "pinnedSnapshot": ["新证书"],
  "nextCertificateSearch": [],
  "nextDomainSearch": ["域名续费"],
  "afterLocalRollback": ["域名续费"],
  "failedRebuildRejected": true,
  "afterFailedRebuildRetry": ["证书续期"],
  "durableSearchTables": [],
  "durableSchemaVersion": 4
}
```

重建期间的外部提交没有进入本次快照，但下一次查询可以看到；本地事务回滚没有留下“回滚记录”；失败重建没有让后续查询永久使用旧索引。实验还检查主库中没有持久搜索表，版本仍为 4。

这些实验验证存储与工具所依赖的机制。要进一步验证“换一个会话后，模型确实通过工具取得记录”，应该运行 Provider 测试，检查新进程的 SQL、`tool/result` 和最终回答；还可以用同样问题加空数据库做对照。若只看到模型说出了一个电影名，无法排除它来自聊天上下文或常识补全。

<a id="installation" style="scroll-margin-top: 120px"></a>

## 十三、安装配置与适用范围

日常运行使用 DSH profile。源码环境先按 DSH 的构建说明准备好运行产物，并在独立插件目录构建 `lib/index.mjs`：

```sh
# 在 dsh-personal 目录构建插件
pnpm exec tsdown
```

回到 DSH 根目录，再安装到 profile 并检查组合：

```sh
pnpm dsh plugin --profile web add /absolute/path/to/dsh-personal
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

开发构建和运行条件见固定提交的 [DSH 文档](https://github.com/ChengqianHuang/deepseek-harness/tree/49a606bc5b5934603f22a26957a07dc799ab0291/docs/user/develop) 与 [插件 README](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/README.md)。

在 profile patch 中可按 id 配置插件。下面列出常用字段；数据库路径请替换为本机的绝对路径，或省略以使用默认值：

```yaml
- id: personal
  name: dsh-personal
  config:
    timezone: Asia/Shanghai
    enableDailyReview: true
    enableWeeklyReview: true
    searchTitleWeight: 5
    searchTagWeight: 3
    searchBodyWeight: 1
```

默认数据库位于 `<DSH_HOME>/personal/personal.db`，通常是 `~/.dsh/personal/personal.db`。三个检索权重必须是正的有限数，非法值在配置解析时报错。关闭回顾工具不会删除已有记录。

当前实现适合单用户、可以接受连接内索引重建的结构化记录。它没有多用户隔离、向量语义检索、自动定时回顾、修改历史、撤销或消息级幂等机制。记录仍是明文 SQLite；备份运行中的 WAL 数据库时应使用 SQLite 认可的备份方式，不能假定随手复制一个活动的主文件已经包含所有提交。

这个项目最实用的部分，是把模型选择与可执行规则接到一起：类别可以扩展，修改字段仍有允许列表；检索可以按关键词跨类型排序，返回的记录仍属于同一次读取快照；模型可以纠错，旧读取也不能无条件覆盖新内容。沿着这些具体操作检查，才能判断个人助理保存了什么、查到了什么，以及这次修改是否应该提交。

完整源码：[dsh-personal](https://github.com/ChengqianHuang/dsh-personal/tree/13b12b6ed31a6c99193ece203741fe7a8bdfe588)。检索与编辑的设计取舍分别记录在 [派生检索索引说明](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/.agents/notes/implemented/architecture/2026-09-28-derived-search-index.md) 和 [精确编辑说明](https://github.com/ChengqianHuang/dsh-personal/blob/13b12b6ed31a6c99193ece203741fe7a8bdfe588/.agents/notes/implemented/architecture/2026-09-28-record-editing.md)。
