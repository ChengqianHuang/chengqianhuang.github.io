# 鹈鹕测试

首页预览最多显示 3 个结果；`pelican.html` 显示全部结果。

数据在 `pelican.json` 中。`prompt` 是默认提示词，`results` 存正式测试结果。没有正式结果时才显示 `examples` 中明确标记的版式示例；示例不归属任何模型。

## 添加正式结果

将 SVG 原始文件放入 `pelican-assets/`，在 `results` 数组开头添加记录：

```json
{
  "id": "unique-result-id",
  "provider": "模型提供商",
  "model": "完整模型版本",
  "title": "卡片显示名称",
  "date": "YYYY-MM-DD",
  "attempt": 1,
  "settings": "记录推理档位等实际参数",
  "svg": "pelican-assets/unique-result-id.svg",
  "notes": "记录测试条件与人工修改情况"
}
```

如果提示词不同，在该记录中增加 `prompt`。未记录的参数会显示“未记录”，不要根据猜测补填。图片以独立 SVG 文件展示；源码以纯文本展示，不会直接作为 HTML 插入页面。

有正式结果后，示例自动退出首页和画廊。页面按 `results` 中的顺序展示，并按 `provider` 生成筛选按钮。
