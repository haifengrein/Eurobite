# EuroBite 后端架构思考与决策记录

本文档记录了 EuroBite 项目重构过程中的关键技术决策。我们假设读者具备通用的软件工程知识，但可能不熟悉现代 Java/Spring Boot 生态。因此，每个决策都包含了背景上下文（Context）。

## 如何阅读本文（给没写过 Spring Boot 的人）

- 可以把 **Spring Boot** 理解成 Java 世界的 **“Django / Rails / NestJS”**：  
  - 它帮你启动 Web 服务器、注入依赖、加载配置，不需要你从 Servlet/Tomcat 这种底层 API 开始写。  
  - 你可以只关注“业务代码”（Controller / Service / Repository），而不是“如何起 HTTP Server”。  
- 可以把 **DDD 里的几个词**先粗暴类比一下：  
  - **Bounded Context（限界上下文）** ≈ 一个中等规模的“子系统/模块”，例如“员工管理”“分类管理”“订单系统”。  
  - **Aggregate（聚合）** ≈ 一组强耦合的领域对象 + 不变量，例如“菜品 + 口味”这一个整体。  
  - **Aggregate Root（聚合根）** ≈ 这个整体对外的唯一入口（类似数据库里那张“主表”）。  
  - **Repository（仓储）** ≈ 按聚合维度抽象的持久化接口，内部才知道用 JPA/MyBatis/SQL。  
  - **Application Service** ≈ 编排用例（Use Case）的地方，例如“下单”“登录”，它会调用多个 Repository/Domain Service。  

  这些只是抽象概念，**真正对你有价值的是：在 EuroBite 项目里，它们具体对应哪些包和类、为什么这么拆**：

  - **Shared Kernel（共享内核）在 EuroBite 里的落点**  
    - 包：`com.eurobite.common`。  
    - 主要类：  
      - 通用响应与错误模型：`R<T>` (`common.model.R`)、`GlobalExceptionHandler`、`CustomException`。  
      - 审计与基础实体：`BaseEntity` (`common.entity.BaseEntity`)、`JpaConfig`。  
      - 基础设施配置：`SecurityConfig`、`JacksonConfig`、`OpenApiConfig`。  
      - 通用技术服务：`JwtUtil`、`FileStorageService`、`LocalFileStorageService`、`CommonController`（文件上传下载）。  
    - 设计意图：这里聚合的是“所有上下文都需要共享”的通用能力和模型，它们不属于某一个业务上下文（员工/菜品/订单），而是整个系统的“共用语言 + 技术底座”。

  - **Bounded Context（限界上下文）对应哪些模块？**  
    - Employee Context（员工与后台登录）：  
      - 包：`com.eurobite.modules.employee`。  
      - 对应子任务：`Phase 2` 里“员工与安全”的所有任务。  
      - 该上下文内部自洽：聚合根 `Employee`、仓储 `EmployeeRepository`、应用服务 `EmployeeService`、DTO `EmployeeDTO`/`LoginDTO`、映射器 `EmployeeMapper`、API 适配层 `EmployeeAuthController`/`EmployeeController`。  
    - Category Context（分类管理）：  
      - 包：`com.eurobite.modules.category`。  
      - 聚焦“分类”这一小块业务：实体 `Category`、仓储 `CategoryRepository`、应用服务 `CategoryService`、API `CategoryController`。  
    - Dish / Setmeal / User / Order Context：  
      - 目前在代码中还未全部落地实体类，但在 `task.md` 中已经通过 Phase 4–7 明确了边界：  
        - Dish Context：围绕 `Dish` + `DishFlavor` 聚合，以及对外暴露的 `DishModuleApi`。  
        - Setmeal Context：围绕 `Setmeal` + `SetmealDish` 聚合。  
        - User & GDPR Context：围绕 `User` + `AddressBook`，以及导出/删除的隐私用例。  
        - Order Context：围绕 `ShoppingCart` + `Orders` + `OrderDetail`，以及对 Dish Context 的查询依赖。  
      - 这些上下文最终会对应 `com.eurobite.modules.dish` / `setmeal` / `user` / `order` 等包。

  - **Aggregate / Aggregate Root 在实体层面的映射**  
    - 已实现的简单聚合：  
      - 员工聚合：根是 `Employee` (`modules.employee.entity.Employee`)，当前没有子实体，是一个“单实体聚合”。  
      - 分类聚合：根是 `Category` (`modules.category.entity.Category`)，同样是单实体聚合。  
    - 规划中的复杂聚合（已经在设计上按聚合概念建模）：  
      - Dish 聚合：  
        - 聚合根：`Dish`（未来的 `modules.dish.entity.Dish`），承载“不变量”，比如“价格不能为负”“所属分类必须存在”。  
        - 子实体：`DishFlavor`，只有跟随 Dish 才有意义，不会有“跨 Dish 的口味查询”。  
      - Setmeal 聚合：根为 `Setmeal`，子实体为 `SetmealDish`，表示组合关系。  
      - Order 聚合：根为 `Orders`，子实体为 `OrderDetail`；ShoppingCart 虽是独立表，但从业务规则上属于同一上下文。  
      - User 聚合：根为 `User`，子实体为 `AddressBook`（地址簿）。  
    - 设计规则：  
      - 聚合外部只能通过聚合根来修改内部状态（例如未来只允许通过 `DishService.saveWithFlavor` 一次性保存菜品及其口味），避免外部直接对 `DishFlavorRepository` 等子实体进行“局部操作”破坏不变量。

  - **Repository 对应哪些类？为什么按聚合维度拆？**  
    - 已实现：  
      - `EmployeeRepository`：只负责 `Employee` 聚合的持久化。  
      - `CategoryRepository`：只负责 `Category` 聚合的持久化。  
    - 规划中：  
      - `DishRepository`、`DishFlavorRepository`、`SetmealRepository`、`SetmealDishRepository`、`UserRepository`、`AddressBookRepository`、`OrderRepository`、`ShoppingCartRepository` 等，将按照聚合边界划分。  
    - 设计意图：  
      - Repository 暴露的是“以聚合为单位”的查询和持久化接口，而不是“任意表操作”；  
      - 例如未来 `OrderService` 只依赖 `OrderRepository` + `ShoppingCartRepository` + `DishModuleApi`，而不是任意去用 JPA 的 EntityManager 操作每张表。

  - **Application Service 在代码里具体是哪些类？**  
    - 已实现：  
      - `EmployeeService`：封装了“登录”“新增员工”“分页查询”“更新”等用例的编排逻辑，它不会关心 JWT 的具体签名算法，而是依赖 `JwtUtil` 和 `PasswordEncoder` 这类基础设施/领域服务。  
      - `CategoryService`：封装了“新增分类”“删除分类（含业务校验）”“列表查询”等用例。  
    - 规划中：  
      - `DishService`：负责 `saveWithFlavor` 等涉及 Dish 聚合内部多个表的事务性操作，并负责触发缓存失效。  
      - `SetmealService`：负责启停售校验、组合保存套餐等用例。  
      - `UserService` / `AddressBookService`：负责手机号登录、地址管理、GDPR 导出/删除的业务流程。  
      - `OrderService` / `ShoppingCartService`：负责购物车增删改查、订单提交等用例，并通过 `DishModuleApi` 查询菜品价格。  
    - 这一层在代码结构上表现为 `modules.*.service.*`，刚好对应 DDD 里的 Application Service 概念：  
      - 它们会调用 Repository / 领域服务（如 `JwtUtil`、`FileStorageService`），但自身不直接做持久化细节或加密细节。

  - **Controller 在本项目中的定位**  
    - 类如：`EmployeeAuthController`、`EmployeeController`、`CategoryController`、`CommonController`。  
    - 它们不是 DDD 意义上的 Application Service，而是 API/接口层的“适配器”：负责解析 HTTP 请求（URL、参数、Body）、调用 Application Service，并把结果包装成 `R<T>` 返回。  
    - 这样分层的好处：将来如果改成 gRPC / 消息队列 / GraphQL，只需替换 Controller 这一层的适配器，底层的 Application Service 逻辑可以保持不变。
