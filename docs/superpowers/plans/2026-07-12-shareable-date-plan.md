# 可分享约会计划 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把“心动档案局”从单机的趣味邀请演示，收敛为可尊重拒绝、可确定时间、可生成分享链接的约会计划流程。

**Architecture:** 状态机去掉二次确认与独立复核，把同意后的流程收敛为日期时间、约会方式和确认卡三步。邀请结果只编码为可公开访问的分享链接；不伪造跨设备送达或回应同步，未来由现有 `InvitationService` 接入 Supabase。

**Tech Stack:** Next.js App Router、React 19、TypeScript、Framer Motion、Node test runner、Playwright。

---

### Task 1: 定义新的邀请状态与分享计划数据

**Files:**
- Modify: `src/lib/state-machine.ts`
- Create: `src/lib/share-plan.ts`
- Test: `tests/unit/state-machine.test.ts`
- Test: `tests/unit/share-plan.test.ts`

- [ ] **Step 1: 写失败测试**：断言“批准”直接进入日程、“今天不方便”从首屏直达暂存，以及分享 URL 往返日期、时间和约会方式。
- [ ] **Step 2: 运行 `npm test`**，确认新增断言因事件和分享函数缺失而失败。
- [ ] **Step 3: 最小实现**：新增 `DECLINE_NOW` 事件，`APPROVE` 转入 `SCHEDULE`；以 URL-safe Base64 编码 `date`、`time`、`activityId` 的只读计划。
- [ ] **Step 4: 再运行 `npm test`**，确认单元测试通过。

### Task 2: 以真实日期和具体时段重做约会安排

**Files:**
- Modify: `src/config/invitation.ts`
- Modify: `src/components/scenes/ScheduleScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: 修改端到端测试**：使用 `type="date"` 输入未来日期，选择“下午 15:00 / 晚上 19:00 / 饭后 20:30”之一。
- [ ] **Step 2: 运行对应 Playwright 测试**，确认它因旧的文本日期输入与旧时间标签失败。
- [ ] **Step 3: 最小实现**：日期输入使用原生日历、最小日期为当天；时间选项展示具体时间；未补全时按钮不可提交且说明缺少项。
- [ ] **Step 4: 再运行对应 Playwright 测试**，确认流程通过。

### Task 3: 保留连续逃跑彩蛋，同时暴露体面退出

**Files:**
- Modify: `src/components/scenes/IntroScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Modify: `src/components/scenes/DeclineScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: 写失败测试**：首屏立即可见“今天不方便”；“容我想想”连续点击仍按既有三段逃跑剧情后进入认真选择。
- [ ] **Step 2: 运行测试**，确认首屏体面退出尚不存在而失败。
- [ ] **Step 3: 最小实现**：把逃跑按钮明确为“容我想想”，新增固定的 plain action 触发 `DECLINE_NOW`；保留每次点击的位移、脚印、倒计时与档案袋彩蛋。
- [ ] **Step 4: 再运行测试**，确认两种拒绝路径都正确。

### Task 4: 将“吃什么”改成可选的约会方式，并移除多余复核页

**Files:**
- Modify: `src/config/invitation.ts`
- Modify: `src/components/scenes/FoodScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Modify: `src/components/scenes/SubmitSuccessScene.tsx`
- Modify: `src/lib/state-machine.ts`
- Test: `tests/unit/state-machine.test.ts`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: 写失败测试**：选定约会方式后直接进入生成确认卡，不再要求额外复核点击。
- [ ] **Step 2: 运行测试**，确认旧状态机仍进入 `REVIEW` 而失败。
- [ ] **Step 3: 最小实现**：把“快乐补给”改为“约会方式”，保留吃饭、咖啡、散步、看展与“交给你”；让确认卡成为最终唯一摘要。
- [ ] **Step 4: 再运行测试**，确认完整邀请从首屏到确认卡的点击数减少且所有字段保留。

### Task 5: 生成真实可打开的分享卡链接，不再伪称已经送达

**Files:**
- Create: `src/components/scenes/SharedPlanScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Modify: `src/components/scenes/SubmitSuccessScene.tsx`
- Modify: `src/lib/invitation-service.ts`
- Modify: `src/app/globals.css`
- Test: `tests/unit/share-plan.test.ts`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: 写失败测试**：确认成功页有“分享约会卡”，分享链接在新页面可解析并显示对应日期、时间和约会方式。
- [ ] **Step 2: 运行测试**，确认分享卡与解析页不存在而失败。
- [ ] **Step 3: 最小实现**：优先调用 Web Share API，失败后复制链接；分享页面只展示已确认计划并提供“发起新的邀请”；发送动画文字改为“正在生成约会卡”，移除“对方已经看到”的不实文案。
- [ ] **Step 4: 再运行测试**，确认链接、回退文案与页面展示一致。

### Task 6: 全量验证

**Files:**
- Modify: `tests/e2e/visual.spec.ts`

- [ ] **Step 1: 更新视觉回归流程覆盖新日期、退出与分享按钮。**
- [ ] **Step 2: 运行 `npm test`、`npm run lint`、`npm run build`、`npm run e2e`。**
- [ ] **Step 3: 逐项检查移动端 360×800、390×844、430×932 与桌面无横向溢出、无控制台报错、主动作可点击且减弱动态设置仍可完成流程。**

## 验收边界

- 本次不引入匹配池、聊天、位置跟踪或支付。
- 本次分享链接真实可打开，但不声称跨设备回应已回传给发起人。
- 跨设备状态同步需在配置 `SUPABASE_URL`、`SUPABASE_ANON_KEY` 和邀请表后接入 `InvitationService`；当前仓库没有可用凭据或持久化服务。
