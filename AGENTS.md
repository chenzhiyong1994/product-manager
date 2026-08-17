# ProductManager 项目指南

## 项目目的

本仓库提供面向中文 B 端、SaaS 与企业系统的 Codex 项目级产品管理 Skill。

当前公开范围聚焦两条可复用工作流：根据业务上下文创建范围匹配的 PRD，以及使用证据化框架审查已有 PRD。项目不替代用户研究、业务确认、技术评估、合规审查或产品经理的最终判断。

## Skill 路由

编写 PRD、需求文档、产品方案或系统设计文档前，阅读：

1. `skills/create-prd/SKILL.md`
2. 其中与当前产品类型、文档范围和章节相关的 `references/`

审查、检查、评议或改进 PRD、需求文档、产品方案、SaaS 规格或企业系统设计前，阅读：

1. `skills/check-prd/SKILL.md`
2. 其中与当前审查强度和维度相关的 `references/`

同一任务先编写再审查时，先使用 `create-prd`，再使用 `check-prd`。

## 核心约束

- 先识别商业属性、功能类型和文档范围，再决定生成结构或审查强度。
- 不得为模块迭代或单点需求机械补齐完整 14 章。
- 信息不足时使用 `[TODO]` 或明确标记证据缺口，不编造业务事实。
- 审查发现必须定位到具体章节、页面、字段、流程或缺失证据，并给出可执行改法。
- 涉及有状态实体时，必须覆盖状态转换以及不同状态下字段和操作的可见、可编辑、可触发规则。
- 图表优先使用 Mermaid；结构化规则优先使用表格。
- 示例、评估用例和文档不得包含真实客户资料、账号凭据、内部链接或未获授权的企业信息。

## 目录用途

- `skills/`：项目级工作流、参考规则和评估用例
- `examples/`：可公开、已脱敏的输入示例
- `assets/readme/`：项目介绍视觉资产
- `runs/`、`workspace/`：本地临时文件，不进入版本库

## 最小验证

修改后至少执行：

```powershell
git diff --check
Get-ChildItem skills -Recurse -Filter *.json | ForEach-Object { Get-Content -Raw $_ | ConvertFrom-Json | Out-Null }
```

同时确认新增 Markdown 相对链接可解析，且没有将凭据、内部 URL 或真实业务材料写入 Git。
