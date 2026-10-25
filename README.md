# chengqianhuang.github.io

个人技术博客，部署于 GitHub Pages：<https://chengqianhuang.github.io>

## 写新文章

1. 在 `posts/` 下新建 `your-post.md`，开头写 front matter：

   ```markdown
   ---
   title: 文章标题
   date: YYYY-MM-DD
   author: 作者名
   ---

   正文（Markdown）……
   ```

2. 在 `posts.json` 数组**开头**加一条：

   ```json
   { "title": "文章标题", "date": "YYYY-MM-DD", "author": "作者名", "file": "your-post" }
   ```

   `author` 可省略；填写后会显示在首页列表和文章页。

3. push 到 `main`，GitHub Pages 自动发布，约 1 分钟生效。

## 架构

- 博客与普通小游戏是纯静态 HTML/CSS/JS，无 SSG；3D 赛车在 `racing/` 独立构建，产物随仓库提交。CI 校验鹈鹕记录与赛车构建。
- 文章渲染：浏览器端 marked.js（CDN），front matter 在 `post.js` 内解析
- `.nojekyll`：跳过 GitHub Pages 的 Jekyll 处理，保证 `_` 开头文件也能被服务
- 暗色模式：CSS `prefers-color-scheme` 自动跟随系统

## 鹈鹕测试

提交图片与模型 / harness 信息前，请阅读 [PELICAN.md](PELICAN.md)。格式定义见 `schemas/`，校验器在 `scripts/validate_pelican.py`。

## 小游戏

游戏列表见 [games.html](games.html)。新增游戏与首页排版约定见 [GAMES.md](GAMES.md)，首页和完整列表共用 `games.json`。
