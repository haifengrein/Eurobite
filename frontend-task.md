> 提示：前端任务主版本为 `frontend-task_v2.md`。
> 当前进度：Phase 1（脚手架）、Phase 2（基础登录流程）、Phase 3（菜单浏览）、Phase 4（购物车 Store 与底栏）、Phase 5（地址管理与结算页骨架）已在 `eurobite/frontend` 中完成初版实现。
> 本文件保留为历史记录，不再更新，请参考 `frontend-task_v2.md` 获取最新分阶段任务清单与后续任务。

---

## 后台管理界面设计 (Backend Admin Interface)

### 项目架构调整
- 创建独立的后台管理前端项目：`eurobite-admin`
- 技术栈：React + TypeScript + Ant Design + React Router + Zustand
- 部署端口：http://localhost:5174

### Phase A: 管理员认证模块

#### A1. 管理员登录页面 (`/admin/login`)
- **布局设计**：居中卡片式登录表单
- **组件结构**：
  ```
  AdminLoginPage
  ├── LoginForm
  │   ├── UsernameInput (用户名/手机号)
  │   ├── PasswordInput (密码)
  │   ├── CaptchaInput (验证码)
  │   ├── CaptchaImage (验证码图片)
  │   └── SubmitButton (登录按钮)
  ├── LoginBackground (背景装饰)
  └── Footer (版权信息)
  ```
- **交互逻辑**：
  - 表单验证（用户名、密码、验证码必填）
  - 登录失败错误提示
  - 验证码刷新功能
  - 记住登录状态
- **API 集成**：
  - POST `/api/auth/employee/login` - 管理员登录
  - GET `/api/captcha` - 获取验证码

#### A2. 登录成功跳转
- 自动跳转到 `/admin/dashboard`
- 清除登录表单状态
- 保存认证 token 到 localStorage

### Phase B: 后台管理主框架

#### B1. 管理员布局组件 (`/admin/*`)
- **整体布局结构**：
  ```
  AdminLayout
  ├── AdminHeader
  │   ├── Logo区域
  │   ├── 面包屑导航
  │   ├── 用户信息下拉
  │   │   ├── 个人信息
  │   │   ├── 修改密码
  │   │   └── 退出登录
  │   └── 消息通知
  ├── AdminSider
  │   ├── 菜单导航
  │   │   ├── 首页仪表盘
  │   │   ├── 订单管理
  │   │   ├── 菜品管理
  │   │   ├── 套餐管理
  │   │   ├── 分类管理
  │   │   ├── 用户管理
  │   │   ├── 员工管理
  │   │   └── 系统设置
  │   └── 折叠按钮
  └── AdminContent
      ├── 路由页面内容
      └── 页面底部版权
  ```
- **状态管理**：
  - 用户信息状态 (Zustand)
  - 菜单折叠状态
  - 权限控制状态

#### B2. 路由配置
```typescript
// AdminRoutes.tsx
const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'orders', element: <OrderManagementPage /> },
      { path: 'dishes', element: <DishManagementPage /> },
      { path: 'setmeals', element: <SetmealManagementPage /> },
      { path: 'categories', element: <CategoryManagementPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'employees', element: <EmployeeManagementPage /> },
      { path: 'settings', element: <SystemSettingsPage /> }
    ]
  }
]
```

### Phase C: 首页仪表盘 (`/admin/dashboard`)

#### C1. 数据统计卡片
- **今日订单统计**：
  - 订单总数、今日订单数、营业额
  - 环比增长率显示
- **菜品统计**：
  - 在售菜品数、今日热销菜品 TOP5
- **用户统计**：
  - 总用户数、今日新增用户
- **员工统计**：
  - 员工总数、在线员工数

#### C2. 图表展示
- **订单趋势图**：近30天订单数量和营业额折线图
- **热销菜品TOP10**：柱状图展示
- **订单状态分布**：饼图显示各状态订单占比

#### C3. 快捷操作
- 待处理订单快速入口
- 库存预警提醒
- 系统通知公告

### Phase D: 订单管理模块 (`/admin/orders`)

#### D1. 订单列表页面
- **筛选器组件**：
  - 时间范围选择器
  - 订单状态筛选 (待付款、已付款、已完成、已取消)
  - 订单号/用户手机号搜索
  - 配送员筛选
- **表格组件**：
  - 订单号、用户信息、商品信息、订单金额
  - 订单状态、支付方式、下单时间
  - 操作按钮 (查看详情、打印订单)
- **分页组件**：支持分页和每页显示数量设置

#### D2. 订单详情页面 (`/admin/orders/:id`)
- **订单基本信息**：
  - 订单号、下单时间、订单状态
  - 用户信息（姓名、手机号、地址）
  - 配送信息（配送员、配送时间）
- **订单商品列表**：
  - 商品图片、名称、规格、数量、单价
  - 小计计算
- **订单操作**：
  - 确认接单、派单给配送员
  - 修改订单状态
  - 打印订单小票

#### D3. 订单状态管理
- **状态流转**：
  - 待付款 → 已付款 → 制作中 → 已完成
  - 异常订单状态处理
- **批量操作**：
  - 批量确认接单
  - 批量打印订单

### Phase E: 菜品管理模块 (`/admin/dishes`)

#### E1. 菜品列表页面
- **操作栏**：
  - 添加菜品按钮
  - 批量上架/下架
  - 批量删除
- **筛选器**：
  - 分类筛选
  - 状态筛选 (在售/停售)
  - 关键词搜索
- **菜品表格**：
  - 菜品图片、名称、分类、售价
  - 状态、操作 (编辑/删除/上下架)
  - 销量统计

#### E2. 添加/编辑菜品弹窗
- **基本信息**：
  - 菜品名称、分类选择
  - 售价、原价
  - 主图上传
- **详细信息**：
  - 菜品描述
  - 制作时间、难度等级
  - 营养信息
- **口味设置**：
  - 口味选项配置
  - 必选/可选口味
  - 价格差异设置

#### E3. 批量操作
- **Excel导入/导出**：
  - 模板下载
  - 数据校验和导入
  - 导出当前筛选结果

### Phase F: 套餐管理模块 (`/admin/setmeals`)

#### F1. 套餐列表页面
- **套餐卡片视图**：
  - 套餐图片、名称、价格
  - 包含菜品列表预览
  - 套餐状态、销量
