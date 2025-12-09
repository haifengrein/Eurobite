# EuroBite 前端架构思考与阶段记录（ofrntend-thinking）

本文档参考 `backend-thinking.md`，记录 EuroBite 前端在各阶段的关键技术决策、取舍和设计思路，聚焦：

- 为什么选 React + Vite + TypeScript，而不是继续沿用 Vue2 / 旧静态页面；
- 为什么要做 API 契约、状态管理、路由守卫，而不仅仅是“把页面做出来”；
- 每个阶段已经完成的内容与背后考虑。

### 阅读预期与前置知识说明

假设阅读者：

- 可能是 Java / 后端 / Infra 工程师，对前端生态（React、Vite、Zustand 等）**不熟悉**；
- 但对基本 Web 概念（HTTP、REST API、会话、JSON）是熟悉的。

因此，文档会在保持技术深度的同时，简单解释前端专有名词，并尽量用“后端类比”帮助理解，例如：

- 可以把 **React 组件** 理解为“前端的 Controller + View 组合”，通过 props/state 控制 UI。
- **SPA（Single Page Application）单页应用** 类似一个长期运行的客户端；浏览器只加载一次 HTML/JS，之后的页面切换都在前端路由里完成。
- **Vite** 可以对标“前端世界的 Maven + Spring Boot Devtools”：既负责构建，又提供本地开发服务器和热更新。
- **Zustand** 可以理解为一个极简的全局状态容器，有点类似“前端版的轻量级缓存 + Session”，让多个组件共享状态而不用层层传递。

---

## Phase 1: 脚手架与基础设施 (Scaffolding & Infrastructure)

### 1. 为什么不用 Next.js，而选择 Vite + React SPA？
*   **名词解释（Next.js / SPA / SSR）:**
    *   Next.js：基于 React 的一个“全家桶”，内置服务端渲染（SSR）、路由、数据获取等能力，适合内容型网站和复杂 BFF 场景。
    *   SPA（Single Page Application）：单页应用。可以理解为“浏览器里跑的一个长期存活的客户端”，初次加载后大部分交互通过前端路由和 Ajax 完成。
    *   SSR（Server-Side Rendering）：在服务器上先把页面渲染成 HTML 再返回浏览器，提升首屏加载速度和 SEO 友好度。
*   **问题:** 2026 年欧洲前端主流中，Next.js 很流行；是否应该直接上 SSR/SSG，而不是简单 SPA？
*   **结论:** 对当前 EuroBite 的业务场景（移动优先的点餐 App），SSR 带来的 SEO/首屏收益有限，而工程复杂度（路由约束、服务端渲染、部署模式）显著增加。  
    作为个人项目，更需要展示的是：清晰的组件化、状态管理、API 协作，而不是堆叠过多框架特性。
*   **做法:**
    *   采用 Vite + React 18 + TypeScript，构建单页应用（SPA）。Vite 负责打包构建和开发服务器，React 负责组件化 UI，TypeScript 提供类型安全。
    *   开发体验上使用 Vite 的极速热更新（类似 Spring Boot devtools 热重载），减少等待时间，更有利于迭代 UI/交互。

### 2. 为什么要从 Day 1 就整合 Tailwind、ESLint、路径别名？
*   **问题:** 很多 side project 前期为了“先看到页面”，不配置任何规范，后期越写越乱，难以维护和重构。
*   **结论:** 前端工程同样需要基础设施先行，尤其是在组件/页面数量会逐渐增加的情况下。  
    Tailwind 让设计系统化，ESLint/Prettier 保证风格统一，路径别名避免相对路径地狱。
*   **做法:**
    *   在 `eurobite/frontend` 下初始化：`package.json`, `vite.config.ts`, `tsconfig*`, `tailwind.config.cjs`, `eslint.config.mjs`。
    *   使用 `@/` 作为别名，将代码分层为 `src/api`, `src/store`, `src/pages`, `src/layouts`, `src/components`。

### 3. 网络层（Axios 实例）为什么单独封装？
*   **名词解释（Axios）:** Axios 是一个 Promise 风格的 HTTP 客户端，类似前端世界的 `RestTemplate/WebClient`。
*   **问题:** 如果在每个页面直接写 `axios.get(...)`，很快会出现：
    *   各处 baseURL 不一致；
    *   Token 注入、错误处理重复；
    *   401/过期登录的处理逻辑分散。
