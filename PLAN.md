# FAQJSONLD.COM 项目执行计划

## 项目概述
- **项目名称**: Schema for AI Search (faqjsonld.com)
- **代码位置**: `/root/.openclaw/workspace/projects/faq`
- **技术栈**: Astro 6 + Preact + TypeScript + Bun
- **主要功能**: 提供12种免费的schema生成器 + schemaguardian CLI验证工具

## 当前状态
- [x] Phase 1: 12个schema生成器矩阵 + 着陆页 + SEO基础设施
- [x] Phase 1A: 针对每种schema类型的GEO/AEO文案定位
- [x] Phase 2 v0.1: schemaguardian CLI的`check`命令
- [ ] Phase 2 v0.2: `scan`(站点地图驱动)和`generate`(CLI提示)功能
- [ ] Phase 2 v0.3+: 付费Pro功能(计划中)

## 详细执行计划

### 第一阶段：完善CLI工具Phase 2功能

#### 任务1: 实现 `scan` 命令
- **目标**: 实现通过sitemap扫描整个网站的功能
- **时间估算**: 2-3天
- **具体步骤**:
  1. 创建 `cli/src/commands/scan.ts` 文件
  2. 实现sitemap自动发现功能 (sitemap.xml, sitemap-index.xml)
  3. 实现URL遍历逻辑，支持并发请求
  4. 为每个URL调用现有的验证逻辑
  5. 汇总结果，提供统计信息
  6. 添加命令行选项: `--limit`, `--concurrency`, `--sitemap`
  7. 添加CI模式支持 (`--ci`)
  8. 添加JSON输出模式 (`--json`)

#### 任务2: 实现 `generate` 命令
- **目标**: 实现通过CLI提示生成schema的功能
- **时间估算**: 2-3天
- **具体步骤**:
  1. 创建 `cli/src/commands/generate.ts` 文件
  2. 实现交互式提示功能，支持选择schema类型
  3. 为每种schema类型创建相应的输入提示
  4. 使用现有的schema定义来生成JSON-LD
  5. 提供输出选项 (stdout, 文件保存)
  6. 添加预览功能

#### 任务3: 实现 `init` 命令
- **目标**: 生成GitHub Actions工作流文件
- **时间估算**: 1天
- **具体步骤**:
  1. 创建 `cli/src/commands/init.ts` 文件
  2. 设计工作流模板
  3. 支持不同的命令选项 (scan/check)
  4. 实现文件写入功能
  5. 添加覆盖确认选项

### 第二阶段：优化网站功能

#### 任务4: 优化现有生成器UI
- **目标**: 提升用户体验和界面设计
- **时间估算**: 2天
- **具体步骤**:
  1. 审查当前的 `SchemaGenerator.tsx` 组件
  2. 优化响应式设计
  3. 添加实时预览功能
  4. 改进错误提示机制
  5. 添加复制代码功能

#### 任务5: SEO优化增强
- **目标**: 提升搜索引擎可见性
- **时间估算**: 1天
- **具体步骤**:
  1. 检查当前meta标签实现
  2. 优化OG图像和社交媒体标签
  3. 验证结构化数据标记
  4. 添加面包屑导航

### 第三阶段：扩展功能

#### 任务6: 添加新schema类型支持
- **目标**: 根据市场需求添加更多schema类型
- **时间估算**: 3-5天
- **具体步骤**:
  1. 研究市场需求，确定优先级高的schema类型
  2. 为新类型创建schema定义文件
  3. 注册到schema索引中
  4. 生成相应的UI组件
  5. 添加SEO页面

#### 任务7: 加强测试覆盖
- **目标**: 为CLI工具和网站功能添加更多测试
- **时间估算**: 2-3天
- **具体步骤**:
  1. 为CLI命令编写单元测试
  2. 为网站功能编写集成测试
  3. 设置CI/CD管道
  4. 添加代码覆盖率检查

## 优先级排序

1. **高优先级**:
   - 实现 `scan` 命令 (任务1) - 这是Phase 2的核心功能
   - 实现 `generate` 命令 (任务2) - 提升用户体验的关键功能

2. **中优先级**:
   - 实现 `init` 命令 (任务3) - 提升开发者体验
   - 优化现有生成器UI (任务4) - 提升用户满意度

3. **低优先级**:
   - SEO优化增强 (任务5) - 持续优化
   - 添加新schema类型 (任务6) - 根据市场需求调整
   - 加强测试覆盖 (任务7) - 质量保证

## 预期成果

完成上述计划后，faqjsonld.com项目将达到Phase 2的完整功能，包括：
1. 完整的schemaguardian CLI工具，包含check、scan、generate和init命令
2. 优化的网站用户体验
3. 更好的SEO表现
4. 为后续付费Pro功能奠定基础

## 评估指标

- CLI工具功能完整性
- 代码质量和测试覆盖率
- 用户体验改进程度
- SEO指标提升
- 市场反馈和使用率