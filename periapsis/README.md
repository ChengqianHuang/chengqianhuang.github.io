# 引力边界 / Periapsis

电脑优先的第三人称轨道飞行游戏，入口 `/games/periapsis.html`。晨昏线、碎星带、日蚀航路三条航线分别有 18 / 23 / 27 个航环，至少通过 13 / 18 / 22 个，在时间耗尽前到达终点。

## 操作和规则

- 鼠标相对画面中心控制转向，中央小十字附近有死区；WASD / 方向键也能驾驶。纵向自动飞行，Shift 加速，空格减速，Esc 暂停，R 重飞。
- 触屏使用左下方向盘与加速、减速按钮；浏览器失焦或切到后台会暂停。
- 下一道环为金色，后续环为青色。中心穿环、连击、加速穿环及擦过陨石可加分。漏环罚时 2 秒，撞击消耗护盾，穿环回复少量护盾。
- 连续加速约 4.4 秒会过热，引擎冷却到 25% 后再次开放加速。普通巡航也能完成全部航线。
- 观光试飞使用真实控制输入沿路线驾驶，可随时接管。试飞及其中途接管都不保存纪录。
- 正常通关按得分保存本机最佳纪录至 `periapsis-records-v1`；未完成的航线和失败不保存。

这是街机飞行规则：固定 60 Hz 逻辑步长，横向采用有阻尼的速度响应，陨石使用球形扫掠碰撞，航环在跨越平面时插值判断穿环。没有用轨道力学或空气动力学模拟。外侧装饰陨石在可飞范围以外，巨型空间站的内孔避开可飞范围；它们不会形成看不见的碰撞墙。

## 渲染

Three.js WebGL 2、物理材质与环境反射、HDR 泛光、色调映射、独立行星日夜与大气着色器、云层、星空、粒子和发动机尾焰。飞船与空间站的几何、面板材质、陨石凹凸、引擎和穿环音效由代码生成。关卡实例化陨石，复用航环几何和材质；切换航线会回收旧的实例缓冲和路线几何，粒子使用固定池。

精细画质最高使用 1.5 倍像素比；流畅画质关闭泛光并限制为 1 倍像素比。页面下方制作信息显示当前帧率。遵循减少动态效果偏好：停用速度线、菜单摆动和加速视角变化。

## 开发

```sh
cd periapsis
npm ci --ignore-scripts
npm test
npm run build
```

在仓库根目录启动静态 HTTP 服务。源码与 `dist/` 一起提交，GitHub Pages 直接部署预构建文件。依赖固定 Three.js 0.186.1、esbuild 0.28.2。没有运行时 CDN、服务器或站外素材请求。

- `src/flight.mjs`：确定性航线、飞行控制、扫掠碰撞、计分、过热与存档校验。
- `src/world.mjs`：摄像机、后处理、航环、陨石、实例化与粒子回收。
- `src/art.mjs`：N–07 飞船、空间站和程序化纹理。
- `src/cosmos.mjs`：行星、日夜纹理、大气、云层、星空与远景。
- `src/main.mjs`：输入、固定步长、菜单、HUD、暂停、试飞与音效。
- `../scripts/test_periapsis.mjs`：三条完整航线在 30 / 60 / 120 Hz 下通关、无加速通关、高速碰撞、擦身奖励、防重复伤害、漏环、过热冷却、失败、边界与存档。

## 素材与许可

Three.js 为 MIT，许可随 `dist/LICENSE.txt` 发布。

地球图像来自 NASA Blue Marble 系列，由 Three.js 官方示例提供下载。本项目未改写原始文件。NASA Goddard Space Flight Center；地表、浅水和云层由 Reto Stöckli 制作，海洋色彩与合成由 Robert Simmon 增强。夜光数据包括 DMSP 来源。

- `assets/earth-day.jpg`：[Three.js 官方文件](https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg)，2048 × 1024。
- `assets/earth-clouds.png`：[Three.js 官方文件](https://threejs.org/examples/textures/planets/earth_clouds_1024.png)，1024 × 512。
- `assets/earth-night.png`：[Three.js 官方文件](https://threejs.org/examples/textures/planets/earth_lights_2048.png)，2048 × 1024。
- [NASA 原始项目说明与署名](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/)。

画面中的飞船、空间站、航线为虚构设计，地球图像仅用作环境美术。封面来自游戏实际运行截图。