- 本文中的模式基本都是：  
  - **Context（背景）**：解释这块问题在通用 Web/后端开发里是什么；  
  - **Solution（做法）**：在 EuroBite 里具体用哪些技术/代码来解决；  
  - **Why（决策理由）**：这个做法在工程上比常见替代方案好在哪里；  
  - **面试视角**：列出若干常见的面试追问点，以及你可以围绕哪些关键字来展开回答。

### 从业务需求到 DDD 设计：以 Dish / Setmeal / User / Order 为例

上面的映射回答了“**现在项目长什么样**”，但更关键的问题是：**我们是如何从业务出发一步步推导出这些上下文、聚合和类的？**

这里用 Phase 4–7 的业务做一个完整的思考链条示例，方便你在面试中按“过程”来讲，而不是只背结果。

1. **第一步：收集业务场景，不急着画类图**

   我们先只用自然语言罗列出**用户故事**，不想着代码和数据库：

   - 后台员工：  
     - 登录后台系统；  
     - 维护菜品分类；  
     - 创建 / 修改菜品；  
     - 创建 / 修改套餐；  
     - 上架 / 下架菜品和套餐；  
     - 查看订单并处理（接单、出餐）。  
   - C 端用户：  
     - 使用手机号登录；  
     - 维护自己的收货地址；  
     - 浏览菜单（菜品 + 套餐）；  
     - 把菜品/套餐加入购物车；  
     - 提交订单并支付；  
     - 查看自己的历史订单；  
     - 在 GDPR 语境下导出 / 删除自己的个人数据。

   这一步刻意不涉及任何技术词（Controller/Repository），只关心业务动作。

2. **第二步：抽取领域名词，初步识别候选模型**

   从上述故事中，我们抽取**名词**和**动词**，名词往往对应实体/值对象，动词对应用例或领域服务：

   - 名词：Employee, Category, Dish, DishFlavor, Setmeal, SetmealDish, User, AddressBook, ShoppingCart, Orders, OrderDetail。  
   - 动词：登录、浏览菜单、加入购物车、提交订单、维护地址、导出数据、删除账户、上架/下架等。

   这个列表就是我们 DDD 建模的“原材料”，接下来的问题是：**如何分上下文、如何分聚合？**

3. **第三步：按“业务边界”和“变化节奏”划分 Bounded Context**

   我们不是从技术层（controller/service/dao）开始分，而是问：

   - 哪些模型是只在“后台运营视角”出现的？——Employee、后台管理用的 Category/Dish/Setmeal。  
   - 哪些模型是只在“C 端用户视角”出现的？——User、AddressBook、ShoppingCart、Orders、OrderDetail。  
   - 哪些模型在两个视角中都出现？——Dish、Setmeal（后台维护，C 端浏览和下单）。

   据此，我们做了这样的上下文划分决策：

   - **Employee Context**：只关心后台员工（权限、登录、账号状态），完全不触及 C 端用户逻辑。  
   - **Category Context**：只负责“一棵分类树”的管理（菜品/套餐的分类），不掺杂价格、库存等逻辑。  
   - **Dish / Setmeal Context**：  
     - Dish Context：围绕“菜品及其口味”的一致性规则（价格、状态、分类、口味列表）。  
     - Setmeal Context：围绕“套餐与内部菜品组合”的一致性规则（组合关系、总价、可售状态）。  
   - **User & GDPR Context**：围绕 C 端用户身份和地址簿，以及 GDPR 导出/删除约束。  
   - **Order Context**：围绕购物车、订单、订单明细，承担“结算”这一核心用例。

   这里的关键思考点是：**每个 Context 内部的模型变化高度相关，而不同 Context 的变化尽量相互独立**。比如：

   - 我们可以重构 Dish 的内部结构，而不影响 Employee Context 的登录逻辑；  
   - GDPR 规则的调整，应该只波及 User & GDPR Context + Order Context，而不影响后台的 Employee/Category 代码。

4. **第四步：在每个上下文内部识别聚合和聚合根**

   接下来，我们进入每个 Bounded Context 内部，问两个问题：

   - 哪些对象在业务上必须“同时改动”？（事务一致性）  
   - 哪些对象离开另一个就没有意义？（强依赖关系）

   以几个核心聚合为例：

   - **Dish 聚合（Dish + DishFlavor）：**  
     - 业务观察：用户从来不是“单独选择一个口味”，而是选择一个菜品后，在这个菜品下挑选口味组合。  
     - 故障场景：如果先写入 Dish，再写入 DishFlavor，中间失败会留下“没有口味的菜品”，这是不允许的。  
     - 结论：用 `Dish` 作为聚合根，`DishFlavor` 作为内部子实体，所有持久化操作通过 `DishService.saveWithFlavor` 完成，并用事务保证一起成功/一起失败。

   - **Setmeal 聚合（Setmeal + SetmealDish）：**  
     - 业务观察：套餐是菜单上的“一行产品”，内部包含多个菜品及份数；用户不会单独操作 `SetmealDish`。  
     - 不变量：套餐的可售状态依赖于内部菜品的状态（如果里面有停售菜品，套餐不能启售）。  
     - 结论：`Setmeal` 是聚合根，`SetmealDish` 是内部组合关系；启/停售逻辑放在 Setmeal 聚合所在的 Service 中，而不是散落在外层。

   - **Order 聚合（Orders + OrderDetail）：**  
     - 业务观察：一个订单包含多条明细（菜品/套餐 + 数量 + 金额），任何一条明细脱离订单都没有意义。  
     - 不变量：订单金额 = 所有明细金额之和；订单状态与支付状态、配送状态有固定的状态机。  
     - 结论：`Orders` 是聚合根，`OrderDetail` 为内部子实体，`OrderService.submit` 负责在一个事务内完成：读取购物车 → 调用 DishModuleApi 获取实时价格 → 写入订单表和明细表 → 清空购物车。

   - **User 聚合（User + AddressBook）：**  
     - 业务观察：地址簿只附着在用户身上，不能有“系统里一条孤立的地址记录”。  
     - 不变量：同一用户最多一个默认地址；删除用户时，其地址簿如何处理需要 GDPR 规则参与。  
     - 结论：`User` 作为聚合根，`AddressBook` 为子实体，通过 `UserService` / `AddressBookService` 编排相关用例。

