---
title: 基于 DSH 构建个人助理
date: 2026-09-26
---

我在 [DeepSeek Harness（DSH）](https://github.com/ChengqianHuang/deepseek-harness) 中实现了 `@deepseek-ai/dsh-personal`。它把电影、项目进展、任务、博客选题和想法存到一个 SQLite 数据库，再用工具从数据库查询。本文沿着一次写入、一次查询和一次重启，说明这个插件实际怎么工作。

## 插件如何接入 DSH

入口是 `PersonalService`，它继承 Cordis 的 `Service`，向 `ctx.personal` 提供确定性的业务方法，并依赖已有的 `ctx.tools`。插件初始化时先调用 `ready()` 打开数据库、执行待处理的 migration，再注册模型可见的工具。注册属于 Cordis effect；插件卸载时工具随 effect 注销，数据库连接也会关闭。DSH 的 Agent Loop 不需要因个人助理而修改。

工具分成三组：11 个记录与修改工具、6 个查询工具、2 个回顾工具，分别定义在 `tools/write.ts`、`tools/query.ts` 和 `tools/review.ts`。`record_movie`、`record_project_log`、`create_task` 等名称对应具体业务动作。工具定义包含参数 schema、执行函数和结果展示，执行函数再调用 `PersonalService`。模型能选择动作并填参数，不能拿到一个任意执行 SQL 的入口。

```text
用户输入 → Agent 选择工具 → PersonalService → Store → SQLite
             参数 schema       业务规则       参数化 SQL
```

## 写入一条记录时发生了什么

以“Forge 今天定位了 streaming 中文错位问题”为例，`record_project_log` 接收项目名和日志标题，调用 `PersonalService.recordProjectLog()`。服务先查项目；第一次提到 Forge 时会创建项目。随后它写入带日期、状态和内容的日志，更新项目的修改时间，并在 `relations` 表中建立日志属于项目的关联。没有给日期时，日期取插件配置时区里的“今天”。

电影走另一条明确的规则。`record_movie` 的评分参数是 0 到 10 的 `number`；`recordMovie()` 拒绝非有限数和越界值，保留 7.5、8.25 这样的输入，不做四舍五入。数据库最初的 `movies.rating` 是 `INTEGER`，第二版 migration 重建 `movies` 表并把这一列改为 `REAL`，复制旧记录后恢复索引。这样已有整数评分仍在，之后的小数也能保存。

任务的相对期限也由程序计算。工具让模型把“明天”“下周”“周末”填成 `due_in` 枚举，`PersonalService.createTask()` 再调用 `dates.ts` 的 `resolveDueDate()`，按配置时区得到 ISO 日期。代码对“本周末”的约定是本周六；如果今天已是周六或周日，就取今天，避免得到过去的截止日。用户直接说出 `YYYY-MM-DD` 时才用 `due_at`，且它优先于 `due_in`。这样模型负责识别“周末”，不负责心算星期。

工具描述还区分了两种容易混淆的记录：“想研究一下 harness”是没有行动承诺的 `create_idea`；“明天研究 harness”是 `create_task`。`record_daily_log` 则只用于明确要求保存自由文本日记的输入。对一条列了几件事的消息，工具描述要求分别写入结构化记录，避免再保存内容重复的日记摘要。这些选择仍需靠真实模型输入做回归，因为工具描述只能引导模型，不能替它作确定性判断。

## SQLite 文件怎样建立和升级

默认数据库在 `~/.dsh/personal/personal.db`，路径和时区都可配置。`openPersonalDatabase()` 创建目录与文件时使用仅所有者可访问的权限；打开后先核对 SQLite 的 `application_id`。只有空库或标记为 `PERS` 的库可以继续，避免把个人表写进别的应用数据库。

通过身份检查后，连接启用 WAL、外键和五秒写锁等待，再按 `PRAGMA user_version` 运行 migration。每一步 migration 和版本号更新在同一事务内；中途失败就回滚到上一版。九张表使用 SQLite `STRICT`，状态和评分有 `CHECK`，标签列有 `json_valid`，项目与任务等关系使用外键。库里保存的是个人数据行，不包含 Cordis Context、Session 或 Agent 运行状态，所以 SQLite 文件可以独立读取。

## 查询与回顾读的是哪些数据

问“最近看了什么电影”时，Agent 调用 `query_movies`。这个工具将日期窗口、标签和返回条数交给 `MovieStore.list()`；Store 使用预编译语句和绑定参数查询 `movies`，按观影日期倒序返回。未指定条数时返回最多 20 条，上限 200 条。查询窗口可以给具体的 `from`、`to`，也可以用 `today`、`this-week`、`this-month`、`this-year`；周按周一到周日计算。

跨类型的问题使用 `search_personal_data`。它把搜索分派给电影、项目、日志、任务、博客等各自的 Store，使用转义后的 SQLite `LIKE` 做大小写不敏感的子串匹配，再按类型组织结果。这不是向量检索，也没有把八类对象塞进一张通用 JSON 表。

`generate_daily_review` 和 `generate_weekly_review` 在 `review.ts` 中组装事实。每日回顾把当天项目日志按项目归组；每周回顾从本周日志找出活跃项目。两者都读取已完成与未完成的任务、电影、博客文章、想法和有未完成任务的网站。每日回顾还读取明确保存的 DailyLog。组装过程没有让模型查询或改写数据库；工具返回事实集合和可读文本，模型再据此生成叙述。

## 如何验证它没有只靠聊天记忆

测试分几层。Store 与 Service 测试覆盖数据约束、日期和 migration；Loader 组合测试检查服务与 19 个工具的注册、卸载和数据库句柄释放。真实 Provider 的 Headless E2E 则发送自然语言，检查 SQLite 行和 session log 里的工具调用；随后以同一数据库启动新进程、新会话，再问电影记录。如果新会话仍调用 `query_movies` 并读出旧记录，答案就不是靠上一段聊天上下文。

当前实现刻意只处理单用户的结构化记录与子串查询。没有自动定时回顾、全文检索或多用户隔离。后续需求出现时再扩展对应能力；现阶段更重要的是让每次工具选择、日期计算和数据写入都能用具体输入验证。
