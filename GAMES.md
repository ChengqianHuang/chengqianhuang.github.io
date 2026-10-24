# 游戏区维护

- 首页顺序：简短介绍 → 小游戏 → 鹈鹕测试 → 文章。
- 首页展示 `games.json` 中最前面的 4 个游戏；`games.html` 展示全部。数组顺序就是展示顺序，新的游戏通常放在最前面。
- 桌面端固定两列卡片，封面在上、信息在下；只有一个游戏也保持相同卡片宽度。手机端为单列。不添加尚未能玩的占位卡。
- 每个游戏使用独立页面 `games/<id>.html`，从首页或游戏列表进入同一个地址；首页不加载游戏运行脚本。

新增游戏：

1. 添加可直接游玩的独立页面，保留返回游戏列表的入口，并支持手机操作、暂停和主题。
2. 将封面放在 `game-assets/`，建议 720 × 440。封面不运行游戏或自动播放动画。
3. 在 `games.json` 添加 `id`（唯一短名）、`title`、`description`（一句玩法）、`controls`（输入方式）、`url`（站内绝对路径）和 `cover`（站内绝对路径）。首页和列表会自动更新。
4. 检查首页卡片、全部游戏、独立游戏之间的跳转，以及窄屏和键盘操作。

达到 6 个左右再按实际需要增加分类，目前不加搜索、筛选或分页。

修改游戏规则后运行对应检查：`node scripts/test_2048.mjs` 或 `node scripts/test_breakout.mjs`。打砖块检查包括八关物理模拟、碰撞、多球、道具和暂停。

像素突围：`node scripts/test_assault.mjs`，检查跳跃、子弹碰撞、检查点、武器、手雷及整关通关。运行逻辑在 `assault-engine.mjs`，输入与战斗特效在 `assault.js`，角色绘制在 `assault-sprites.mjs`，场景与地形在 `assault-environment.mjs`。美术模块只读取游戏状态，不修改碰撞和规则。

炸弹竞技场：`node scripts/test_bomber.mjs`，检查炸弹通行、十字爆炸遮挡、连锁引爆、道具、比分和缩圈，以及多组电脑完整对战。规则在 `bomber-engine.mjs`，绘制在 `bomber-art.mjs`，输入及界面在 `bomber.js`。
