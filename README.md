# An Ecommerce Project(PulseShop) Using Microservice architecture

### Current Architecture Flow

```mermaid
flowchart TD
    A[HTTP Client] -->|Monorepo pulseshop| B(Auth Service)
    B --> C{pulseshop/shared}
    B --> D{Redis via ioredis}
    B --> E{PostgresSQL via Prisma}
    C --> F{Gmail SMTP}
  ```

What exists today: npm workspaces monorepo with [packages/shared](packages/shared) and [services/auth](services/auth). Root Prisma schema at [prisma/schema.prisma](prisma/schema.prisma) generates the client into services/auth/src/generated/prisma (currently not generated).

What is planned but missing: product service, Docker/Kafka/K8s.

