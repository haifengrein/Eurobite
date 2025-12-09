# EuroBite 2026 - Architectural Manifesto & Refactoring Roadmap

## 1. Vision & Strategy (项目愿景与策略)

**Current State:** "Reggie Take Out" is a legacy monolith built on outdated tech (Java 8, Spring Boot 2, MyBatis Plus) with a focus on quick training delivery rather than engineering excellence.

**Target State (EuroBite):** A production-grade, **Modular Monolith** food delivery platform targeting the **2026 European Tech Market**. It is designed to demonstrate Senior-level capabilities in Architecture, Quality Assurance, and Cloud-Native practices.

### Key Architectural Decisions (ADR)

1.  **Architecture Style: Modular Monolith (Modulith)**
    *   *Decision:* We explicitly reject Microservices for this scale.
    *   *Reasoning:* Microservices introduce massive operational complexity (Network latency, Distributed Transactions, Service Mesh) which is overkill for a solo project. A Modular Monolith provides logical boundaries (`com.eurobite.modules.*`) without the physical separation penalties, allowing for TDD velocity and easier deployment.

2.  **Language: Java 21 LTS**
    *   *Decision:* Skip Java 17, go straight to 21.
    *   *Reasoning:* To leverage modern syntax (**Records** for DTOs, **Pattern Matching** for Switch, **Sequenced Collections**) and runtime improvements (**Virtual Threads** for high-throughput I/O).

3.  **Framework: Spring Boot 3.3+ (Jakarta EE 10)**
    *   *Decision:* Full migration to Jakarta namespace.
    *   *Reasoning:* Spring Boot 2 is EOL. SB3 offers native AOT support, better Observability, and is the industry standard for new projects.

4.  **Persistence: JPA (Hibernate) + PostgreSQL**
    *   *Decision:* Replace MyBatis Plus/MySQL with JPA/Postgres.
    *   *Reasoning:* Europe prefers standards (JPA) over frameworks (MyBatis). PostgreSQL is the superior open-source DB (better JSONB support for flexible menus, PostGIS for locations). We use **Flyway** for versioned schema migrations, strictly banning manual SQL execution.

5.  **Testing: Testcontainers-First Strategy**
    *   *Decision:* No H2 Database. No Mocking the Database.
    *   *Reasoning:* "It works on my machine" is not acceptable. Tests must run against the **actual** infrastructure versions (Postgres 16, Redis 7) running in ephemeral Docker containers.

## 2. Tech Stack Summary

| Category | Technology | Version | Role |
| :--- | :--- | :--- | :--- |
| **Lang** | Java | 21 (LTS) | Core Language |
| **Framework** | Spring Boot | 3.3.x | Application Framework |
| **DB** | PostgreSQL | 16-alpine | Relational Data |
| **Cache** | Redis | 7-alpine | Session & Data Cache |
| **ORM** | Spring Data JPA | - | Data Access |
| **Migration** | Flyway | - | Database Version Control |
| **Security** | Spring Security | 6.x | AuthN & AuthZ (JWT) |
| **Testing** | JUnit 5 + Testcontainers | - | Integration Testing |
| **DevOps** | Docker Compose | - | Local Development Env |

---

# Execution Task List

## Phase 0: Infrastructure & Scaffolding (基建完成)
- [x] **Task 0.1: Project Cleanup** (Clean Slate in `eurobite/`).
- [x] **Task 0.2: Dev Environment** (Docker Compose: Postgres 16 + Redis 7).
- [x] **Task 0.3: Dependency Modernization** (Maven Wrapper, Java 21, SB 3.3, JPA, Lombok, MapStruct).
- [x] **Task 0.4: Project Scaffolding** (Modular Monolith package structure).

---

## Phase 1: Shared Kernel & Engineering Foundation (公共内核)
**Goal:** Build the unified infrastructure. **Must be done before any business logic.**

### 1.1 Unified Response Structure (`R<T>`)
- [x] 1.1.1 **Test:** Create `RTest.java`. Verify serialization of `success(data)` and `error(msg)`.
- [x] 1.1.2 **Impl:** Create `R<T>` record/class in `com.eurobite.common.model`.
  - [x] Fields: `Integer code`, `String msg`, `T data`, `Map map`.
  - [x] Static factories: `success(T object)`, `error(String msg)`.

### 1.2 Global Exception Handling
- [x] 1.2.1 **Test:** Create `GlobalExceptionHandlerTest.java` using `MockMvc`.
- [x] 1.2.2 **Impl:** `GlobalExceptionHandler` (@RestControllerAdvice) & `CustomException`.

### 1.3 Testing Infrastructure (DRY)
- [x] 1.3.1 **Impl:** Create `AbstractIntegrationTest` base class.
  - [x] Configure `@ServiceConnection` for Postgres & Redis containers.
  - [x] All future Integration Tests must extend this.

### 1.4 API Documentation (API First)
- [x] 1.4.1 **Dep:** Add `springdoc-openapi-starter-webmvc-ui`.
- [x] 1.4.2 **Config:** Configure Swagger UI at `/swagger-ui.html`.

### 1.5 Persistence & Config
- [x] 1.5.1 **Impl:** `BaseEntity` in `com.eurobite.common.entity` (JPA Audit).
- [x] 1.5.2 **Config:** Enable **Virtual Threads** (`spring.threads.virtual.enabled=true`) - *Implicitly handled, to verify*.
- [x] 1.5.3 **Config:** Configure structured logging (JSON) & Jackson (Long -> String).

