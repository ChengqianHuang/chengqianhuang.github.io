# chengqianhuang.github.io

个人技术博客，部署于 GitHub Pages：<https://chengqianhuang.github.io>

## 写新文章

1. 在 `posts/` 下新建 `your-post.md`，开头写 front matter：

   ```markdown
   ---
   title: 文章标题
   date: YYYY-MM-DD
   ---

   正文（Markdown）……
   ```

2. 在 `posts.json` 数组**开头**加一条：

   ```json
   { "title": "文章标题", "date": "YYYY-MM-DD", "file": "your-post" }
   ```

3. push 到 `main`，GitHub Pages 自动发布，约 1 分钟生效。

## 架构

- 免构建：纯静态 HTML/CSS/JS，无 SSG、无 CI
- 文章渲染：浏览器端 marked.js（CDN），front matter 在 `post.js` 内解析
- `.nojekyll`：跳过 GitHub Pages 的 Jekyll 处理，保证 `_` 开头文件也能被服务
- 暗色模式：CSS `prefers-color-scheme` 自动跟随系统