- **套餐操作**：
  - 添加套餐、编辑套餐
  - 上下架、删除套餐
  - 复制套餐

#### F2. 套餐详情编辑
- **基本信息**：名称、价格、图片
- **包含菜品**：
  - 菜品选择器
  - 数量设置
  - 套餐优惠价格显示
- **有效期设置**：套餐售卖时间范围

### Phase G: 分类管理模块 (`/admin/categories`)

#### G1. 分类树形结构
- **左侧分类树**：
  - 树形展示所有分类
  - 支持拖拽排序
  - 分类状态切换
- **右侧分类详情 分类信息编辑**：
  -
  - 子分类管理
  - 分类下菜品数量统计

#### G2. 分类操作
- **新增分类**：支持多级分类
- **编辑分类**：名称、排序、图标
- **删除分类**：检测是否有关联菜品
- **批量操作**：批量启用/禁用分类

### Phase H: 用户管理模块 (`/admin/users`)

#### H1. 用户列表
- **用户信息**：
  - 用户头像、昵称、手机号
  - 注册时间、最后登录时间
  - 订单统计、累计消费金额
- **筛选功能**：
  - 注册时间范围
  - 消费金额区间
  - 订单数量筛选
- **用户操作**：
  - 查看用户详情
  - 禁用/启用用户
  - 发送站内消息

#### H2. 用户详情页面
- **基本信息**：头像、昵称、会员等级
- **订单统计**：总订单数、总消费、客单价
- **消费记录**：最近消费明细
- **收货地址**：地址管理
- **操作记录**：登录日志、行为记录

### Phase I: 员工管理模块 (`/admin/employees`)

#### I1. 员工列表
- **员工信息**：
  - 姓名、工号、部门、职位
  - 手机号、入职时间、状态
  - 最后登录时间
- **员工操作**：
  - 添加员工、编辑员工信息
  - 重置密码、禁用/启用
  - 权限分配

#### I2. 权限管理
- **角色定义**：
  - 超级管理员、运营经理、客服
  - 自定义角色权限配置
- **权限控制**：
  - 菜单权限
  - 操作权限
  - 数据权限

### Phase J: 系统设置模块 (`/admin/settings`)

#### J1. 基础设置
- **店铺信息**：店铺名称、Logo、联系方式
- **营业设置**：营业时间、配送范围
- **价格设置**：起送金额、配送费

#### J2. 通知设置
- **短信设置**：短信服务商配置
- **邮件设置**：邮件模板配置
- **系统公告**：公告发布管理

#### J3. 数据统计
- **统计周期**：日、周、月、年统计
- **数据导出**：Excel导出功能
- **报表生成**：自动生成经营报表

### 技术实现要点

#### UI/UX设计规范
- **设计系统**：基于 Ant Design Design Tokens
- **响应式布局**：支持桌面端和平板端
- **主题定制**：支持明暗主题切换
- **国际化**：预留 i18n 国际化支持

#### 性能优化
- **代码分割**：路由级别的懒加载
- **虚拟滚动**：大数据列表性能优化
- **图片懒加载**：菜品图片懒加载
- **缓存策略**：API 数据缓存

#### 安全考虑
- **权限控制**：基于角色的访问控制 (RBAC)
- **操作日志**：关键操作记录审计
- **数据验证**：前后端双重数据校验
- **XSS防护**：输入内容过滤处理

#### 部署架构
- **Docker部署**：独立的 admin 容器
- **Nginx配置**：反向代理和静态资源服务
- **环境变量**：开发/测试/生产环境配置
- **监控告警**：系统监控和异常告警

---

**后续开发计划**：
1. 先实现 Phase A (管理员认证) 作为 MVP
2. 逐步完善 Phase B-F (核心业务模块)
3. 最后补充 Phase G-J (管理功能模块)
4. 持续优化性能和用户体验

---

## TDD 子任务清单：后台管理界面开发

### 如何使用本清单

每个子任务遵循 **TDD (Test-Driven Development)** 流程：
1. **RED**：先编写测试用例，明确验收标准
2. **GREEN**：实现最小可行代码使测试通过
3. **REFACTOR**：重构代码提升质量

每个子任务包含：
- **任务编号**：Phase + 序号（如 A1.1）
- **验收测试**：必须通过的测试用例
- **实现步骤**：具体的开发步骤
- **依赖关系**：完成任务的前置条件

---

## Phase A: 基础设施搭建

### A1. 项目结构初始化

#### A1.1 创建后台管理目录结构
- **任务描述**：建立标准的前端目录结构
- **验收测试**：
  ```bash
  # 测试目录存在性
  test('should have admin directory structure', () => {
    expect(fs.existsSync('src/admin')).toBe(true);
    expect(fs.existsSync('src/admin/pages')).toBe(true);
    expect(fs.existsSync('src/admin/components')).toBe(true);
    expect(fs.existsSync('src/admin/layouts')).toBe(true);
    expect(fs.existsSync('src/admin/stores')).toBe(true);
    expect(fs.existsSync('src/admin/api')).toBe(true);
  });
  ```
- **实现步骤**：
  1. 创建 `frontend/src/admin/` 目录
  2. 创建子目录：`pages/`, `components/`, `layouts/`, `stores/`, `api/`
  3. 在每个目录创建 `index.ts` 导出文件
  4. 更新根目录 `index.ts` 导出admin模块
- **依赖关系**：无

#### A1.2 安装 Ant Design 依赖
- **任务描述**：安装并配置 Ant Design UI 组件库
- **验收测试**：
  ```typescript
  test('should import antd components', () => {
    expect(() => require('antd')).not.toThrow();
    expect(() => require('@ant-design/icons')).not.toThrow();
  });

  test('should have antd theme configured', () => {
    const config = require('../../src/theme/antd');
    expect(config.token.colorPrimary).toBeDefined();
  });
  ```
- **实现步骤**：
  1. 运行 `npm install antd @ant-design/icons dayjs`
  2. 创建 `src/theme/antd.ts` 主题配置文件
  3. 在 `src/main.tsx` 中导入 Ant Design CSS
  4. 配置 Ant Design 中文语言包
- **依赖关系**：A1.1