5. **第五步：设计上下文间的交互方式（不要跨 Context 乱用 Repository）**

   切上下文和聚合之后，下一个关键问题是：**上下文之间怎么协作？**

   - 典型例子是 Order ↔ Dish：订单需要知道菜品当前价格/名称，但我们不希望 OrderContext 直接依赖 Dish 的 Repository（那样会让两个上下文紧耦合）。  
   - 因此在 Dish Context 中，我们设计了一个“对外 API 接口”——`DishModuleApi`（在 `task.md` 的 Phase 4.3 中明确），其他上下文只能通过这个接口获取 Dish 的视图和业务能力。  
   - 对 Order 来说，只依赖 `DishModuleApi`，而不关心 Dish 的内部表结构和聚合细节；将来即便 Dish 拆成独立微服务或改用别的存储，Order 的依赖关系仍然稳定。

   同理：

   - Category 只通过自己的 Service 管理分类，不允许其他上下文绕过它直接改分类表；  
   - User & GDPR 的删除接口需要通知 Order Context 做标记或脱敏，而不是让 Order 直接删用户表的数据。

6. **第六步：把上述 DDD 设计映射到 Spring Boot 的代码结构**

   最后一步才是“落到具体框架”：

   - Bounded Context → `com.eurobite.modules.*` 包：  
     - `modules.employee`、`modules.category` 已经实现，Dish/Setmeal/User/Order 上下文则在任务清单中分阶段落地。  
   - Aggregate / Aggregate Root → JPA Entity：  
     - 已有的 `Employee`、`Category`，以及规划中的 `Dish`、`DishFlavor`、`Setmeal`、`SetmealDish`、`User`、`AddressBook`、`Orders`、`OrderDetail`。  
   - Repository → Spring Data JPA 接口：  
     - 按聚合划分的 `EmployeeRepository`、`CategoryRepository`，未来的 Dish/Order 等仓储同理。  
   - Application Service → `modules.*.service.*`：  
     - 如 `EmployeeService`、`CategoryService`，以及规划中的 `DishService`、`OrderService` 等，负责用例编排 + 调用 Repository/领域服务。  
   - Interface Adapter → Controller：  
     - 如 `EmployeeAuthController`、`EmployeeController`、`CategoryController` 等，只负责 HTTP 适配和响应包装。

   整个过程的关键是：**从业务故事出发识别名词和动词 → 按业务边界和变化节奏切上下文 → 在上下文内部根据不变量和事务边界识别聚合 → 设计上下文间的调用规则 → 最后才落到 Spring Boot 的包结构和具体类上。**

   在面试里，你可以按这 6 步回放整个思考过程，而不是只描述最终的包名和类名。

---

## Phase 0: 基础设施与骨架 (Infrastructure & Scaffolding)

### 1. 为什么在写代码前先搞 Docker Compose？

*   **Context (背景):**
    *   现代 Web 应用通常依赖数据库（如 PostgreSQL）和缓存（如 Redis）。
    *   在传统开发中，开发者需要在自己的电脑上安装这些软件。但这会导致版本不一致（如开发者 A 用 MySQL 5.7，开发者 B 用 8.0），造成“在我机器上能跑，在别人机器上报错”的经典困境。
    *   如果你没用过 Docker，可以先把它理解成“比虚拟机轻量得多的小型隔离环境”：我们在镜像里预装好 Postgres/Redis，谁跑这个镜像，谁就拥有一套完全一样的依赖环境。
    *   `docker-compose` 则是一个“编排文件”，用 YAML 把多个容器（数据库、缓存、前端等）的镜像、端口、环境变量、数据卷写清楚，相当于把“如何启动一整套开发环境”这个知识，变成了可以版本管理的代码。
*   **Solution (做法):**
    *   我们编写了一个 `docker-compose.yml` 文件，定义了项目所需的所有外部服务（Postgres 16, Redis 7）。
*   **Why (决策理由):**
    *   **Infrastructure as Code (IaC):** 开发环境被代码化了。任何新加入的开发者只需运行一条命令 `docker-compose up`，就能获得与生产环境完全一致的基础设施，无需手动安装任何中间件。

#### 面试视角（可能被问的问题）

- **问：为什么要用 Docker Compose，而不是让每个人本地装一个 Postgres/Redis？**  
  - 可以从三个点回答：  
    - 版本锁定：`docker-compose.yml` 里写死镜像版本（比如 `postgres:16-alpine`），避免“我用 14，你用 16”导致的不可重现 bug。  
    - 一致性：开发 / 测试 / CI 甚至生产环境可以用相同的镜像组合，减少“环境相关”的问题。  
    - 上手成本：新人只要装 Docker，就能一键拉起全套依赖服务。
- **问：如果不用 Docker Compose，还有什么替代方案？为什么没选？**  
  - 手工安装：不可复制、难以记录依赖版本。  
  - 云服务直连：本地开发直接连云上数据库，有安全风险、成本高、网络延迟大。  
  - 你可以强调：在个人/小团队项目中，Compose 是投入产出比最高的方案。

### 2. 为什么引入 Maven Wrapper (`mvnw`)？

*   **Context (背景):**
    *   Java 项目通常使用 Maven 或 Gradle 进行构建（编译、运行测试、打包）。
    *   如果项目只提供 `pom.xml`（Maven 配置文件），它假设你的电脑上已经安装了 Maven 工具。但如果你的 Maven 版本过老（如 3.6），可能无法编译使用了新插件的项目。
    *   对没接触过 Java 构建工具的人，可以把 Maven 看成 Java 世界的 `npm` / `pip` + 构建脚本的结合体：它既负责拉依赖（jar 包），也负责编译、打包、运行测试。
    *   不同版本的 Maven 在插件支持、JDK 兼容性上可能有差异，所以“固定版本的构建工具”本身也是系统的一部分，而不应该默认为开发者已经安装好了正确版本。
*   **Solution (做法):**
    *   我们在项目中内置了 Maven Wrapper（即 `mvnw` 脚本）。
*   **Why (决策理由):**
    *   **自包含构建:** 运行 `./mvnw clean install` 时，脚本会自动下载指定版本（如 3.9.x）的 Maven 到项目目录下，然后用它来构建。这保证了无论在谁的电脑上（包括 CI/CD 服务器），构建使用的工具链都是完全一致的。

#### 面试视角（可能被问的问题）