---

## Phase 2: Domain - Employee & Security (员工与安全)
**Goal:** Implement Employee CRUD protected by Spring Security 6 + JWT.

### 2.1 Employee Domain Model
- [x] 2.1.1 **Schema:** Create `V1__Initial_Schema.sql` (Postgres syntax).
- [x] 2.1.2 **Entity:** `Employee` (extends BaseEntity).
- [x] 2.1.3 **Repo:** `EmployeeRepository`.

### 2.2 Security Infrastructure (JWT)
- [x] 2.2.1 **Test:** `JwtUtilTest`.
- [x] 2.2.2 **Impl:** `JwtUtil`, `SecurityConfig`, `JwtAuthenticationFilter`.

### 2.3 Authentication Logic
- [x] 2.3.1 **Test:** `EmployeeAuthTest`.
- [x] 2.3.2 **Impl:** `EmployeeController.login()` using BCrypt.

### 2.4 Employee CRUD (Modern Java)
- [x] 2.4.1 **Design:** Define `EmployeeDTO` using **Java Record**.
- [x] 2.4.2 **Impl:** `EmployeeService` & `Controller` with MapStruct.

---

## Phase 3: Domain - Category (分类管理)
**Goal:** Simple CRUD.

- [x] 3.1 **Schema:** Add `category`.
- [x] 3.2 **Impl:** CRUD (Entity, Repo, Service).

---

## Phase 4: Domain - Dish (菜品管理 - 聚合根)
**Goal:** Handle Dish aggregate and Inter-Module Communication rules.

### 4.1 File Storage Service
- [x] 4.1.1 **Design:** Interface `FileStorageService` (upload, download).
- [x] 4.1.2 **Impl:** `LocalFileStorageService` (Implementation for dev).
- [x] 4.1.3 **API:** `CommonController` for upload/download endpoints.

### 4.2 Dish Aggregate
- [x] 4.2.1 **Schema:** Add `dish`, `dish_flavor`.
- [x] 4.2.2 **Entity:** `Dish` (One-to-Many `DishFlavor`).
  - [x] Configure `CascadeType.ALL` or manage manually.

### 4.3 Dish Logic (Transactional)
- [x] 4.3.1 **DTO:** `DishDTO` (includes `List<DishFlavorDTO>`).
- [x] 4.3.2 **Test:** `DishServiceTest` (Integration).
  - [x] Case: Save dish -> verify dish and flavors inserted.
  - [x] Case: Update dish -> verify flavors replaced/updated.
- [x] 4.3.3 **Impl:** `DishService.saveWithFlavor`.
  - [x] `@Transactional` annotation usage.
- [x] 4.3.4 **Cache:** Add Redis caching logic using Spring Cache abstraction.

### 4.3 Module Interface (Public API)
- [x] 4.3.1 **Design:** Create `DishModuleApi` interface.
- [x] 4.3.2 **Rule:** Enforce other modules use `DishModuleApi`, NOT `DishRepository`.

---

## Phase 5: Domain - Setmeal (套餐管理)
**Goal:** Manage combinations.

- [x] 5.1 **Impl:** Setmeal Aggregate (`Setmeal` + `SetmealDish`).
- [x] 5.2 **Impl:** CRUD logic.

---

## Phase 6: Domain - User & GDPR (用户与隐私)
**Goal:** C-End User handling with strict Privacy Compliance.

### 6.1 User Domain
- [x] 6.1.1 **Schema:** Add `user`, `address_book`.
- [x] 6.1.2 **Impl:** Mobile Login (Mock SMS).

### 6.2 GDPR Compliance (Europe Specific)
- [x] 6.2.1 **API:** `GET /api/user/me/export` (Data Portability).
- [x] 6.2.2 **API:** `DELETE /api/user/me` (Right to be Forgotten).

---

## Phase 7: Domain - Order (订单核心)
**Goal:** Complex Transaction handling.

### 7.1 Shopping Cart
- [x] 7.1.1 **Impl:** `ShoppingCartService` (DB backed).

### 7.2 Order Submission
- [x] 7.2.1 **Schema:** Add `orders`, `order_detail`.
- [x] 7.2.2 **Refactor:** Inject `DishModuleApi` to fetch prices.
- [x] 7.2.3 **Test:** `OrderServiceTest` (Integration Test with Testcontainers).
- [x] 7.2.4 **Impl:** `OrderService.submit()` (Atomic transaction).

---

## Phase 8: Frontend (Modern Client)
**Goal:** Build a Resume-Worthy Client (React/Next.js). *See `frontend-task.md` for details.*

- [x] **Task 8.1:** Setup EuroBite Web (Vite + React + TS).
- [x] **Task 8.2:** Implement Login, Menu, Cart, Order pages.
- [x] **Task 8.3:** Docker Integration (Nginx Proxy + Backend Link).

---

## Phase 9: DevOps & Observability (交付)
**Goal:** Production ready.

### 9.1 Observability
- [ ] 9.1.1 **Dep:** Add Actuator, Micrometer, Prometheus.
- [ ] 9.1.2 **Config:** Expose metrics endpoints.

### 9.2 CI/CD
- [ ] 9.2.1 **CI:** GitHub Actions (Build Backend -> Test -> Build Frontend -> Dockerize).

### 9.3 Documentation
- [ ] 9.3.1 **Docs:** Update `README.md` with Architecture Decision Records (ADR).