*   **结论:** 需要一个统一的 HTTP 客户端，让“鉴权头、错误处理”成为基础设施，而不是业务分支。
*   **做法:**
    *   在 `src/lib/http.ts` 中创建 Axios 实例，从 `.env` 中读取 `VITE_API_BASE_URL`，默认指向 `http://localhost:8080/api`。
    *   请求拦截器统一附加 `Authorization: Bearer <token>` 头。
    *   响应拦截器预留 401 处理点，后续可扩展为统一跳转登录/弹出提示。

---

## Phase 2: 用户认证与路由守卫 (User Authentication)

### 1. 为什么用 Zustand 而不是 Redux Toolkit？
*   **名词解释（Zustand / Redux）:**
    *   Redux：经典的全局状态管理库，强调单一 Store + reducer，生态丰富，但样板代码较多。
    *   Zustand：极简的状态管理库，API 类似“前端版的自定义缓存容器”，更接近函数式风格。
*   **问题:** Redux Toolkit 工程化很成熟，但引入后需要额外的样板代码，对当前规模来说偏重。
*   **结论:** Zustand 在这个体量下更合适：
    *   API 简单，样板代码少；
    *   支持 hooks + 选择性订阅，易于在组件中使用；
    *   生态相对稳定。
*   **做法:**
    *   在 `src/store/userStore.ts` 使用 Zustand 管理 `user` 与 `token`。
    *   封装 `setSession`/`clearSession`，统一处理 token 的持久化（localStorage）与清退。

### 2. 为什么前端要做 `RequireAuth` 路由守卫？
*   **问题:** 仅靠后端返回 401 来「提醒用户未登录」体验很差，也容易出现“请求打了很多才发现没登录”的情况。
*   **结论:** 前端需要基于本地会话状态做一次快速的访问控制，从而：
    *   防止未登录用户访问订单、个人中心等页面；
    *   提前引导用户到登录页，而不是在每个 API 调用后才处理 401。
*   **做法:**
    *   实现 `src/components/RequireAuth.tsx`，内部读取 `useUserStore().token`，无 token 时重定向到 `/login` 并在 `location.state` 中保留来源路径。
    *   在 `App.tsx` 中将 `/orders`, `/profile`, `/checkout`, `/addresses`, `/orders/:orderId` 等路由包裹在 `RequireAuth` 里。可以类比后端的 Spring Security 拦截器链：未认证用户被统一拦截并重定向到登录页。

### 3. 登录表单为什么先做“足够简单”？
*   **问题:** 如果一开始就引入 React Hook Form + Zod，虽然很标准，但会在项目早期增加认知负担。
*   **结论:** 按 YAGNI 原则，先采用受控组件 + 简单校验（非空），等后续需求需要更多复杂校验时再引入表单库。
*   **做法:**
    *   在 `LoginPage` 中使用 `useState` 管理手机号与验证码，先实现「调用后端登录接口 → 写入 store → 跳转」的 Happy Path。
    *   将手机号格式校验/验证码发送逻辑留给后续迭代，当前重点是打通前后端认证链路。

---

## Phase 3: 菜单浏览 (Browsing Menu)

### 1. 为什么要先把“分类 + 菜品列表”的骨架拉起来？
*   **问题:** 对点餐应用来说，首页体验是核心，如果不尽早确定布局（侧边栏 + 列表），后续很容易在样式上返工。
*   **结论:** 首页应作为整体信息架构的锚点：左侧分类、右侧菜品，并预留购物车入口，这样后续购物车、结算、自适应布局才能顺利挂接。
*   **做法:**
    *   在 `HomePage` 中实现左右两栏布局：左侧为分类侧栏，右侧为菜品列表。React 组件内通过 `useState`/`useEffect` 管理数据与生命周期，类似“前端 Controller”。
    *   使用 `fetchCategories()` 和 `fetchDishesByCategory()` 封装 `/api/menu/categories` 与 `/api/menu/dishes`，将数据拉取逻辑与视图解耦。

