# 瑞吉外卖 (Reggie Take Out) 项目上下文

## 项目概述
**瑞吉外卖** 是一个外卖管理系统。它采用前后端分离的开发模式（但在本项目中作为单体应用部署），包含两个主要界面：
1.  **后台管理系统：** 供内部员工使用，用于管理菜品、套餐、订单、分类和员工信息。
2.  **移动端/前端应用：** 供消费者使用，用于浏览菜单、添加购物车和下订单。

该项目是一个单体 Spring Boot 应用程序，同时托管 REST API 和静态前端资源（基于 Vue.js）。

## 技术栈

### 后端 (Backend)
*   **语言:** Java 8
*   **框架:** Spring Boot 2.4.5
*   **ORM:** MyBatis Plus 3.4.2
*   **数据库:** MySQL
*   **缓存:** Redis
*   **连接池:** Druid
*   **工具库:** Lombok, Fastjson
*   **API 文档:** Swagger / Knife4j

### 前端 (Frontend)
*   **框架:** Vue.js (嵌入在 `src/main/resources` 中)
*   **UI 组件库:** Element UI (后台管理), Vant (移动端/前台)
*   **HTTP 客户端:** Axios

## 项目结构

*   `src/main/java/com/itheima/reggie`
    *   `ReggieApplication.java`: 程序主入口。
    *   `config/`: 配置类 (WebMvc, Redis, MyBatis 等)。
    *   `controller/`: REST API 接口控制层。
    *   `entity/`: 数据库实体类。
    *   `service/` & `mapper/`: 业务逻辑层和数据访问层。
*   `src/main/resources`
    *   `application.yml`: 主配置文件 (数据库, Redis, 端口等)。
    *   `backend/`: 后台管理系统的静态资源 (访问路径 `/backend/**`)。
    *   `front/`: 移动端应用的静态资源 (访问路径 `/front/**`)。
    *   `mapper/`: MyBatis XML 映射文件。

## 安装与运行

### 前置要求
*   JDK 1.8+
*   Maven
*   MySQL 5.7+
*   Redis

### 配置
1.  **数据库:** 确保 MySQL 正在运行。创建一个名为 `reggie` 的数据库。
    *   修改 `src/main/resources/application.yml` 中的 MySQL 连接信息（默认用户: `root`, 密码: `1234567`）。
2.  **Redis:** 确保 Redis 正在本地运行，端口 `6379`（默认密码: `foobared`）。
    *   如有不同，请更新 `application.yml` 中的 `spring.redis` 配置。
3.  **文件路径:** 检查 `application.yml` 中的 `reggie.path` 属性。当前指向硬编码路径 (`/Users/dan/Code/Project/Java/reggie/`)，你可能需要根据你的本地环境修改此路径（用于文件上传/下载）。

### 构建
```bash
mvn clean package
```

### 运行
你可以使用 Maven 或构建好的 JAR 包来运行应用：
```bash
mvn spring-boot:run
```
或者：
```bash
java -jar target/reggie_take_out-1.0-SNAPSHOT.jar
```

### 访问应用
*   **后台管理端:** [http://localhost:8080/backend/page/login/login.html](http://localhost:8080/backend/page/login/login.html)
*   **移动端:** [http://localhost:8080/front/page/login.html](http://localhost:8080/front/page/login.html)
*   **API 文档:** [http://localhost:8080/doc.html](http://localhost:8080/doc.html)

## 开发注意事项
*   **Lombok:** 本项目使用了 Lombok。请确保你的 IDE 安装了 Lombok 插件并启用了注解处理。
*   **静态资源:** 前端文件直接由 Spring Boot 提供服务。修改 `src/main/resources/backend` 或 `front` 中的文件可能需要重新构建或重启服务，具体取决于 IDE 的热重载能力。
