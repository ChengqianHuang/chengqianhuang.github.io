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

拆楼公司：入口 `games/demolition.html`，独立源码与构建位于 `demolition/`。六个合同和一个自由模式，共用支撑蓝图与 Jolt 刚体碰撞；支持弹道瞄准、连锁爆破、保护目标、慢动作和上一炮回放。在 `demolition/` 运行 `npm ci --ignore-scripts`、`npm test`、`npm run build`；源码与 `dist/` 同时提交。检查覆盖六关完整解法、静止稳定性、物理命中、倒塌传播、弹药 / 保护目标失败、重复切关和自由模式弹丸回收。HUD 及回放只读取物理快照，不能修改胜负。环境光复用站内的 `racing/assets/venice_sunset_1k.hdr`，不得删除该共享素材。

修改游戏规则后运行对应检查：`node scripts/test_2048.mjs` 或 `node scripts/test_breakout.mjs`。打砖块检查包括八关物理模拟、碰撞、多球、道具和暂停。

像素突围：`node scripts/test_assault.mjs`，检查跳跃、子弹碰撞、检查点、武器、手雷及整关通关。运行逻辑在 `assault-engine.mjs`，输入与战斗特效在 `assault.js`，角色绘制在 `assault-sprites.mjs`，场景与地形在 `assault-environment.mjs`。美术模块只读取游戏状态，不修改碰撞和规则。

炸弹竞技场：`node scripts/test_bomber.mjs`，检查炸弹通行、十字爆炸遮挡、连锁引爆、道具、比分和缩圈，以及多组电脑完整对战。规则在 `bomber-engine.mjs`，绘制在 `bomber-art.mjs`，输入及界面在 `bomber.js`。

五子棋：`node scripts/test_gomoku.mjs`，检查连线、边界、长连、悔棋、三个难度的攻防必着、双活三与搜索限时。规则在 `gomoku-engine.mjs`，电脑算法在 `gomoku-ai.mjs`，通过 `gomoku-worker.mjs` 在后台搜索；前台重开、悔棋和暂停会取消旧任务。采用自由五子棋，不设禁手。

五子棋电脑使用增量棋形表、带置换表的迭代加深 PVS、冲四静态延伸，以及独立 VCF 连续冲四证明。休闲 / 标准 / 挑战的搜索预算分别为 140 / 900 / 2800 毫秒，普通搜索上限为 2 / 8 / 12 层，挑战的 VCF 最多验证 21 手；实际完成深度取决于局面与设备。默认挑战。VCF 只有证明成功才视为必胜，超时和未找到线路都不能据此判定必败。

港湾疾驰：电脑优先的 Three.js + Jolt 四轮赛车，入口 `games/harbor-rush.html`。源码、依赖和离线资源在 `racing/`，发布构建在 `racing/dist/`。在 `racing/` 执行 `npm ci`、`npm test`、`npm run build`，提交源码时同时提交构建产物。三个赛道在 `src/track.mjs` 定义，路面、碰撞、电脑路线和小地图共用同一份曲线数据；各赛道各玩法独立保存纪录。物理检查覆盖发动机、刹车、倒车、护栏碰撞、坡道腾空、顺序检查点、每条赛道四车完整三圈对战、示范圈、重复切换和旧纪录迁移。运行时不使用 CDN，也不改变其它游戏的依赖。素材来源和操作说明见 `racing/README.md`。

霓虹裂变：`node scripts/test_neon.mjs`，检查移动、冲刺、武器、连杀、分裂、脉冲、暂停、Boss 三阶段与完整模拟。入口 `games/neon-rift.html`，规则在 `neon-engine.mjs`，WebGL2 HDR 渲染、GPU 粒子和弹性网格在 `neon-renderer.mjs`，合成音频在 `neon-audio.mjs`，输入及界面在 `neon.js`。无外部运行时依赖；修改游戏规则后运行逻辑回归，修改渲染后在浏览器检查 WebGL 着色器、桌面与触屏操作。