- **问：Maven Wrapper 和“全局安装 Maven”有什么本质区别？**  
  - 全局 Maven：每个人、本地/CI 上的版本可能不同；  
  - Wrapper：项目自己携带构建工具的“版本约束”，整个团队的构建行为可重复。  
- **问：如果是 Gradle 或 Node 项目，你会对应用什么手段？**  
  - 可以提到 Gradle Wrapper、Node 里的 `corepack` / `npm version` 锁定、`pnpm`/`yarn` 的 lockfile 等，展示你对“可重复构建”的整体认识。

---

## Phase 1: 共享内核 (Shared Kernel)

### 1. 为什么要先做统一响应 (`R<T>`) 和全局异常处理？

*   **Context (背景):**
    *   **前端解析困境:** 默认情况下，Spring Boot 成功时返回 JSON 数据，失败时（抛出异常）返回一个 HTML 格式的错误页或者一个包含 Java 堆栈信息的 JSON。前端代码很难统一处理这种“时而 JSON，时而 HTML”的响应，导致用户体验割裂（比如直接把报错代码弹窗给用户看）。
    *   **安全隐患:** 如果后端发生空指针异常 (NPE) 并直接抛出，默认的错误响应会包含详细的 `stackTrace`（代码行号、类名）。这相当于把后端的内部结构完全暴露给了潜在的攻击者，是严重的安全漏洞。
    *   对没有 Spring 经验的读者，可以简单理解：如果不做统一约定，Spring 在不同异常情况下会“各自为战”，有时给你 JSON，有时给你一整页 HTML 错误页面，调用方需要针对每种情况写独立的解析逻辑。
    *   在一个前后端分离的系统里，我们更希望后端像一个“稳定的 API 产品”——不管内部发生什么异常，网络层面永远只返回一种格式，让调用方只关心业务语义。
*   **Solution (做法):**
    *   我们定义了一个泛型类 `R<T>`，强制所有 API（无论成功还是失败）都返回固定的 JSON 结构：`{ code: Integer, msg: String, data: T }`。
    *   我们使用 `@RestControllerAdvice` 编写全局异常处理器，捕获所有未处理的异常，并将其转化为 `R.error("未知错误")` 格式返回，同时在后台记录真实日志。
*   **Why (决策理由):**
    *   **一致性:** 前端只需要判断 `code === 0` 即可，逻辑极其简化。
    *   **安全性:** 彻底屏蔽了后端实现细节，攻击者无法通过错误信息推断系统架构。

### 2. 为什么引入 JPA Auditing 基础？

*   **Context (背景):**
    *   **审计需求:** 在企业级应用中，为了追踪数据变更历史，几乎每张表都需要 `create_time`, `update_time`, `create_user`, `update_user` 这四个审计字段。
    *   **人为疏忽:** 如果依赖开发者在每次 `save()` 前手动写代码 `user.setCreateTime(now())`，不仅代码极其冗余，而且很容易被遗忘。一旦漏写，数据库里就会出现 `null` 的时间戳，导致数据审计功能失效，甚至引发业务逻辑错误。
    *   如果你没用过 ORM，可以这样理解：JPA 就是帮你在“Java 对象”和“数据库表”之间做映射的框架（类似 Django ORM、ActiveRecord），Auditing 是它提供的一种钩子，在插入/更新时自动填充审计字段。
    *   在真实项目中，“谁在什么时候改了哪条数据”往往是合规、审计、排查线上问题的关键线索，这不是锦上添花，而是业务必须。
*   **Solution (做法):**
    *   我们定义了一个抽象基类 `BaseEntity`，利用 JPA 的 `@CreatedDate` 和 `@LastModifiedDate` 注解。
    *   启用了 Spring Data JPA 的自动审计功能 (`@EnableJpaAuditing`)。
*   **Why (决策理由):**
    *   **框架级保证:** 将“维护审计字段”的责任从“开发者”转移给了“框架”。框架永远不会忘记，也不会写错，从而从根本上保证了审计数据的完整性和一致性。

### 3. 为什么必须做 JSON 序列化修正 (`JacksonConfig`)？

*   **Context (背景):**
    *   **时间格式:** Java 的 `LocalDateTime` 对象默认被序列化为数组 `[2025, 12, 8, 10, 0]`，这对前端处理很不友好。标准做法是 ISO 字符串 `"2025-12-08 10:00:00"`。
    *   **精度丢失:** Java 的 `Long` 类型是 64 位整数（最大值约 922亿亿）。而 JavaScript 的 `Number` 类型遵循 IEEE 754 标准，其安全整数范围只有 53 位（约 9千万亿）。
    *   **灾难现场:** 当我们使用“雪花算法”生成 19 位 ID（如 `1234567890123456789`）并传给前端时，JS 会因为精度溢出将其自动四舍五入为 `1234567890123456800`。这会导致前端传回的 ID 与数据库不匹配，产生“找不到记录”的诡异 Bug。
    *   Jackson 是 Spring Boot 默认使用的 JSON 序列化库，你可以把它理解为 Java 里的 `JSON.stringify/parse` 实现。我们通过集中配置它的行为，来约束“所有接口返回的 JSON 长什么样”，而不是在每个接口里零散地做转换。
*   **Solution (做法):**
    *   配置 Jackson，告诉它：**只要遇到 `Long` 类型，就把它序列化为 String**（加双引号）。
    *   对于前端来说，`"123456..."` 是一个字符串，不会丢失精度，传回后端时 Jackson 会自动转回 Long。
*   **Why (决策理由):**
    *   **预防胜于治疗:** 这个问题极其隐蔽，往往在上线后 ID 增长到一定长度才爆发。在项目初期通过全局配置解决，是一劳永逸的最佳实践。

### 4. 为什么要引入 Swagger UI (API Documentation)？

*   **Context (背景):**
    *   **前后端协作痛点:** 后端改了接口参数，忘了通知前端；或者后端只给了口头说明，前端理解偏差。这种“沟通噪音”是开发效率低下的主要原因。
    *   **文档腐烂:** 传统的 Word/Wiki 文档需要人工维护。代码变了，文档没变，文档就变成了“谎言”。
    *   对没有 Spring 经验的同学，可以粗略地把 Swagger UI 看成“后端自动生成的 Postman 集合”：它根据代码自动列出所有接口、入参和出参，并允许你在浏览器里直接发请求验证。
    *   OpenAPI（原 Swagger 规范）本质上是一份结构化的“接口清单”，很多工具（前端代码生成、Mock 服务、API 网关）都可以基于它自动工作。
*   **Solution (做法):**
    *   引入 `springdoc-openapi`。它会实时扫描代码中的注解，自动生成 OpenAPI 规范文档。
    *   启用 Swagger UI，提供一个可交互的网页。
*   **Why (决策理由):**
    *   **Single Source of Truth (唯一真理源):** 代码就是文档。只要代码编译通过，文档就是最新的。
    *   **提升DX (开发者体验):** 前端工程师可以直接在 Swagger 页面上“Try it out”，拿到真实的 JSON 响应，甚至不需要后端部署到公网。

