# 港湾疾驰 / Harbor Rush

电脑优先的独立 3D 赛车，入口为 `/games/harbor-rush.html`。709 米港区环线、三圈四车竞速、单圈计时、可随时接管的示范驾驶。本机纪录按玩法分别保存，示范圈不写入纪录。

## 开发与发布

在此目录执行：

```sh
npm ci
npm test
npm run build
```

从仓库根目录用静态 HTTP 服务预览。修改 `src/` 后必须重新构建并一起提交 `dist/`，GitHub Pages 直接提供已经构建好的文件。浏览器运行时不依赖 CDN、外部 API、账号或服务器。

固定依赖版本与锁文件用于重现构建。Jolt 使用单线程、独立 WASM 文件版本，不要求 SharedArrayBuffer 或额外的隔离响应头。不要将 `node_modules/` 提交或部署。

## 文件

- `src/track.mjs`：闭合曲线、路宽、护栏位置、电脑车路线、顺序检查点和计时。
- `src/physics.mjs`：Jolt 世界、四轮驱动、悬挂、防倾杆、发动机、刹车、物体碰撞及复位。
- `src/car.mjs`：原创车身、轮胎、轮圈、玻璃、防滚架、灯组与轮胎动画。
- `src/world.mjs`：沥青、路肩、港区货柜、吊机、仓库、远景、海面和照明。
- `src/main.mjs`：固定 60 Hz 物理步长、输入、相机、声音、计分、暂停、菜单与结果。
- `src/effects.mjs`：轮胎烟雾；胎痕在 `main.mjs` 中绘制。
- `../scripts/test_racing.mjs`：真实 WASM 模拟测试，包含四车完整三圈对战。

碰撞边界与视觉护栏共用赛道数据。坡道与图形使用相同的尺寸和倾角。车辆可以跳跃、翻转和撞动物箱；车身碰撞采用简化形状，没有车体凹陷和碎片破坏。赛道美术采用原创程序化模型，不代表照片级画质。

比赛必须按顺序通过 24 处检查点，倒行和跳过检查点不能完成一圈。回正位于上一个已通过检查点之后，玩家每次罚时 3 秒。电脑车受相同车辆物理和检查点约束；严重碰撞、翻车或卡住后会恢复到上一检查点。电脑冲线后继续驶离终点，避免堵住后车。

切换标签页、窗口失焦、Esc 和暂停按钮都会冻结比赛计时与物理。恢复时清除旧输入和累计帧时间。页面关闭后资源由浏览器回收；重开复用同一个世界和四辆车，不重复创建 WASM 实例。

## 素材与许可

游戏中的车辆、环境模型、天空 / 海面着色器、标牌、界面和音效均由 Codex 在本仓库中用代码制作。轮胎烟雾和地面细节使用程序化纹理。封面截自实际运行画面。

外部材质来自 Poly Haven，均为 [CC0](https://polyhaven.com/license)，保存在 `assets/`，不在运行时请求外站：

| 文件 | 来源 / 作者 |
| --- | --- |
| `venice_sunset_1k.hdr` | [Venice Sunset](https://polyhaven.com/a/venice_sunset) / Greg Zaal，1K HDR 环境光 |
| `asphalt_diff.jpg` | [Asphalt 02](https://polyhaven.com/a/asphalt_02) / Rob Tuytel，1K diffuse |
| `asphalt_normal.jpg` | 同上，1K OpenGL normal |
| `asphalt_rough.jpg` | 同上，1K roughness |

渲染使用 [Three.js](https://github.com/mrdoob/three.js)（MIT），物理使用 [Jolt Physics.js](https://github.com/jrouwe/JoltPhysics.js)（MIT）。车辆初始化参考其官方 wheeled-vehicle 示例；许可随 `dist/LICENSES.txt` 部署。依赖的附加注释保存在 `dist/racing.js.LEGAL.txt`。

当前首次所需的本地脚本、WASM 和图片合计约 7.3 MB（传输压缩前）。桌面预览实测可达约 60 FPS；实际帧率取决于设备、分辨率与浏览器。精细模式使用动态阴影和较高像素密度；流畅模式关闭动态阴影并限制像素密度。
