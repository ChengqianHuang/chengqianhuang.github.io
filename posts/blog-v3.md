---
title: 博客 v3：WebGL、ASCII 甜甜圈和一个彩蛋
date: 2026-09-25
---

v2 的 2D 粒子还是太温和了。v3 把家底亮出来。

## WebGL 极光 shader

首页背景换成了裸 WebGL 片元着色器，无 Three.js：

- 两层 fbm 噪声叠加出流动的极光带，蓝→紫→青三色按噪声值混合
- 鼠标位置作为 uniform 传入，偏移噪声场，背景跟着鼠标流动
- 主题感知：`u_dark` uniform 切换叠加模式（暗色发光 / 亮色淡彩）
- 全屏三角形 + 5 octave fbm，DPR 上限 2，一帧一次 draw call
- **降级链**：WebGL 不可用 → 回落 v2 的 2D 粒子；reduced-motion → 全部静止

## ASCII 甜甜圈

Hero 区右侧有一颗实时旋转的 ASCII 甜甜圈，致敬经典 [donut.c](https://www.a1k0n.net/2011/07/20/donut-math.html)：

- 环面参数方程逐点投影，z-buffer 遮挡剔除
- Lambert 光照映射到 `.,-~:;=!*#$@` 十级字符
- y 轴投影乘 0.55 适配字符宽高比，约 20fps，42×18 字符
- 顺手加了 `text-shadow` 辉光，暗色主题下更像 CRT 终端

## 终端启动序列

首页文案改成了终端 boot：`$ whoami`、`$ ls ./posts` 逐字敲入，输出即时打印。`prefers-reduced-motion` 下直接显示全文。

## 标题解码特效

大标题用 scramble 效果进场：乱码字符池逐帧归位。

## 彩蛋

页脚藏着 `↑↑↓↓←→←→BA`。Konami 秘籍输入正确 → 全屏 Matrix 数字雨 8 秒（纯 canvas，片元字符用的是片假名+十六进制），控制台同时打印一条绿色消息。

## 仍然坚持的

- 免构建、零 npm 依赖，WebGL/甜甜圈/彩蛋加起来不到 400 行原生 JS
- 所有动画尊重 `prefers-reduced-motion`
- `visibilitychange` 停帧，GPU 和电池友好
- WebGL 挂了站点照常可读——炫技是锦上添花，不是单点故障