### 5. 为什么建立 `AbstractIntegrationTest` (Testcontainers)？

*   **Context (背景):**
    *   **Mock 的局限:** 单元测试中我们通常 Mock 掉数据库。但这无法验证 SQL 语句是否写错，也无法验证事务是否生效。
    *   **H2 的陷阱:** 为了做集成测试，过去常使用 H2 内存数据库。但 H2 只是**模拟** SQL 标准，它不支持 PostgreSQL 的许多高级特性（如 JSONB, PostGIS）。这导致了一个经典问题：**“测试通过了，上线却挂了”**（因为生产库是 Postgres）。
    *   如果你没听过 Testcontainers，可以把它理解为“测试代码在运行时，临时拉起一整套 Docker 依赖环境”：测试结束后容器自动销毁，不污染本机，也不需要你提前装好数据库。
*   **Solution (做法):**
    *   使用 **Testcontainers**。它会在运行测试的瞬间，利用 Docker API 临时启动一个真实的 PostgreSQL 容器，测试跑完自动销毁。
    *   我们封装了一个基类 `AbstractIntegrationTest` 来复用这个容器配置。
*   **Why (决策理由):**
    *   **环境保真度:** 这确保了测试环境与生产环境（都是 Postgres）完全一致。这是 2026+ 高质量 Java 项目的标准实践。

### 6. 为什么集成测试重构为手动管理容器生命周期？(解决 HikariPool 连接关闭问题)

*   **Context (背景):**
    *   **问题现象:** 当我们运行多个集成测试类（`./mvnw test`）时，日志中随机出现 `HikariPool-1 - Failed to validate connection... (This connection has been closed)`，导致测试失败。
    *   **根因分析:** Spring 的测试框架（TestContext Framework）会缓存 ApplicationContext。但如果不同的测试类有不同的配置（例如某个类用了 `@MockBean` 或不同的 Profile），Spring 就被迫**关闭当前 Context 并启动一个新的**。
    *   **冲突点:** 我们之前的 `AbstractIntegrationTest` 使用了 `static` 的容器变量配合 `@ServiceConnection`。当 Spring Context 重启时，它会自动关闭与之绑定的 `@ServiceConnection` 资源（即断开数据库连接）。但因为容器变量是 `static` 的，JVM 并没有销毁容器实例。
    *   **结果:** 下一个测试类启动新的 Spring Context 时，试图复用那个“看起来还在运行”的静态容器，但底层的连接池已经被上一个 Context 关闭了，导致连接失效。
*   **Solution (做法):**
    *   **手动单例模式 (Manual Singleton Pattern):** 我们去掉了 `@Testcontainers` 和 `@ServiceConnection` 注解。
    *   改为在 `static {}` 静态代码块中手动 `start()` 容器，确保容器在 JVM 层面只启动一次，且生命周期完全独立于 Spring Context。
    *   使用 `@DynamicPropertySource` 显式注入数据库连接属性。
*   **Why (决策理由):**
    *   **生命周期解耦:** 无论 Spring Context 重启多少次（因为测试配置差异），Docker 容器始终保持运行，不会被 Spring 的生命周期回调误杀。
    *   **属性动态注入:** 每次 Spring Context 启动时，`@DynamicPropertySource` 都会重新运行，把当前活着的容器的 JDBC URL 注入给新的 Environment，保证连接总是新鲜有效的。

#### 面试视角

- **问：Spring Boot 测试中 `@MockBean` 会导致什么性能问题？**
  - 会导致 ApplicationContext 无法复用（Dirty Context），必须重启。在大工程里，这会让测试时间成倍增加。
- **问：Testcontainers 的 `@ServiceConnection` 总是最好的选择吗？**
  - 在单个测试类里很好用。但在复杂的、涉及 Context 重启的集成测试套件中，手动管理静态容器（Singleton）往往更稳定。

---

## Phase 2: 领域层 - 员工与安全 (Domain - Employee & Security)

### 1. 为什么要使用 Flyway 而不是 Hibernate 自动建表？

*   **Context (背景):**
    *   Hibernate 有一个 `ddl-auto=update` 配置，可以在启动时自动根据 Java Entity 修改数据库表结构。这在开发时很方便。
    *   **问题:** 在生产环境中，自动修改表结构极其危险（可能导致数据丢失、锁表）。而且，它无法处理“重命名列”、“数据迁移”等复杂场景。
    *   这里的 Hibernate 可以看作 JPA 的一个具体实现，它在启动时会“根据 Java 类推断数据库结构”。这对新手很友好，但本质上是“把数据库迁移逻辑藏在黑盒里”，难以审核和回滚。
    *   Flyway 的思路恰好相反：所有变更都写成显式的 SQL 脚本，按版本号执行，就像对代码做 Git 版本控制一样对待数据库 Schema。
*   **Solution (做法):**
    *   引入 **Flyway**。我们将所有数据库变更写成版本化的 SQL 文件（如 `V1__Init.sql`, `V2__Add_Column.sql`）。
    *   应用启动时，Flyway 会检查并按顺序执行这些脚本。
*   **Why (决策理由):**
    *   **版本控制:** 数据库 Schema 的变更也像代码一样被 Git 管理起来了。我们可以确切地知道生产环境的数据库处于哪个版本，且变更过程是可重复、可回滚的。

### 2. 为什么选择 JWT 而不是 Session？

*   **Context (背景):**
    *   **Session:** 传统的登录方式。服务器在内存里存一个 Session，给客户端发一个 SessionID (Cookie)。
    *   **问题:** 如果后端部署了多台服务器（集群），Server A 里的 Session 在 Server B 里找不到。虽然可以用 Redis 共享 Session（Spring Session），但仍然是有状态的。
    *   对没有安全框架经验的人，可以先记住一句话：Session 模式下“用户的登录状态”存在服务器上；JWT 模式下“登录状态”被编码进 Token，并交给客户端持有。
    *   Spring Security 在这里扮演的是“门卫”的角色：拦截请求、解析 Token 或 Session，并把认证信息塞进当前线程的安全上下文里，后面的业务代码只关心“用户是谁”，而不关心“认证细节怎么做”。
*   **Solution (做法):**
    *   使用 **JWT (JSON Web Token)**。登录成功后，服务器签发一个包含用户信息的“证书”（Token）给客户端。客户端每次请求都带上这个 Token。
    *   服务器只需“验证签名”，不需要查内存或数据库。
*   **Why (决策理由):**
    *   **无状态 (Stateless):** 服务器不需要存储登录状态，这让扩容（Scaling）变得极其容易。
    *   **移动端友好:** Cookie 在 App 开发中不如 Header 里的 Token 方便。
    *   **现代化:** 符合现代前后端分离架构的标准。

### 3. 为什么引入 MapStruct 进行对象映射？