`test_gomoku.mjs` 还用真实落子规则逐步核验 16 组旋转 / 镜像的冲四线路（最长 21 手），检查反击优先级、封死的假活三、劣势下继续防守和中断搜索。改动算法时可用 `node scripts/bench_gomoku.mjs /absolute/path/to/baseline-ai.mjs 250` 对弈回归：四种固定开局交换先后手，双方使用相同每步时限，输出棋谱与搜索数据。基线模块需导出 `chooseMove`，并使用能解析的引擎导入路径；不要将基线模块部署到网站。耗时对弈结果会随设备负载变化，不能当作等级分。

引力边界：电脑优先的 Three.js 轨道飞行游戏，入口 `games/periapsis.html`，源码与构建在 `periapsis/`。六条航线、鼠标 / 键盘 / 触屏转向、加速过热、穿环连击、扫掠碰撞和不计纪录的观光试飞。在 `periapsis/` 执行 `npm ci --ignore-scripts`、`npm test`、`npm run build`，源码和 `dist/` 一起提交。测试覆盖六条完整航线、不同步长、无加速通关、碰撞 / 擦身防重复、漏环、过热、失败和存档。装饰场景不改动飞行规则；游戏资源全部从本站读取，NASA 地球纹理的来源与署名保留在 README。

引力边界的航线参数位于 `periapsis/src/flight.mjs`：后三关分别为螺旋、左右折线和变间距冲刺；航环半径同时驱动碰撞与显示，空间站位置由航线数据提供。扩展航线时保持既有航线的航环、陨石种子和存档 ID 不变，并验证窄屏六关菜单及下一关衔接。

打砖块的绘制与特效在 `breakout-art.mjs`，只读取游戏状态；八关物理布局不由绘制层改变。`breakout.js` 管理输入、短暂撞击停顿、分层音效和全屏。减少动态效果偏好关闭震动、碎片、拖尾与撞击停顿。运行 `node scripts/test_breakout.mjs`，同时验证八关通关及绘制不修改物理状态；封面 `game-assets/breakout.png` 来自实际游戏截图。

打砖块八关采用独立机关：港口基础反弹、钢墙回廊、横移传送带、双开关护盾、周期闸门、三簇爆破矿脉、限幅下沉砖阵、三阶段核心战。钢墙与闸门不计入通关目标，关门时让已进入的球先离开；核心每段装甲结束会重新生成两个供能器。关卡计时只在物理更新中推进，暂停冻结、丢球保留、切关重置。背景在 `breakout-scenes.mjs`，读取机关状态，不参与碰撞。`?level=1..8` 可指定起点；新规则最高分使用 `breakout-best-v2-start-<level>`，不同起点分开保存，保留旧 v1 键不覆盖。检查包含所有机关的碰撞、免伤 / 解锁、核心三阶段、不同时间步、选关和整关通关。

第五关使用 `game-assets/breakout/tidal-observatory.jpg` 美术底图，生成提示词见同目录 `ART.md`。按需加载并缓存到背景画布，失败时保留程序背景；水下颗粒和光束只读取关卡时间。玻璃模块、闸门及球仍由 Canvas 绘制，命中边界不变。

八关均使用独立美术底图，映射为 `breakout-scenes.mjs` 的 `SCENE_ASSETS`；新增七张底图与提示词见 `game-assets/breakout/SECTORS-ART.md`。素材逐关加载、每张 JPEG 小于 600 KB，缓存解码图片和当前背景画布；异步返回的其它关卡图片不打断当前背景。材质在 `breakout-materials.mjs`，绘制保持只读。测试覆盖八张素材路径 / 大小、各场景的绘制缓存、异步切关，以及原有物理回归。

矿洞改用错落晶簇与三条炸药链；晶体按三档耐久缺角，形状由 `breakout-engine.mjs` 的 `brickPolygon` 同时提供给碰撞和绘制。核心采用圆形碰撞，每阶段半径收缩 7px，九片旋转装甲逐片脱落；供能器存活时闭合虹膜并免伤。特殊目标绘制在 `breakout-specials.mjs`，只读游戏状态，遵守减少动态效果偏好。新布局的纪录键为 `breakout-best-v3-start-<level>`，保留 v1 / v2；测试新增晶体缺角、真实斜面反弹、矿脉隔离、核心收缩和空角穿过。
