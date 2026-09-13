# StartUp

기업의 효율적인 업무 처리를 위한 웹 기반 그룹웨어 서비스입니다.

- Backend: Java 17, Spring Boot 3.5.6, Gradle
- Frontend: React 19, Vite 7
- Database: MySQL 8

## 로컬 실행 가이드

### 1. 요구 사항
- JDK 17
- Node.js (npm)
- MySQL 8.x

### 2. 데이터베이스 준비
MySQL에 접속해서 DB와 계정을 생성합니다.

```sql
CREATE DATABASE start_up CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'goodee'@'localhost' IDENTIFIED BY 'goodee';
GRANT ALL PRIVILEGES ON start_up.* TO 'goodee'@'localhost';
FLUSH PRIVILEGES;
```

다른 계정을 쓰고 싶다면 `backend/src/main/resources/application.properties`의 기본값을 참고해 환경변수(`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`)로 재정의하면 됩니다.

### 3. 백엔드 실행

```bash
cd backend
./gradlew bootRun      # Windows: gradlew.bat bootRun
```

- 기본 포트: `8080`
- `spring.jpa.hibernate.ddl-auto=update` 설정으로 테이블은 첫 실행 시 자동 생성됩니다.
- 초기 데이터(관리자 계정 등)는 자동으로 들어가지 않습니다(`spring.sql.init.mode=never`). 최초 1회, 테이블이 생성된 뒤 아래 명령으로 직접 넣어주세요.

```bash
mysql -u goodee -p start_up < backend/src/main/resources/data.sql
```

- 첨부파일 저장 경로는 `file.storage.root` 속성(기본값은 `application.properties` 참고)이며, 필요하면 `FILE_STORAGE` 환경변수로 원하는 경로를 지정할 수 있습니다.

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

- 기본 포트: `3000`
- `/api`로 시작하는 요청은 자동으로 `http://localhost:8080`(백엔드)으로 프록시됩니다.

### 5. 접속

브라우저에서 `http://localhost:3000` 접속 후, `data.sql`에 포함된 계정(`admin` / `admin`)으로 로그인합니다.