*   **Context (背景):**
    *   **数据隐私:** 数据库实体 `Employee` 包含了 `password` 字段（即使是加密的）。如果直接把 `Employee` 对象序列化为 JSON 返回给前端，密码哈希值就会泄露，这是严重的安全隐患。
    *   **API 契约:** 前端可能只需要 `username` 和 `role`，不需要后端内部使用的 `create_time` 或 `is_deleted` 等字段。
    *   **因此，我们必须进行转换:** 必须创建一个只包含前端所需字段的 `DTO` (Data Transfer Object)，并把数据从 `Entity` 复制到 `DTO`。
    *   **手动转换的痛点:** 每次写 `dto.setName(entity.getName())` 这种代码非常枯燥，且容易因为漏写某个字段而产生 Bug。
    *   如果你来自前端/脚本语言背景，可以把 DTO 理解为“仅暴露给前端看的数据结构”：它刻意隐藏了内部字段（如密码、逻辑删除标记），避免接口泄露实现细节。
*   **Solution (做法):**
    *   引入 **MapStruct**。我们只需要定义一个接口 `EmployeeMapper`，它会在**编译时**自动生成高性能的转换代码。
*   **Why (决策理由):**
    *   **高性能:** 因为是编译时生成代码，运行时没有反射开销（对比 BeanUtils）。
    *   **类型安全:** 如果字段改名了，编译时就会报错，而不是运行时才抛异常。

### 4. 为什么拆分 `EmployeeAuthController` 和 `EmployeeController`？

*   **Context (背景):**
    *   最初，我们尝试把“登录接口”和“员工CRUD接口”都放在 `EmployeeController` 里。
    *   **安全配置的复杂性:** 在 Spring Security 中，我们需要配置哪些 URL 是公开的，哪些是需要认证的。
    *   如果 URL 混杂（例如 `/api/employee/login` 是公开的，而 `/api/employee/list` 是受保护的），我们在配置 Security 规则时就需要写得很细（如 `requestMatchers("/api/employee/login").permitAll()`），容易因为手误导致权限泄露。
    *   对没有 Spring MVC 经验的读者，可以简单地理解为：Controller 对应的是“某一组 URL 的入口”，我们通过拆分 Controller + 设计 URL 前缀，把“公开接口”和“受保护接口”在物理结构上分开，而不是完全依赖配置文件记忆哪些地址开放。
*   **Solution (做法):**
    *   我们通过 **URL 路径** 在物理上隔离这两类接口。
    *   `EmployeeAuthController`: 处理 `/api/auth/**` (所有 `/api/auth` 开头的都是公开的)。
    *   `EmployeeController`: 处理 `/api/employee/**` (默认受保护)。
*   **Why (决策理由):**
    *   **安全配置简化:** 我们可以直接配置 `requestMatchers("/api/auth/**").permitAll()`，一刀切，简单且不易出错。
    *   **关注点分离:** 认证逻辑与业务管理逻辑解耦。

---

## Phase 3: 领域层 - 分类管理 (Domain - Category)

### 1. 为什么采用 `com.eurobite.modules.*` 的包结构？(Modular Monolith)

*   **Context (背景):**
    *   **传统分层:** 通常 Java 项目按技术分层：`controller`, `service`, `dao`。所有 Service 都在一个包里。这导致业务逻辑像面条一样纠缠在一起，修改一个功能容易影响另一个。
    *   **微服务 (Microservices):** 将每个业务拆分成独立部署的服务。这解决了耦合，但带来了巨大的运维成本（RPC、分布式事务）。
    *   对没有 DDD 背景的读者，可以把“模块化单体”理解为：**部署上仍然是一个应用，但代码结构上强行按业务边界拆模块**。每个模块内部都有自己的 Controller / Service / Repository，不允许跨模块随意互相调用。
    *   这种组织方式的目标很清晰：即使今天还不拆微服务，将来要拆时，某个模块也能比较干净地被“剪”出来，因为它的依赖入口是收敛的。
*   **Solution (做法):**
    *   **Modular Monolith (模块化单体):** 我们保持单体部署（一个 Jar），但在**代码结构**上严格按业务领域（Domain）划分：`modules.employee`, `modules.category`, `modules.dish`。
    *   每个模块内部拥有完整的 MVC 结构。
*   **Why (决策理由):**
    *   **高内聚，低耦合:** 相关的业务代码（如 Employee 的实体、逻辑、接口）物理上在一起。
    *   **演进性:** 如果未来某一天 `Dish` 模块负载过高，我们可以很轻松地把 `modules.dish` 整个包剪切出来，独立部署成一个微服务，因为它的依赖是清晰的。

### 2. 为什么删除分类时要进行“业务级校验”而不是“数据库级校验”？

*   **Context (背景):**
    *   `Category` (分类) 是 `Dish` (菜品) 和 `Setmeal` (套餐) 的前置依赖。如果删除了一个正在使用的分类，会导致数据不一致（菜品找不到分类）。
    *   **方案 A (数据库外键):** 在 `dish` 表中设置 `category_id` 的外键约束 (Foreign Key)。如果尝试删除分类，数据库会报错。
    *   **方案 B (业务校验):** 在删除分类前，先查询 `dish` 表和 `setmeal` 表，如果有数据关联，则抛出明确的业务异常。
    *   这其实对应了“把规则放在业务层还是数据层”的经典讨论：外键更偏向技术约束，业务校验则更接近真实业务语言（“当前分类下还有 X 个菜品，不能删”）。
*   **Solution (做法):**
    *   我们虽然是单体，但选择了 **方案 B (业务校验)**，即在 Service 层手动检查关联。
*   **Why (决策理由):**
    *   **为分库分表/微服务做准备:** 在未来演进中，如果 `Dish` 和 `Category` 被拆分到不同的微服务（或不同的数据库），数据库层面的外键约束将彻底失效。
    *   **更友好的错误提示:** 数据库报错通常是晦涩的 SQL 错误码。业务校验可以让我们精准地告诉用户：“当前分类下关联了 5 个菜品，禁止删除”，体验更好。

---

## Phase 4: 领域层 - 菜品管理 (Domain - Dish)

### 1. 为什么要将文件存储服务 (`FileStorageService`) 抽象为接口？

*   **Context (背景):**
    *   在开发环境（Local）中，我们通常把用户上传的图片直接存在项目目录下的 `images/` 文件夹里。
    *   但在生产环境（Production），特别是使用了 Docker 容器化部署后，本地文件系统是临时的（容器重启后数据丢失），或者因为多实例部署导致图片无法共享。生产环境必须使用云存储服务（如 AWS S3, MinIO, 阿里云 OSS）。
    *   即便你从未接触过云存储，可以先记住一个约束：**容器的本地磁盘是不可靠的**，扩容之后“这台机器上的文件”也很难被其他实例访问，因此把文件抽象到一个独立的存储服务是长远必选项。
