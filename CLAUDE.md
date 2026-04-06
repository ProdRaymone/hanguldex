# HangulDex 项目规范

## 架构原则
- 数据与逻辑严格分离：/data 放语言数据集，/lib 放通用引擎
- 组件分层：/shared 放跨语言通用组件，/korean 放韩语特有组件
- 所有新功能必须考虑后续英语 IPA 模块的复用性
- 单个组件文件不超过 200 行，超过则拆分
- 函数命名用英文，注释可中英混合

## 技术栈
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS
- Supabase (v2 阶段引入)
- TypeScript 严格模式

## 文件命名
- 组件：PascalCase (QuizCard.tsx)
- 工具函数：camelCase (srsCalculator.ts)
- 数据文件：kebab-case (basic-consonants.json)
- 页面：Next.js App Router 约定 (page.tsx)

## 修改规则
- 修改任何组件前，先说明当前行为和期望行为
- 不要修改 /data 目录下的 JSON 数据文件，除非明确要求
- 新增功能以独立文件/组件形式添加，不要在现有文件中堆叠
- 每次修改后确认不影响其他模块的功能