#### A1.3 创建 TypeScript 类型定义
- **任务描述**：为后台管理模块创建 TypeScript 类型定义
- **验收测试**：
  ```typescript
  test('should export all admin types', () => {
    expect(typeof AdminUser).toBe('object');
    expect(typeof Order).toBe('object');
    expect(typeof Dish).toBe('object');
  });

  test('should have complete Order type', () => {
    const order: Order = mockOrder();
    expect(order.id).toBeDefined();
    expect(order.amount).toBeDefined();
    expect(order.status).toBeDefined();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/types/index.ts`
  2. 定义基础类型：`AdminUser`, `Order`, `Dish`, `Category`, `Setmeal`, `User`
  3. 定义 API 响应类型：`ApiResponse<T>`, `PageResult<T>`
  4. 定义表单类型：`LoginForm`, `DishFormData`
  5. 创建类型测试文件 `src/admin/types/__tests__/index.test.ts`
- **依赖关系**：A1.2

#### A1.4 配置 React Router 嵌套路由
- **任务描述**：设置后台管理的路由结构
- **验收测试**：
  ```typescript
  test('should have admin routes configured', () => {
    const routes = getAdminRoutes();
    expect(routes).toContainEqual(
      expect.objectContaining({ path: '/admin' })
    );
  });

  test('should protect admin routes', () => {
    const routes = getProtectedRoutes();
    expect(routes).toContain('/admin/dashboard');
    expect(routes).toContain('/admin/orders');
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/router/index.tsx`
  2. 配置嵌套路由：根路径 `/admin` 指向 AdminLayout
  3. 配置子路由：dashboard, orders, dishes, setmeals, categories, users, employees, settings
  4. 导出路由配置函数
- **依赖关系**：A1.3

---

## Phase B: 管理员认证

### B1. 管理员登录页面

#### B1.1 创建 LoginPage 组件基础结构
- **任务描述**：创建管理员登录页面基础UI
- **验收测试**：
  ```typescript
  test('should render login form', () => {
    render(<AdminLoginPage />);
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  test('should validate required fields', async () => {
    render(<AdminLoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    expect(await screen.findByText(/请输入用户名/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/LoginPage.tsx`
  2. 使用 Ant Design Form 组件
  3. 添加用户名、密码输入框
  4. 添加登录按钮
  5. 实现基础表单验证（必填校验）
- **依赖关系**：A1.2, A1.3

#### B1.2 实现验证码功能
- **任务描述**：添加验证码输入和刷新功能
- **验收测试**：
  ```typescript
  test('should display captcha image', () => {
    render(<AdminLoginPage />);
    expect(screen.getByAltText(/验证码/i)).toBeInTheDocument();
  });

  test('should refresh captcha on click', async () => {
    render(<AdminLoginPage />);
    const captchaImg = screen.getByAltText(/验证码/i);
    const oldSrc = captchaImg.getAttribute('src');
    fireEvent.click(screen.getByRole('button', { name: /刷新/i }));
    await waitFor(() => {
      expect(captchaImg.getAttribute('src')).not.toBe(oldSrc);
    });
  });
  ```
- **实现步骤**：
  1. 在 LoginPage 中添加验证码输入框
  2. 添加验证码图片显示组件
  3. 添加刷新按钮
  4. 集成后端 API `GET /api/captcha`
  5. 实现点击刷新验证码逻辑
- **依赖关系**：B1.1

#### B1.3 集成登录 API
- **任务描述**：实现登录表单提交和后端通信
- **验收测试**：
  ```typescript
  test('should call login API on submit', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ token: 'test-token' });
    render(<AdminLoginPage onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/用户名/i), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByLabelText(/密码/i), {
      target: { value: 'password' }
    });
    fireEvent.change(screen.getByLabelText(/验证码/i), {
      target: { value: '1234' }
    });

    fireEvent.click(screen.getByRole('button', { name: /登录/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password',
        captcha: '1234'
      });
    });
  });

  test('should show error on login failure', async () => {
    render(<AdminLoginPage />);
    // 模拟登录失败
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    expect(await screen.findByText(/登录失败/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/api/auth.ts`
  2. 实现 `login()` 函数调用后端 `POST /api/auth/employee/login`
  3. 在 LoginPage 中添加表单提交逻辑
  4. 处理登录成功：保存 token，跳转到 dashboard
  5. 处理登录失败：显示错误信息
- **依赖关系**：B1.2

#### B1.4 实现路由守卫
- **任务描述**：创建管理员认证守卫组件
- **验收测试**：
  ```typescript
  test('should redirect to login when not authenticated', () => {
    const mockUseAuth = jest.fn(() => ({ isAuthenticated: false }));
    render(<AdminAuthGuard><Dashboard /></AdminAuthGuard>);
    expect(window.location.pathname).toBe('/admin/login');
  });

  test('should render children when authenticated', () => {
    const mockUseAuth = jest.fn(() => ({ isAuthenticated: true }));
    render(
      <AdminAuthGuard>
        <div data-testid="protected-content">Protected</div>
      </AdminAuthGuard>
    );
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/AdminAuthGuard.tsx`
  2. 创建 `src/admin/stores/authStore.ts` (Zustand)
  3. 从 localStorage 读取 token 验证登录状态
  4. 未认证用户重定向到 `/admin/login`
  5. 已认证用户渲染子组件
- **依赖关系**：B1.3

---

## Phase C: 管理主框架

### C1. AdminLayout 布局组件

#### C1.1 创建基础布局结构
- **任务描述**：实现后台管理系统的整体布局
- **验收测试**：
  ```typescript
  test('should render admin layout structure', () => {
    render(<AdminLayout />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-sider')).toBeInTheDocument();
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  test('should show logo and title', () => {
    render(<AdminLayout />);
    expect(screen.getByText(/EuroBite/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/layouts/AdminLayout.tsx`
  2. 使用 Ant Design Layout 组件
  3. Header：Logo、导航、用户信息
  4. Sider：左侧菜单导航
  5. Content：页面内容区域
- **依赖关系**：B1.4

