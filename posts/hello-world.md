---
title: Hello World：这个博客是怎么搭的
date: 2026-09-25
---

这是本站的第一篇文章。

## 技术选型

这个博客是**免构建**的静态站点：

- 纯 HTML / CSS / 原生 JS，无框架、无 Node 构建步骤、无 Ruby
- 文章以 Markdown 存放在 `posts/` 目录，浏览器端用 [marked](https://github.com/markedjs/marked) 渲染
- 文章索引维护在 `posts.json`，新增文章 = 加一个 `.md` 文件 + 在 `posts.json` 加一行
- 部署在 GitHub Pages，push 到 `main` 分支即自动生效

## 怎么写新文章

1. 在 `posts/` 下新建 `my-post.md`，开头写 front matter：

```markdown
---
title: 文章标题
date: 2026-09-25
---

正文……
```

2. 在 `posts.json` 里加一条（列表按时间倒序排）：

```json
{ "title": "文章标题", "date": "2026-09-25", "file": "my-post" }
```

3. `git commit` 并 push，约一分钟后线上可见。
