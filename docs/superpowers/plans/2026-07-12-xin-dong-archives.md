# 心动档案局 · DATE REQUEST NO.001 实施计划

**目标：** 构建一段可在移动端完整走通、可部署到 Vercel 的私人约会邀请故事。

**结构：** Next.js App Router + TypeScript 严格模式；状态机负责剧情流转，hook 管理 localStorage 进度，服务适配器隔离提交；场景、管理员角色和 UI 原件独立分层。

**视觉提炼：** 暖纸张、墨黑粗线、珊瑚粉主按钮、撕纸边缘、硬偏移阴影、文件夹标签、胶带和红色印章。每幕仅保留一个主色与一个动画焦点。

## 交付切片

- [ ] 1. 写失败测试，定义主剧情、拒绝支线和日程门禁的状态机 API。
- [ ] 2. 实现状态机、邀请数据模型、LocalInvitationAdapter 与进度 hook。
- [ ] 3. 抽取六个怦怦管理员动作并建立集中配置、设计令牌和 SVG 食物图标。
- [ ] 4. 实现 INTRO、SECOND_CONFIRM、SCHEDULE、FOOD、REVIEW、SUBMITTING、SUCCESS 七幕及三次追捕、认真拒绝分支。
- [ ] 5. 添加 API 路由占位、环境变量示例与 Playwright 流程测试。
- [ ] 6. 在 360×800、390×844、430×932 和桌面容器内视觉验收、截图、修复、构建。