### 2. 为什么在首页阶段就顺便初始化购物车？
*   **问题:** 购物车状态在多个页面会被用到（首页、结算、订单确认），如果每个页面自己初始化，很容易出现重复请求和状态不一致。
*   **结论:** 首页是用户进入系统后的第一个“业务聚合点”，在这里调用 `initCart()` 合理且简单。
*   **做法:**
    *   `HomePage` 的首次 `useEffect` 中并行拉取分类和初始化购物车。
    *   购物车 store 自己维护 `initialized` 标记，避免重复网络请求。

---

## Phase 4: 购物车 (Shopping Cart)

### 1. 为什么要用 Zustand Store 来管理购物车，而不是组件局部状态？
*   **问题:** 购物车信息需要展示在多个位置：
    *   首页“加入购物车”按钮；
    *   底部购物车汇总条；
    *   结算页商品列表；
    *   未来可能还有“购物车弹层”等。
*   **结论:** 购物车是跨页面的核心状态，必须放在全局 store 中管理；否则一处更新，另一处不刷新，会严重影响体验。
*   **做法:**
    *   定义 `useCartStore` 管理 `items` 及 `addDish/decreaseItem/removeItem/clearAll` 等操作。
    *   提供 `useCartSummary()` 计算总数与总价，供多个界面复用。

### 2. 为什么要做乐观更新？
*   **问题:** 每次点击“加入购物车”都要等后端返回才能更新 UI，会显得非常卡顿，尤其在移动网络环境下。
*   **结论:** 购物车天然适合乐观更新：绝大多数请求都会成功，失败的情况可以回滚，并提示用户。
*   **做法:**
    *   在 `addDish` 中先基于现有 items 计算乐观结果更新 state，再异步调用 `addCartItem`。
    *   如果请求失败，则恢复原有状态；成功则用后端返回的条目对齐（避免金额/数量偏差）。

### 3. 首页底部购物车条为什么现在只做“汇总 + 去结算”？
*   **问题:** 购物车底栏可以做得很复杂（弹层、列表、编辑等），但早期过度设计会拖慢上线节奏。
*   **结论:** MVP 阶段只需要让用户看到“当前有多少件、要付多少钱”，并能一键进入结算页即可。
*   **做法:**
    *   在 `HomePage` 的布局中增加一个固定于底部的汇总条，显示总件数与总金额，并提供“去结算”按钮跳转 `/checkout`。
    *   购物车详细编辑留给后续迭代（或放在结算页中处理）。

---

## Phase 5: 地址管理与结算 (Checkout & Address Management)

### 1. 为什么地址管理单独做一个页面，而不是塞在结算页里？
*   **问题:** 地址管理具有 CRUD 特性，UI 操作相对复杂（新增、编辑、删除、标记默认），如果全部做在结算页会极大增加页面复杂度。
*   **结论:** 将地址管理抽成“个人中心”下的一个独立页面更符合用户心智，也便于前端/后端 API 复用。
*   **做法:**
    *   创建 `AddressListPage`，挂在 `/addresses` 路由下，由 `ProfilePage` 提供入口。
    *   使用 `fetchAddresses/createAddress/updateAddress/deleteAddress` 操作 `/api/address-book` 系列接口。

### 2. 结算页的职责边界是什么？
*   **问题:** 结算页可能会被设计成“大杂烩”：编辑地址、修改购物车、选择支付方式、展示优惠券等，这会让实现非常膨胀。
*   **结论:** 当前阶段结算页只负责：
    *   展示「当前购物车中的商品」；
    *   选择「已有收货地址」；
    *   输入简单备注；
    *   提交订单并跳转订单列表。
*   **做法:**
    *   在 `CheckoutPage`：
        *   从 `useCartStore` 读取购物车内容与总金额；
        *   使用 `fetchAddresses` 拉取地址列表并选择其中一条；
        *   调用 `submitOrder` 完成下单，并在成功后清空购物车 + `navigate("/orders")`，同时通过全局 Toast 提示“下单成功”。

---

## Phase 7: 错误处理、Skeleton 与代码分割 (UX & Bundle Optimizations)

