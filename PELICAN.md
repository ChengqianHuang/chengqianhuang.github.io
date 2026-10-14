# 鹈鹕测试提交规范（v1.1）

任意模型或代理可以提交结果。每次提交包含 **SVG 图片、独立 JSON 测试记录，以及首页索引中的记录路径**。记录同时保存模型和 harness，不能把 Codex、ChatGPT 等运行工具当成具体模型版本。

## 测试协议

协议文件：[`pelican-test.json`](pelican-test.json)。测试 ID：`pelican-riding-bicycle-svg-v1`。

固定提示词，大小写与标点保持一致：

```text
Draw an SVG of a pelican riding a bicycle.
```

建议在全新对话中生成一次、保存第一次结果、不使用外部绘图工具、不修改图形。这是建议的比较条件；代理模式、带历史上下文、多次生成或修改过的结果也可以提交，必须如实记录。

这两个测试的图片都是 SVG 文件。页面使用 `<img>` 展示 SVG，源码使用纯文本展示。v1 不接收截图或其他模型画作的重新绘制。展示用 SVG 不允许脚本、外部资源和嵌入图片；动画测试允许 CSS 与有限的 SVG 几何动画，静态测试不允许动画；原始 SVG 若不符合规则，应保留原文件并如实记录修改后的展示文件。原始文件仅提供源码与下载，不作为预览图片。

## 动画协议

动画使用独立测试 ID `pelican-riding-bicycle-animated-svg-v1`，协议位于 `pelican-test-animated.json`：

```text
Draw an animated SVG of a pelican riding a bicycle. Make the wheels turn and the pelican pedal. Respect prefers-reduced-motion.
```

动画记录使用 `schemaVersion: "1.1.0"`，增加 `animation`（`mechanism`: `css` / `smil` / `css-smil`，`respectsReducedMotion`: `true`）和 `poster`（与 `artifact` 相同的文件结构）。`poster` 必须是无动画的暂停图；可以自动从生成的 SVG 移除动画制作，原始 SVG 保持原样。页面提供暂停 / 播放，并在系统减少动态效果时展示暂停图。

静态和动画结果分别标记并可筛选，各自使用固定提示词。v1.0 静态记录仍兼容。

## 文件组织

- `pelican-assets/<id>.svg`：生成的 SVG 图片。
- `pelican-results/<id>.json`：一次生成的完整记录。
- `pelican.json`：画廊索引，将记录路径加入 `results` 数组开头。
- `schemas/pelican-result.schema.json`：正式记录的 JSON Schema（Draft 2020-12）。
- `schemas/pelican-manifest.schema.json`：索引格式。

`id` 和 JSON 文件名必须一致。已发布结果和生成原图应保留；模型新版本、新 harness 或重新生成要使用新的 ID。画廊按索引顺序显示，首页最多取前三个结果。有正式结果时，版式示例自动退出展示。

## 一份记录的形状

完整实际例子见 [`pelican-results/gpt-6-codex-2026-10-14-01.json`](pelican-results/gpt-6-codex-2026-10-14-01.json)。结构如下：

```json
{
  "$schema": "../schemas/pelican-result.schema.json",
  "schemaVersion": "1.0.0",
  "id": "unique-run-id",
  "testId": "pelican-riding-bicycle-svg-v1",
  "model": { "provider": "提供商", "name": "实际模型名称", "id": null },
  "harness": {
    "name": "实际运行工具",
    "version": null,
    "mode": "agent",
    "context": "fresh",
    "tools": []
  },
  "run": {
    "generatedAt": "2026-10-14T20:00:00+08:00",
    "prompt": "Draw an SVG of a pelican riding a bicycle.",
    "attempt": 1,
    "totalAttempts": 1,
    "selection": "first",
    "parameters": {},
    "postProcessing": "none",
    "notes": "实际的测试环境、已知限制或必要说明"
  },
  "artifact": {
    "path": "pelican-assets/unique-run-id.svg",
    "mediaType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "sha256": "替换为文件原始字节的 SHA-256，64 位小写十六进制"
  },
  "source": null
}
```

上面是格式模板，哈希示意值需要替换，不能直接通过校验。

| 字段 | 填写规则 |
| --- | --- |
| `model.identitySource` | 型号来源：`system-reported`（系统声明）、`api-reported`（API 返回）、`user-reported`（用户提供）。用户提供但未独立核实的标识，应在备注说明。 |
| `model.provider / name / id` | 提供商、可确认的模型名称、具体模型 ID。ID 不可确认就填 `null`；不要从 harness 名称或页面标题推断模型版本。 |
| `harness.name / version` | 实际运行工具和版本；版本不明确填 `null`。 |
| `harness.mode` | `agent`、`chat` 或 `api`。 |
| `harness.context` | `fresh` 表示无既有对话；`existing-conversation` 表示含对话历史。 |
| `harness.tools` | 生成这幅图时实际使用的工具名称列表；没有填 `[]`。可用但没使用的工具不要填。 |
| `run.generatedAt` | 实际生成时间，必须包含时区。 |
| `run.attempt / totalAttempts` | 当前图是第几次生成，以及这轮一共生成多少次。 |
| `run.selection` | `first` 只允许 1 次；`best-of-n` 表示多次择优；`all` 表示这轮全部结果都会提交。 |
| `run.parameters` | 已知的温度、推理档位等实际参数。未知填 `{}`，不要猜默认值。 |
| `run.postProcessing` | `none` 未修改；`formatting-only` 仅格式整理；`edited` 修改了图形。 |
| `artifact` | 实际展示文件的路径、媒体类型、像素尺寸和 SHA-256。 |
| `source` | 没有另一个原始文件时填 `null`。如果展示文件经过修改，应在此使用与 `artifact` 相同的结构记录原始 SVG。`formatting-only` 与 `edited` 都必须保留独立的原始文件。 |

SVG 图片的宽高必须与记录一致。支持像素尺寸，或者从 `viewBox` 取得宽高。文件哈希按原始字节计算；修改空格也会改变哈希。模型条件、prompt 或图形修改情况在详情中公开展示，JSON 记录可直接下载。

## 提交与校验

1. 选择静态或动画协议，按相应固定提示词生成新 SVG，先保存生成文件，再渲染检查。不要直接将画廊示例改名为正式结果。
2. 建立记录，填写真实元信息。记录 ID、SVG 文件名建议包含模型、harness、日期和序号。
3. 将 `pelican-results/<id>.json` 加入 `pelican.json` 的 `results` 数组。
4. 安装校验依赖并运行：

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-validation.txt
.venv/bin/python scripts/validate_pelican.py
.venv/bin/python -m unittest discover -s scripts -p 'test_*.py'
```

5. 查看图片实际渲染，核对卡片和详情。校验通过后提交 PR。GitHub Actions 会再次检查 schema、文件引用、哈希、尺寸和 SVG 内容。

Schema 格式版本与测试协议 ID 分开管理。需要不同的测试提示词时，请注册新协议和相应 schema 规则，不要把不同提示词混进同一个测试 ID。Schema 的破坏性变更需升级版本并同步加载器与校验器。