#### C1.2 实现左侧导航菜单
- **任务描述**：创建可折叠的左侧菜单导航
- **验收测试**：
  ```typescript
  test('should render navigation menu items', () => {
    render(<AdminLayout />);
    expect(screen.getByText(/仪表盘/i)).toBeInTheDocument();
    expect(screen.getByText(/订单管理/i)).toBeInTheDocument();
    expect(screen.getByText(/菜品管理/i)).toBeInTheDocument();
  });

  test('should collapse menu on toggle', () => {
    render(<AdminLayout />);
    const toggleBtn = screen.getByRole('button', { name: /折叠/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('admin-sider')).toHaveClass('collapsed');
  });
  ```
- **实现步骤**：
  1. 在 AdminLayout 中添加 Ant Design Menu 组件
  2. 配置菜单项：dashboard, orders, dishes, setmeals, categories, users, employees, settings
  3. 添加折叠/展开功能
  4. 实现路由跳转
- **依赖关系**：C1.1

#### C1.3 实现顶部用户栏
- **任务描述**：创建显示用户信息和操作的头部栏
- **验收测试**：
  ```typescript
  test('should display user info', () => {
    const mockUser = { name: '管理员', avatar: 'avatar-url' };
    render(<AdminHeader user={mockUser} />);
    expect(screen.getByText('管理员')).toBeInTheDocument();
  });

  test('should show dropdown menu on user click', () => {
    render(<AdminHeader user={mockUser} />);
    fireEvent.click(screen.getByRole('button', { name: /用户头像/i }));
    expect(screen.getByText(/个人信息/i)).toBeInTheDocument();
    expect(screen.getByText(/退出登录/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/AdminHeader.tsx`
  2. 显示当前用户信息（姓名、头像）
  3. 添加用户下拉菜单（个人信息、修改密码、退出登录）
  4. 实现退出登录功能
- **依赖关系**：C1.1

#### C1.4 实现面包屑导航
- **任务描述**：添加页面路径导航指示器
- **验收测试**：
  ```typescript
  test('should show breadcrumb for current page', () => {
    render(<AdminBreadcrumb currentPath="/admin/orders" />);
    expect(screen.getByText(/首页/i)).toBeInTheDocument();
    expect(screen.getByText(/订单管理/i)).toBeInTheDocument();
  });

  test('should navigate on breadcrumb click', () => {
    render(<AdminBreadcrumb currentPath="/admin/orders" />);
    fireEvent.click(screen.getByText(/首页/i));
    expect(window.location.pathname).toBe('/admin/dashboard');
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/AdminBreadcrumb.tsx`
  2. 使用 Ant Design Breadcrumb 组件
  3. 根据当前路径生成面包屑
  4. 实现点击跳转功能
- **依赖关系**：C1.2

### C2. 仪表盘页面

#### C2.1 创建 Dashboard 页面框架
- **任务描述**：实现首页仪表盘基础结构
- **验收测试**：
  ```typescript
  test('should render dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-charts')).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Dashboard/index.tsx`
  2. 使用 Ant Design Card 组件创建统计卡片容器
  3. 创建统计卡片区域和图表区域
  4. 添加页面标题
- **依赖关系**：C1.3

#### C2.2 实现数据统计卡片
- **任务描述**：显示关键业务指标
- **验收测试**：
  ```typescript
  test('should display today orders count', async () => {
    render(<DashboardPage />);
    const statsCard = await screen.findByTestId('stat-card-orders');
    expect(statsCard).toHaveTextContent(/今日订单/i);
    expect(statsCard).toHaveTextContent(/100/i);
  });

  test('should display revenue amount', async () => {
    render(<DashboardPage />);
    const statsCard = await screen.findByTestId('stat-card-revenue');
    expect(statsCard).toHaveTextContent(/营业额/i);
    expect(statsCard).toHaveTextContent(/¥1000/i);
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/StatCard.tsx`
  2. 实现统计卡片组件：订单数、营业额、用户数、菜品数
  3. 集成后端 API `GET /api/admin/stats`
  4. 添加加载状态和错误处理
- **依赖关系**：C2.1