### 1. 为什么要有统一的 Toast 提示系统？
*   **问题:** 如果每个页面都用 `alert` 或各自维护一套错误提示，不仅体验割裂，还会导致重复代码和样式不一致。
*   **结论:** 前端也需要一个“集中式错误反馈通道”，类似后端统一的日志/异常处理器。  
    Toast 适合用于短暂的成功/失败反馈，不打断用户流程。
*   **做法:**
    *   实现 `ToastProvider` 组件，用 React Context 暴露 `showToast(message)`；在 `main.tsx` 顶层包裹整个应用。
    *   在登录、下单、加载失败等关键点调用 `showToast` 显示 3 秒的顶部提示。
    *   Axios 拦截器保持“透明”，只负责返回错误，由调用者决定是否展示 toast，这样不会把 UI 逻辑绑死在 HTTP 层。

### 2. 为什么要做 Skeleton 而不仅仅是“加载中”文字？
*   **问题:** 用户在移动端等待数据时，如果只看到一行“加载中...”，很难感知布局结构，也容易“以为卡住了”。
*   **结论:** Skeleton（骨架屏）可以提前展示列表的占位轮廓，让用户知道“这里会出现什么内容”，提升主观性能体验。
*   **做法:**
    *   提供一个简单的 `Skeleton` 组件（灰色块 + `animate-pulse` 动画）。
    *   在 `HomePage` 和 `OrdersPage` 的加载状态下，用多个 Skeleton 卡片代替纯文字提示。

### 3. 为什么要对路由做懒加载（代码分割）？
*   **问题:** 随着页面增多，如果把所有页面都打进首屏 bundle，会导致首次加载 JS 体积过大，在弱网环境下体验明显变差。
*   **结论:** 路由懒加载是前端 SPA 的基础优化手段，等价于“按需加载 Controller/页面类”，不会改变业务逻辑，却能显著优化首屏加载时间。
*   **做法:**
    *   在 `App.tsx` 中使用 `React.lazy` + `Suspense` 动态导入各个 Page 组件。
    *   外层用 `Suspense` 提供一个通用的 fallback（“页面加载中...”），在真正代码下载完成前显示。
    *   这样首页不需要加载订单详情、地址管理等不在当前路由上的页面代码。

---

## Phase 6: 订单中心 (Order History & Detail)

### 1. 为什么订单列表要支持状态筛选？
*   **问题:** 将所有订单混在一起列表展示，对用户来说阅读负担很大，也不符合真实外卖 App 的体验。
*   **结论:** 即便是个人项目，也应该体现对用户体验的基本尊重：区分“进行中”和“历史订单”。
*   **做法:**
    *   在 `OrdersPage` 中添加顶部状态筛选标签（全部、待处理、配送中、已完成）。
    *   调用 `fetchMyOrders({ status })`，按状态过滤结果。

### 2. 为什么订单详情单独出一个页面？
*   **问题:** 订单详情信息（收货地址、菜品明细、时间线）较多，如果在列表中强行展开，会让视觉层级混乱。
*   **结论:** 详情页是订单中心的自然延伸，用户可以从列表点击进入详细信息，这也是大部分实际产品的设计。
*   **做法:**
    *   在 `OrderDetailPage` 中，通过路由参数 `orderId` 调用 `fetchOrderDetail`。
    *   分块展示：基础信息（编号、时间、状态、金额）、收货信息、菜品明细。
    *   提供“返回”按钮返回列表，增强可用性。

---

## 总结

到当前为止，EuroBite 前端已经完成从 Phase 1–6 的核心实现，形成了一个完整的 C 端用户闭环：

- 登录 → 菜单浏览 → 加入购物车 → 结算 → 下单 → 查看订单列表/详情；
- 所有接口与后端通过 `docs/api-contract-frontend.md` 对齐，确保契约一致；
- 状态管理（用户/购物车）集中在 Zustand Store 中，页面只负责渲染与交互。

后续前端工作将主要聚焦于：

- Phase 7 的体验打磨（Skeleton、Toast、懒加载、PWA）；
- 根据后端实现情况，补充错误处理与边界状态；
- 必要时增加少量前端测试，提升工程说服力。  