*   **Solution (做法):**
    *   定义一个 `FileStorageService` 接口，包含 `upload()` 和 `delete()` 方法。
    *   在开发环境提供 `LocalFileStorageService` 实现，在生产环境提供 `S3FileStorageService` 实现（通过 `@Profile` 切换）。
*   **Why (决策理由):**
    *   **依赖倒置 (DIP):** 业务代码（DishService）只依赖于接口，不依赖于具体实现。这使得我们可以在不修改一行业务代码的情况下，平滑地从本地存储切换到云存储。

### 2. 为什么 Dish (菜品) 是聚合根 (Aggregate Root)？

*   **Context (背景):**
    *   一个“菜品”不仅包含名称、价格等基本信息，还可能包含多种“口味”(`DishFlavor`)，如“微辣”、“重辣”。
    *   `DishFlavor` 这个实体如果离开了 `Dish`，是没有任何独立存在意义的。我们不会单独查询“所有的口味”，只会查询“这个菜品的口味”。
    *   这正是 DDD 里“聚合”的经典特征：内部对象之间有强约束（不能单独存在、必须跟随根一起增删改），因此我们通过聚合根统一对外暴露操作，防止外部随意绕过业务规则直接操作子对象。
*   **Solution (做法):**
    *   在 DDD 概念中，我们将 `Dish` 定义为 **聚合根**。
    *   在 JPA 映射中，我们在 `Dish` 实体上使用 `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` 来管理 `flavors`。
*   **Why (决策理由):**
    *   **生命周期一致性:** 这意味着当我们保存 Dish 时，它的 Flavors 会自动被保存；当我们删除 Dish 时，它的 Flavors 会自动被删除（级联删除）。这保证了数据的完整性，避免了孤儿数据。

### 3. 为什么在 Service 层使用 `@Transactional`？

*   **Context (背景):**
    *   保存一个菜品涉及两个步骤：1. 保存 `dish` 表记录；2. 保存多条 `dish_flavor` 表记录。
    *   **故障场景:** 如果 `dish` 保存成功了，但在保存 `flavors` 时程序崩溃了（或网络断了），数据库里就会留下一个没有口味的残缺菜品。
    *   对没有事务经验的人，可以简单地把“事务”看成数据库提供的“全有或全无”机制：一组操作要么全部成功，要么全部撤销，系统不会看到中间状态。
*   **Solution (做法):**
    *   在 `DishService.saveWithFlavor` 方法上添加 `@Transactional` 注解。
*   **Why (决策理由):**
    *   **原子性 (Atomicity):** 事务保证了这两个步骤要么同时成功，要么同时失败（回滚）。这是金融级数据一致性的基础要求。

---

## Phase 5: 领域层 - 套餐管理 (Domain - Setmeal)

### 1. 为什么在 `setmeal_dish` 表中冗余存储菜品名称和价格？

*   **Context (背景):**
    *   `Setmeal` (套餐) 由多个 `Dish` (菜品) 组成。标准的关系型设计是在 `setmeal_dish` 中只存储 `setmeal_id` 和 `dish_id` 的外键。
    *   **性能问题:** 每次查询套餐详情时，如果只存了 ID，我们就必须 JOIN `dish` 表或者多次查询数据库来获取菜品的名称和价格。这在高并发场景下（如首页展示）会带来性能压力。
    *   对没有数据库设计经验的人，可以记住：“高度范式化”的设计适合写多读少且对一致性极度敏感的场景；而外卖这种读操作远多于写操作的系统，经常会有一些刻意的“冗余字段”，用多存一点数据换来更快的查询。
*   **Solution (做法):**
    *   **反范式设计 (Denormalization):** 我们在 `setmeal_dish` 表中增加了 `name` 和 `price` 字段，虽然它们在 `dish` 表里已经有了。
*   **Why (决策理由):**
    *   **读性能优先:** 这是一个典型的“空间换时间”的策略。我们在保存套餐时多存一点数据，换取查询时极快的速度（单表查询即可，无需 JOIN）。
    *   **Trade-off (权衡):** 缺点是当 Dish 改名时，Setmeal 里的名字会过时。但对于外卖系统，菜品改名频率极低，这种数据轻微不一致是可接受的。

### 2. 为什么套餐启售时要校验关联菜品的状态？

*   **Context (背景):**
    *   如果一个套餐包含了"宫保鸡丁"，而"宫保鸡丁"因为缺货已经停售了。如果不加校验直接启售套餐，用户点了套餐却吃不到宫保鸡丁，会产生客诉。
    *   从领域角度看，"套餐可售"这个状态本身就依赖于"内部所有菜品都可售"这个不变量，所以在改变套餐状态之前，校验关联菜品状态是对领域规则的自然编码，而不是额外的技术负担。
*   **Solution (做法):**
    *   在 `SetmealService.updateStatus` (启用套餐) 的逻辑中，增加一步检查：遍历套餐内的所有菜品，检查它们的 `status` 是否为 1 (启售)。如果有任意一个菜品停售，则禁止启用套餐。
*   **Why (决策理由):**
    *   **业务一致性:** 系统不仅要保证数据的技术一致性（外键存在），还要保证**业务逻辑的一致性**。这体现了 Service 层作为"业务逻辑守门员"的价值。

---

## 实战案例复盘：购物车功能问题诊断与修复

### 问题概述：购物车价格显示异常与订单结算白屏

#### **问题现象**
在开发过程中，我们遇到了两个关联问题：
1. **购物车数量增加但价格显示为0**：用户添加菜品到购物车，数量计数正确，但总价始终显示为 €0.00
2. **点击去结算后白屏**：订单提交时页面崩溃或显示空白

这两个问题看似独立，实则源于同一个根本原因：**数据层不完整**。

---

## 问题一：购物车价格显示为0

### 1. 问题定位：数据完整性缺失

*   **Context (背景):**
    *   前端使用 Zustand 状态管理购物车，通过 `useCartSummary` 计算总金额：
    ```typescript
    const calcTotals = (items: CartItem[]) => {
      const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
      return { totalCount, totalAmount };
    };
    ```
    *   当 `item.amount` 为 `null` 时，累加结果自然为 0
    *   **根本原因**：`ShoppingCartService.add()` 方法只设置了 `number` 字段，没有设置 `amount`、`name`、`image` 等关键字段

*   **Solution (做法):**
    *   修改 `ShoppingCartService.add()` 方法，在添加购物车时主动从数据库查询菜品详情：
    ```java
    // 添加新菜品时，获取价格、名称和图片
    if (cart.getDishId() != null) {
        Dish dish = dishRepository.findById(cart.getDishId())
                .orElseThrow(() -> new RuntimeException("Dish not found"));
        cart.setName(dish.getName());
        cart.setImage(dish.getImage());
        cart.setAmount(dish.getPrice());
    }
    ```
    *   同时处理数量增加场景，确保价格字段同步更新：
    ```java
    if (item.getDishId() != null) {
        Dish dish = dishRepository.findById(item.getDishId()).orElse(null);
        if (dish != null) {
            item.setAmount(dish.getPrice()); // 更新单价
        }
    }
    ```