#### C2.3 实现图表展示
- **任务描述**：添加数据可视化图表
- **验收测试**：
  ```typescript
  test('should render order trend chart', async () => {
    render(<DashboardPage />);
    const chart = await screen.findByTestId('order-trend-chart');
    expect(chart).toBeInTheDocument();
  });

  test('should render top dishes chart', async () => {
    render(<DashboardPage />);
    const chart = await screen.findByTestId('top-dishes-chart');
    expect(chart).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 安装图表库：`npm install echarts echarts-for-react`
  2. 创建 `src/admin/components/Charts/OrderTrendChart.tsx`
  3. 创建 `src/admin/components/Charts/TopDishesChart.tsx`
  4. 集成后端 API 获取图表数据
  5. 实现响应式图表
- **依赖关系**：C2.2

#### C2.4 实现快捷操作
- **任务描述**：添加常用功能的快速入口
- **验收测试**：
  ```typescript
  test('should show quick actions', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/待处理订单/i)).toBeInTheDocument();
    expect(screen.getByText(/库存预警/i)).toBeInTheDocument();
  });

  test('should navigate on quick action click', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByText(/待处理订单/i));
    expect(window.location.pathname).toBe('/admin/orders?status=pending');
  });
  ```
- **实现步骤**：
  1. 在 Dashboard 中添加快捷操作区域
  2. 创建操作卡片：待处理订单、库存预警、新品审核
  3. 实现点击跳转到对应页面
  4. 显示待处理数据数量
- **依赖关系**：C2.2

---

## Phase D: 订单管理

### D1. 订单列表页面

#### D1.1 创建订单列表基础组件
- **任务描述**：实现订单列表页面UI和基础功能
- **验收测试**：
  ```typescript
  test('should render order list table', async () => {
    render(<OrderListPage />);
    expect(await screen.findByTestId('order-table')).toBeInTheDocument();
  });

  test('should display order columns', async () => {
    render(<OrderListPage />);
    const table = await screen.findByTestId('order-table');
    expect(table).toHaveTextContent(/订单号/i);
    expect(table).toHaveTextContent(/用户信息/i);
    expect(table).toHaveTextContent(/订单金额/i);
    expect(table).toHaveTextContent(/状态/i);
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Orders/index.tsx`
  2. 使用 Ant Design Table 组件
  3. 配置表格列：订单号、用户信息、商品信息、订单金额、状态、操作
  4. 添加表格分页功能
- **依赖关系**：C1.2

#### D1.2 实现订单筛选功能
- **任务描述**：添加订单筛选和搜索功能
- **验收测试**：
  ```typescript
  test('should render filter form', () => {
    render(<OrderListPage />);
    expect(screen.getByLabelText(/订单号/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/手机号/i)).toBeInTheDocument();
    expect(screen.getByText(/筛选/i)).toBeInTheDocument();
  });

  test('should filter orders by status', async () => {
    render(<OrderListPage />);
    fireEvent.click(screen.getByText(/待付款/i));
    await waitFor(() => {
      expect(screen.getByTestId('order-table')).toHaveTextContent(/待付款/i);
    });
  });
  ```
- **实现步骤**：
  1. 在 OrderListPage 中添加 Ant Design Form
  2. 添加筛选字段：时间范围、订单状态、订单号、手机号
  3. 添加重置和筛选按钮
  4. 实现筛选逻辑
- **依赖关系**：D1.1

#### D1.3 集成订单列表 API
- **任务描述**：获取并显示订单数据
- **验收测试**：
  ```typescript
  test('should fetch and display orders', async () => {
    const mockOrders = [
      { id: '1', status: 'pending', amount: 100, user: { name: '张三' } }
    ];
    render(<OrderListPage />);

    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  test('should handle loading state', () => {
    render(<OrderListPage />);
    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
  });

  test('should handle empty state', async () => {
    render(<OrderListPage />);
    await waitFor(() => {
      expect(screen.getByText(/暂无数据/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/api/orders.ts`
  2. 实现 `getOrders(params)` 函数调用后端 `GET /api/orders`
  3. 在 OrderListPage 中加载数据
  4. 实现加载状态、错误处理、空数据状态
  5. 实现分页查询
- **依赖关系**：D1.2

#### D1.4 实现订单状态显示
- **任务描述**：显示订单状态标签和颜色
- **验收测试**：
  ```typescript
  test('should display correct status badge', () => {
    render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText(/待付款/i)).toHaveClass('status-pending');
  });

  test('should display different colors for different statuses', () => {
    const { rerender } = render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText(/待付款/i)).toHaveClass('bg-orange');

    rerender(<OrderStatusBadge status="completed" />);
    expect(screen.getByText(/已完成/i)).toHaveClass('bg-green');
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/OrderStatusBadge.tsx`
  2. 使用 Ant Design Tag 组件
  3. 配置状态样式：待付款(橙色)、已付款(蓝色)、制作中(紫色)、已完成(绿色)、已取消(灰色)
  4. 在订单列表中使用此组件
- **依赖关系**：D1.3

### D2. 订单详情页面

#### D2.1 创建订单详情页面
- **任务描述**：实现订单详情查看页面
- **验收测试**：
  ```typescript
  test('should render order detail page', async () => {
    render(<OrderDetailPage orderId="123" />);
    expect(await screen.findByTestId('order-basic-info')).toBeInTheDocument();
    expect(await screen.findByTestId('order-items-list')).toBeInTheDocument();
  });

  test('should display order basic info', async () => {
    render(<OrderDetailPage orderId="123" />);
    expect(await screen.findByText(/订单号：123/i)).toBeInTheDocument();
    expect(await screen.findByText(/下单时间/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Orders/Detail.tsx`
  2. 使用 URL 参数获取订单ID
  3. 创建订单基本信息区域
  4. 创建订单商品列表区域
  5. 添加返回按钮
- **依赖关系**：D1.4

#### D2.2 实现订单操作功能
- **任务描述**：添加订单状态操作按钮
- **验收测试**：
  ```typescript
  test('should show action buttons for pending order', async () => {
    render(<OrderDetailPage orderId="123" />);
    expect(await screen.findByText(/接单/i)).toBeInTheDocument();
    expect(await screen.findByText(/取消订单/i)).toBeInTheDocument();
  });

  test('should update order status on button click', async () => {
    render(<OrderDetailPage orderId="123" />);
    fireEvent.click(screen.getByText(/接单/i));

    await waitFor(() => {
      expect(screen.getByText(/制作中/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 OrderDetailPage 中添加操作按钮区域
  2. 根据订单状态显示不同操作按钮
  3. 集成后端 API `PUT /api/orders/{id}/status`
  4. 实现操作确认对话框
  5. 成功后更新页面状态
- **依赖关系**：D2.1

#### D2.3 实现订单打印功能
- **任务描述**：添加打印订单小票功能
- **验收测试**：
  ```typescript
  test('should show print button', async () => {
    render(<OrderDetailPage orderId="123" />);
    expect(await screen.findByText(/打印/i)).toBeInTheDocument();
  });

  test('should open print preview on click', async () => {
    render(<OrderDetailPage orderId="123" />);
    fireEvent.click(screen.getByText(/打印/i));
    expect(window.print).toHaveBeenCalled();
  });
  ```
- **实现步骤**：
  1. 在 OrderDetailPage 中添加打印按钮
  2. 创建 `src/admin/components/OrderPrint.tsx`
  3. 实现打印页面样式
  4. 使用 `window.print()` 触发打印
  5. 优化打印样式（仅打印订单信息）
- **依赖关系**：D2.2

---

## Phase E: 菜品管理

### E1. 菜品列表页面

#### E1.1 创建菜品列表组件
- **任务描述**：实现菜品管理列表页面
- **验收测试**：
  ```typescript
  test('should render dish list table', async () => {
    render(<DishListPage />);
    expect(await screen.findByTestId('dish-table')).toBeInTheDocument();
  });

  test('should display dish columns', async () => {
    render(<DishListPage />);
    const table = await screen.findByTestId('dish-table');
    expect(table).toHaveTextContent(/菜品图片/i);
    expect(table).toHaveTextContent(/菜品名称/i);
    expect(table).toHaveTextContent(/分类/i);
    expect(table).toHaveTextContent(/售价/i);
    expect(table).toHaveTextContent(/状态/i);
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Dishes/index.tsx`
  2. 使用 Ant Design Table 组件
  3. 配置表格列：图片、名称、分类、售价、状态、操作
  4. 添加分页功能
- **依赖关系**：C1.2

#### E1.2 实现菜品筛选功能
- **任务描述**：添加菜品筛选和搜索
- **验收测试**：
  ```typescript
  test('should render filter form', () => {
    render(<DishListPage />);
    expect(screen.getByLabelText(/菜品名称/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/分类/i)).toBeInTheDocument();
  });

  test('should filter dishes by category', async () => {
    render(<DishListPage />);
    fireEvent.change(screen.getByLabelText(/分类/i), {
      target: { value: '1' }
    });
    fireEvent.click(screen.getByText(/筛选/i));

    await waitFor(() => {
      expect(screen.getByTestId('dish-table')).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 DishListPage 中添加 Ant Design Form
  2. 添加筛选字段：名称、分类、状态
  3. 添加重置和筛选按钮
  4. 集成分类 API `GET /api/category` 获取分类列表
- **依赖关系**：E1.1

#### E1.3 集成菜品列表 API
- **任务描述**：获取并显示菜品数据
- **验收测试**：
  ```typescript
  test('should fetch and display dishes', async () => {
    render(<DishListPage />);
    await waitFor(() => {
      expect(screen.getByText('宫保鸡丁')).toBeInTheDocument();
    });
  });

  test('should handle image display', async () => {
    render(<DishListPage />);
    const dishRow = await screen.findByText('宫保鸡丁');
    expect(dishRow.closest('tr')).toHaveAttribute('src');
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/api/dishes.ts`
  2. 实现 `getDishes(params)` 函数调用后端 `GET /api/dish`
  3. 在 DishListPage 中加载数据
  4. 显示菜品图片
  5. 实现加载状态和错误处理
- **依赖关系**：E1.2

#### E1.4 实现菜品状态切换
- **任务描述**：添加上下架功能
- **验收测试**：
  ```typescript
  test('should show status toggle button', async () => {
    render(<DishListPage />);
    const toggleBtn = await screen.findByRole('switch', { name: /启售/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  test('should update status on toggle', async () => {
    render(<DishListPage />);
    const toggleBtn = await screen.findByRole('switch');
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText(/已停售/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在菜品表格中添加状态切换组件
  2. 集成后端 API `PUT /api/dish/{id}/status/{status}`
  3. 实现切换确认对话框
  4. 成功后更新本地数据
- **依赖关系**：E1.3

### E2. 菜品添加/编辑

#### E2.1 创建菜品表单组件
- **任务描述**：实现添加/编辑菜品的表单
- **验收测试**：
  ```typescript
  test('should render dish form', () => {
    render(<DishForm />);
    expect(screen.getByLabelText(/菜品名称/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/售价/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/分类/i)).toBeInTheDocument();
  });

  test('should validate required fields', async () => {
    render(<DishForm />);
    fireEvent.click(screen.getByText(/保存/i));
    expect(await screen.findByText(/请输入菜品名称/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Dishes/Form.tsx`
  2. 使用 Ant Design Form 组件
  3. 添加字段：名称、分类、售价、原价、描述、图片
  4. 实现表单验证
- **依赖关系**：E1.4

#### E2.2 实现图片上传功能
- **任务描述**：添加菜品图片上传
- **验收测试**：
  ```typescript
  test('should render image upload component', () => {
    render(<DishForm />);
    expect(screen.getByText(/上传图片/i)).toBeInTheDocument();
  });

  test('should preview uploaded image', async () => {
    render(<DishForm />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('image-upload');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText(/菜品图片预览/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 使用 Ant Design Upload 组件
  2. 配置图片上传到后端 `POST /api/common/upload`
  3. 实现图片预览功能
  4. 添加图片大小和格式限制
- **依赖关系**：E2.1

#### E2.3 实现口味配置
- **任务描述**：添加菜品口味设置功能
- **验收测试**：
  ```typescript
  test('should render flavor configuration', () => {
    render(<DishForm />);
    expect(screen.getByText(/口味配置/i)).toBeInTheDocument();
  });

  test('should add flavor option', async () => {
    render(<DishForm />);
    fireEvent.click(screen.getByText(/添加口味/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/口味名称/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 DishForm 中添加口味配置区域
  2. 实现动态添加/删除口味选项
  3. 每个口味选项包含：名称、是否必选、选项值
  4. 保存时将口味数据发送到后端
- **依赖关系**：E2.2

#### E2.4 实现表单提交
- **任务描述**：完成菜品保存功能
- **验收测试**：
  ```typescript
  test('should submit form on save', async () => {
    render(<DishForm />);

    fireEvent.change(screen.getByLabelText(/菜品名称/i), {
      target: { value: '新菜品' }
    });
    fireEvent.change(screen.getByLabelText(/售价/i), {
      target: { value: '28.8' }
    });

    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText(/保存成功/i)).toBeInTheDocument();
    });
  });

  test('should navigate back on cancel', () => {
    render(<DishForm />);
    fireEvent.click(screen.getByText(/取消/i));
    expect(window.location.pathname).toBe('/admin/dishes');
  });
  ```
- **实现步骤**：
  1. 在 DishForm 中实现保存逻辑
  2. 调用后端 API `POST /api/dish` 或 `PUT /api/dish/{id}`
  3. 处理保存成功/失败
  4. 成功后跳转到列表页
  5. 添加取消按钮
- **依赖关系**：E2.3

---

## Phase F: 套餐管理

### F1. 套餐列表页面

#### F1.1 创建套餐列表组件
- **任务描述**：实现套餐管理列表页面
- **验收测试**：
  ```typescript
  test('should render setmeal list', async () => {
    render(<SetmealListPage />);
    expect(await screen.findByTestId('setmeal-list')).toBeInTheDocument();
  });

  test('should display setmeal cards', async () => {
    render(<SetmealListPage />);
    expect(await screen.findByText('宫保鸡丁套餐')).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Setmeals/index.tsx`
  2. 使用 Ant Design Card 组件展示套餐
  3. 显示套餐图片、名称、价格、状态
  4. 添加添加套餐按钮
-C1.2

#### F1.2 实现套餐 **依赖关系**：筛选功能
- **任务描述**：添加套餐筛选和搜索
- **验收测试**：
  ```typescript
  test('should render filter form', () => {
    render(<SetmealListPage />);
    expect(screen.getByLabelText(/套餐名称/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/分类/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 在 SetmealListPage 中添加筛选表单
  2. 添加字段：名称、分类、状态
  3. 集成后端 API `GET /api/setmeal`
- **依赖关系**：F1.1

#### F1.3 实现套餐状态切换
- **任务描述**：添加套餐上下架功能
- **验收测试**：
  ```typescript
  test('should toggle setmeal status', async () => {
    render(<SetmealListPage />);
    const toggleBtn = await screen.findByRole('switch');
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText(/已停售/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在套餐卡片中添加状态切换
  2. 集成后端 API `PUT /api/setmeal/{id}/status/{status}`
  3. 实现状态更新
- **依赖关系**：F1.2

### F2. 套餐详情编辑

#### F2.1 创建套餐表单组件
- **任务描述**：实现套餐添加/编辑表单
- **验收测试**：
  ```typescript
  test('should render setmeal form', () => {
    render(<SetmealForm />);
    expect(screen.getByLabelText(/套餐名称/i)).toBeInTheDocument();
    expect(screen.getByText(/选择菜品/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Setmeals/Form.tsx`
  2. 添加基本字段：名称、价格、图片、描述
  3. 添加菜品选择器
- **依赖关系**：F1.3

#### F2.2 实现菜品选择器
- **任务描述**：添加选择套餐内菜品的组件
- **验收测试**：
  ```typescript
  test('should render dish selector', async () => {
    render(<SetmealForm />);
    fireEvent.click(screen.getByText(/选择菜品/i));

    await waitFor(() => {
      expect(screen.getByText(/菜品列表/i)).toBeInTheDocument();
    });
  });

  test('should add dish to setmeal', async () => {
    render(<SetmealForm />);
    fireEvent.click(screen.getByText(/选择菜品/i));
    fireEvent.click(await screen.findByText('宫保鸡丁'));
    fireEvent.click(screen.getByText(/确定/i));

    expect(screen.getByText('宫保鸡丁')).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/DishSelector.tsx`
  2. 使用 Ant Design Modal 组件
  3. 显示可选菜品列表
  4. 实现选择菜品功能
  5. 显示已选菜品列表
- **依赖关系**：F2.1

#### F2.3 实现套餐保存
- **任务描述**：完成套餐保存功能
- **验收测试**：
  ```typescript
  test('should save setmeal with dishes', async () => {
    render(<SetmealForm />);

    fireEvent.change(screen.getByLabelText(/套餐名称/i), {
      target: { value: '新套餐' }
    });

    // 添加菜品
    fireEvent.click(screen.getByText(/选择菜品/i));
    fireEvent.click(await screen.findByText('宫保鸡丁'));
    fireEvent.click(screen.getByText(/确定/i));

    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText(/保存成功/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 SetmealForm 中实现保存逻辑
  2. 调用后端 API `POST /api/setmeal` 或 `PUT /api/setmeal/{id}`
  3. 包含套餐信息和菜品列表
  4. 处理保存成功/失败
- **依赖关系**：F2.2

---

## Phase G: 分类管理

### G1. 分类树形结构

#### G1.1 创建分类树组件
- **任务描述**：实现树形分类展示
- **验收测试**：
  ```typescript
  test('should render category tree', async () => {
    render(<CategoryTreePage />);
    expect(await screen.findByTestId('category-tree')).toBeInTheDocument();
  });

  test('should display tree nodes', async () => {
    render(<CategoryTreePage />);
    expect(await screen.findByText('川菜')).toBeInTheDocument();
    expect(screen.getByText('宫保鸡丁')).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Categories/index.tsx`
  2. 使用 Ant Design Tree 组件
  3. 集成后端 API `GET /api/category`
  4. 实现树形展示
- **依赖关系**：C1.2

#### G1.2 实现分类操作功能
- **任务描述**：添加分类增删改功能
- **验收测试**：
  ```typescript
  test('should add new category', async () => {
    render(<CategoryTreePage />);
    fireEvent.click(screen.getByText(/新增分类/i));

    fireEvent.change(screen.getByLabelText(/分类名称/i), {
      target: { value: '新分类' }
    });
    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText('新分类')).toBeInTheDocument();
    });
  });

  test('should delete category', async () => {
    render(<CategoryTreePage />);
    const deleteBtn = await screen.findByRole('button', { name: /删除/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/确定删除/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 在 CategoryTreePage 中添加新增/编辑/删除按钮
  2. 创建 `src/admin/components/CategoryModal.tsx`
  3. 集成后端 API `POST /api/category`, `PUT /api/category/{id}`, `DELETE /api/category/{id}`
  4. 实现确认对话框
- **依赖关系**：G1.1

---

## Phase H: 用户管理

### H1. 用户列表页面

#### H1.1 创建用户列表组件
- **任务描述**：实现用户管理列表页面
- **验收测试**：
  ```typescript
  test('should render user list table', async () => {
    render(<UserListPage />);
    expect(await screen.findByTestId('user-table')).toBeInTheDocument();
  });

  test('should display user columns', async () => {
    render(<UserListPage />);
    const table = await screen.findByTestId('user-table');
    expect(table).toHaveTextContent(/头像/i);
    expect(table).toHaveTextContent(/昵称/i);
    expect(table).toHaveTextContent(/手机号/i);
    expect(table).toHaveTextContent(/注册时间/i);
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Users/index.tsx`
  2. 使用 Ant Design Table 组件
  3. 配置表格列：头像、昵称、手机号、订单数、消费金额、操作
  4. 集成后端 API `GET /api/user`
- **依赖关系**：C1.2

#### H1.2 实现用户筛选功能
- **任务描述**：添加用户筛选和搜索
- **验收测试**：
  ```typescript
  test('should render user filter form', () => {
    render(<UserListPage />);
    expect(screen.getByLabelText(/手机号/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/注册时间/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 在 UserListPage 中添加筛选表单
  2. 添加字段：手机号、注册时间范围、消费金额范围
  3. 实现筛选逻辑
- **依赖关系**：H1.1

#### H1.3 实现用户详情查看
- **任务描述**：添加用户详情页面
- **验收测试**：
  ```typescript
  test('should show user detail modal', async () => {
    render(<UserListPage />);
    fireEvent.click(screen.getByText(/查看/i));

    await waitFor(() => {
      expect(screen.getByText(/用户详情/i)).toBeInTheDocument();
    });
  });

  test('should display user info in modal', async () => {
    render(<UserListPage />);
    fireEvent.click(screen.getByText(/查看/i));

    expect(await screen.findByText(/昵称/i)).toBeInTheDocument();
    expect(await screen.findByText(/订单统计/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/UserDetailModal.tsx`
  2. 显示用户基本信息
  3. 显示订单统计
  4. 显示消费记录
- **依赖关系**：H1.2

---

## Phase I: 员工管理

### I1. 员工列表页面

#### I1.1 创建员工列表组件
- **任务描述**：实现员工管理列表页面
- **验收测试**：
  ```typescript
  test('should render employee list table', async () => {
    render(<EmployeeListPage />);
    expect(await screen.findByTestId('employee-table')).toBeInTheDocument();
  });

  test('should display employee columns', async () => {
    render(<EmployeeListPage />);
    const table = await screen.findByTestId('employee-table');
    expect(table).toHaveTextContent(/工号/i);
    expect(table).toHaveTextContent(/姓名/i);
    expect(table).toHaveTextContent(/部门/i);
    expect(table).toHaveTextContent(/状态/i);
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Employees/index.tsx`
  2. 使用 Ant Design Table 组件
  3. 配置表格列：工号、姓名、部门、职位、状态、操作
  4. 集成后端 API `GET /api/employee`
- **依赖关系**：C1.2

#### I1.2 实现员工添加功能
- **任务描述**：添加新增员工功能
- **验收测试**：
  ```typescript
  test('should show employee form modal', () => {
    render(<EmployeeListPage />);
    fireEvent.click(screen.getByText(/新增员工/i));

    expect(screen.getByText(/新增员工/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/姓名/i)).toBeInTheDocument();
  });

  test('should save new employee', async () => {
    render(<EmployeeListPage />);
    fireEvent.click(screen.getByText(/新增员工/i));

    fireEvent.change(screen.getByLabelText(/姓名/i), {
      target: { value: '张三' }
    });
    fireEvent.change(screen.getByLabelText(/手机号/i), {
      target: { value: '13800138000' }
    });

    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText(/保存成功/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/components/EmployeeFormModal.tsx`
  2. 添加表单字段：姓名、手机号、部门、职位
  3. 集成后端 API `POST /api/employee`
  4. 实现保存成功提示
- **依赖关系**：I1.1

#### I1.3 实现员工状态管理
- **任务描述**：添加员工启用/禁用功能
- **验收测试**：
  ```typescript
  test('should toggle employee status', async () => {
    render(<EmployeeListPage />);
    const toggleBtn = await screen.findByRole('switch');
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/确定要禁用该员工吗/i)).toBeInTheDocument();
  });

  test('should update employee status', async () => {
    render(<EmployeeListPage />);
    const toggleBtn = await screen.findByRole('switch');
    fireEvent.click(toggleBtn);
    fireEvent.click(screen.getByText(/确定/i));

    await waitFor(() => {
      expect(screen.getByText(/已禁用/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在员工表格中添加状态切换
  2. 集成后端 API `PUT /api/employee/{id}/status`
  3. 实现状态更新
- **依赖关系**：I1.2

---

## Phase J: 系统设置

### J1. 系统设置页面

#### J1.1 创建设置页面框架
- **任务描述**：实现系统设置页面
- **验收测试**：
  ```typescript
  test('should render settings page', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/系统设置/i)).toBeInTheDocument();
    expect(screen.getByText(/店铺信息/i)).toBeInTheDocument();
    expect(screen.getByText(/营业设置/i)).toBeInTheDocument();
  });
  ```
- **实现步骤**：
  1. 创建 `src/admin/pages/Settings/index.tsx`
  2. 使用 Ant Design Tabs 组件
  3. 创建标签页：店铺信息、营业设置、通知设置
- **依赖关系**：C1.2

#### J1.2 实现店铺信息设置
- **任务描述**：添加店铺信息编辑功能
- **验收测试**：
  ```typescript
  test('should render shop info form', () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/店铺名称/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/联系电话/i)).toBeInTheDocument();
  });

  test('should save shop info', async () => {
    render(<SettingsPage />);
    fireEvent.change(screen.getByLabelText(/店铺名称/i), {
      target: { value: 'EuroBite 餐厅' }
    });
    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText(/保存成功/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 Settings 页面中添加店铺信息表单
  2. 添加字段：店铺名称、联系电话、地址、Logo
  3. 集成后端 API `PUT /api/admin/settings/shop`
  4. 实现保存功能
- **依赖关系**：J1.1

#### J1.3 实现营业设置
- **任务描述**：添加营业时间和配送设置
- **验收测试**：
  ```typescript
  test('should render business hours form', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/营业时间/i)).toBeInTheDocument();
    expect(screen.getByText(/配送范围/i)).toBeInTheDocument();
  });

  test('should save business settings', async () => {
    render(<SettingsPage />);
    fireEvent.change(screen.getByLabelText(/起送金额/i), {
      target: { value: '20' }
    });
    fireEvent.click(screen.getByText(/保存/i));

    await waitFor(() => {
      expect(screen.getByText(/保存成功/i)).toBeInTheDocument();
    });
  });
  ```
- **实现步骤**：
  1. 在 Settings 页面中添加营业设置表单
  2. 添加字段：营业时间、起送金额、配送费、配送范围
  3. 集成后端 API `PUT /api/admin/settings/business`
  4. 实现保存功能
- **依赖关系**：J1.2

---

## 测试执行指南

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定文件测试
npm test AdminLoginPage.test.tsx

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

### 开发流程
1. 先编写测试用例（RED）
2. 运行测试确认失败
3. 编写实现代码（GREEN）
4. 运行测试确认通过
5. 重构代码（REFACTOR）
6. 重复步骤 1-5

### 验收标准
每个子任务完成后必须：
- ✅ 所有测试用例通过
- ✅ 代码覆盖率 ≥ 80%
- ✅ 无 TypeScript 类型错误
- ✅ ESLint 检查通过
- ✅ 手动验收通过（UI符合预期，功能正常工作）

---

**完成顺序建议**：
1. 优先完成 Phase A（基础设施）
2. 依次完成 Phase B（认证）和 Phase C（主框架）
3. 然后完成 Phase D（订单管理）和 Phase E（菜品管理）
4. 最后完成 Phase F-J（其他模块）

每个 Phase 可以并行开发，提高效率。