*   **Why (决策理由):**
    *   **数据驱动而非接口驱动：** 通过 `DishModuleApi` 获取菜品价格，避免硬编码
    *   **边界条件处理：** 既处理新添加商品，也处理已有商品数量增加的情况
    *   **故障快速暴露：** 使用 `orElseThrow()` 明确指出菜品不存在的问题

#### 面试视角
- **问：为什么不直接在前端计算价格？**
  答：前端计算依赖前端获取的菜品价格，容易因缓存或版本问题导致前后端价格不一致。订单金额必须以服务端计算为准，这是财务级系统的基本要求。

- **问：这种查询会有性能问题吗？**
  答：购物车操作频率远低于查询操作，且可以通过缓存优化。更重要的是数据一致性优先于微优化。

---

### 2. 数据库初始化陷阱：主键序列错位

*   **Context (背景):**
    *   修复价格逻辑后，API 调用 `dishId=1` 报错 "Dish not found: 1"
    *   通过数据库查询发现：`SELECT id FROM dish LIMIT 1` 返回 `id=281`，而非期望的 `id=1`
    *   **根本原因**：数据库迁移脚本的插入语句没有显式指定 ID，PostgreSQL 的序列从最大值开始自增

*   **Solution (做法):**
    *   重置主键序列，使 ID 从 1 开始：
    ```sql
    -- 重置dish表的主键序列
    UPDATE dish SET id = id - 280;
    SELECT setval('dish_id_seq', (SELECT MAX(id) FROM dish));

    -- 更新关联表的外键引用
    UPDATE dish_flavor SET dish_id = dish_id - 280;
    UPDATE order_detail SET dish_id = dish_id - 280 WHERE dish_id IS NOT NULL;
    UPDATE setmeal_dish SET dish_id = dish_id - 280;
    ```

*   **Why (决策理由):**
    *   **测试友好性：** 前端和文档通常从 ID=1 开始编写测试用例
    *   **数据可读性：** 较小的 ID 更容易记忆和调试
    *   **避免外键断裂：** 同步更新所有引用该 ID 的外键字段

#### 面试视角
- **问：为什么不直接删除所有数据重新插入？**
  答：如果是生产环境，数据迁移需要更谨慎。UPDATE 方案更安全，且保留了数据的审计信息。

---

## 问题二：订单结算白屏

### 3. 用户上下文丢失：匿名用户场景未处理

*   **Context (背景):**
    *   订单提交时报错 "Cart is empty"，即使购物车中已有商品
    *   调试发现 `BaseContext.getCurrentId()` 返回 `null`
    *   **根本原因**：`OrderService.submit()` 未处理匿名用户场景，导致查询购物车时使用 `userId=null`

*   **Solution (做法):**
    *   在 `OrderService.submit()` 和 `ShoppingCartService.add()` 中添加默认用户处理：
    ```java
    Long userId = BaseContext.getCurrentId();
    if (userId == null) {
        userId = 1L; // 默认测试用户ID
    }
    ```

*   **Why (决策理由):**
    *   **渐进式开发：** 在未实现完整的用户认证系统前，保证核心业务流程可测试
    *   **故障隔离：** 避免因用户系统问题阻塞订单流程
    *   **防御性编程：** 显式处理 null 场景，避免 NPE

#### 面试视角
- **问：这样处理是否安全？**
  答：在开发/测试阶段是合理的。生产环境中应通过 Spring Security 拦截器确保所有请求都有用户上下文，这种处理可以作为兜底方案。

---

### 4. 金额计算精度丢失：AtomicInteger 的陷阱

*   **Context (背景):**
    *   订单金额计算错误：€28.80 × 2 应该等于 €57.60，但计算结果为 57
    *   **根本原因**：使用 `AtomicInteger` 计算金额，导致小数部分丢失
    ```java
    // 错误做法
    AtomicInteger amount = new AtomicInteger(0);
    amount.addAndGet(item.getAmount().multiply(...).intValue()); // BigDecimal被转为int
    ```

*   **Solution (做法):**
    *   使用 `AtomicReference<BigDecimal>` 保证浮点数精度：
    ```java
    AtomicReference<BigDecimal> totalAmount = new AtomicReference<>(BigDecimal.ZERO);

    // 在 lambda 中安全更新
    totalAmount.updateAndGet(current -> current.add(itemTotal));
    ```

*   **Why (决策理由):**
    *   **金融级精度要求：** 金额计算不容忍精度丢失，BigDecimal 是 Java 中处理精确小数的标准方案
    *   **并发安全：** lambda 表达式中修改局部变量需要使用原子引用
    *   **避免隐式转换：** 显式使用 BigDecimal 避免精度丢失陷阱

#### 面试视角
- **问：为什么不用 Double？**
  答：Double 使用 IEEE 754 浮点数表示法，在计算 €0.01 + €0.02 时可能得到 €0.030000000000000002，这是金融系统不可接受的。BigDecimal 提供任意精度整数运算。

---

## 综合反思：数据层完整性的重要性

### 问题根因分析

这次问题的核心是**数据层不完整**导致的上层业务逻辑异常：

1. **数据层（Repository/Service）**：
   - 购物车数据缺失关键字段（amount、name、image）
   - 数据库主键序列错位
   - 用户上下文处理缺失

2. **业务层（Service）**：
   - 边界条件处理不完整
   - 金额计算精度错误

3. **表现层（前端）**：
   - 依赖后端数据的完整性，无力修正底层问题

### 解决思路：自底向上修复

```
数据层 → 业务层 → 表现层
  ↑       ↑       ↑
 修复    验证    恢复
```

1. **优先修复数据层**：确保数据库中的数据完整、正确
2. **完善业务逻辑**：处理边界条件、异常场景
3. **验证表现层**：确认用户界面恢复正常

### 工程实践启示

1. **数据驱动设计**：Service 层必须确保数据的完整性和一致性，不能假设数据一定正确
2. **边界条件处理**：每一个 public 方法都要思考：参数为 null 怎么办？数据库没有记录怎么办？
3. **精度要求明确**：涉及金额、计数的场景必须使用精确的数据类型（BigDecimal/Long），避免使用浮点数
4. **测试数据管理**：数据库初始化脚本必须保证测试数据的 ID 可预测，避免"在不同环境使用不同 ID"的陷阱
5. **防御性编程**：显式处理 null、空集合等边界情况，比依赖框架默认值更安全

### 面试价值点

这次问题排查过程展示了：
- **系统性思维**：从数据层到表现层的全链路分析
- **故障诊断能力**：如何通过日志、数据库查询定位问题
- **工程经验**：对常见陷阱（精度丢失、空指针、主键序列）的预防
- **业务理解**：外卖系统中购物车和订单的业务规则

这些能力比单纯的技术实现更珍贵，体现了中级工程师向高级工程师进阶的关键素质。
