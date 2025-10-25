# Clean Architecture Correta: Separação de Entities

## 🎯 **Correção da Confusão Conceitual**

**ERRO IDENTIFICADO:** Confundi Domain Entity com TypeORM Entity na implementação anterior.

## 📋 **Separação Correta das Responsabilidades**

### **🏗️ Domain Entity (Regras de Negócio)**

```typescript
// ✅ CORRECT: src/modules/clients/domain/entities/Client.ts
export class Client {
  private readonly id: string;
  private name: string;
  private status: ClientStatus;

  // ✅ Métodos de negócio
  deactivate(): void {
    this.status = ClientStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === ClientStatus.ACTIVE;
  }
}
```

**Responsabilidades:**

- ✅ Regras de negócio
- ✅ Validações de domínio
- ✅ Comportamentos específicos
- ✅ Encapsulamento de dados

### **🗄️ TypeORM Entity (Mapeamento de Dados)**

```typescript
// ✅ CORRECT: src/shared/infra/database/typeorm/entities/ClientEntity.ts
@Entity('clients')
export class ClientEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended'], // ✅ Valores primitivos
    default: 'active',
  })
  status!: string; // ✅ Tipo primitivo, não enum de domínio
}
```

**Responsabilidades:**

- ✅ Mapeamento objeto-relacional
- ✅ Definição de schema do banco
- ✅ Anotações do TypeORM
- ✅ Persistência de dados

### **🔄 Repository (Conversão Domain ↔ TypeORM)**

```typescript
// ✅ CORRECT: src/modules/clients/infrastructure/repositories/TypeORMClientRepository.ts
export class TypeORMClientRepository implements IClientRepository {
  // ✅ Converte Domain → TypeORM
  private domainToEntity(client: Client): ClientEntity {
    const entity = new ClientEntity();
    entity.id = client.getId();
    entity.name = client.getName();
    entity.status = client.getStatus(); // ✅ Enum → string
    return entity;
  }

  // ✅ Converte TypeORM → Domain
  private entityToDomain(entity: ClientEntity): Client {
    return new Client(
      {
        name: entity.name,
        status: entity.status as ClientStatus, // ✅ string → Enum
      },
      entity.id
    );
  }
}
```

## 🎯 **Por que Essa Separação é Fundamental?**

### **1. 🔒 Isolation of Concerns**

```
Domain Entity    → Business Rules (não conhece banco)
TypeORM Entity   → Data Mapping (não conhece regras)
Repository       → Translation Layer (converte entre ambos)
```

### **2. 🔄 Dependency Direction**

```
✅ CORRECT Flow:
modules/clients/infra/repositories → shared/infra/database/entities
modules/clients/infra/repositories → modules/clients/domain/entities

❌ WRONG Flow:
shared/infra → modules/clients/domain (NUNCA!)
```

### **3. 🎭 Technology Independence**

```typescript
// ✅ Domain não depende de TypeORM
export class Client {
  // Sem @Entity, @Column, etc.
  // Puro TypeScript/JavaScript
}

// ✅ TypeORM Entity na infra
@Entity('clients')
export class ClientEntity {
  // Com anotações TypeORM
}
```

## 📁 **Estrutura Final Correta**

```
src/
├── modules/
│   └── clients/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── Client.ts                    ← Domain Entity (negócio)
│       │   └── enums/
│       │       └── ClientStatus.ts              ← Domain Enum
│       └── infrastructure/
│           └── repositories/
│               └── TypeORMClientRepository.ts   ← Conversão Domain ↔ TypeORM
└── shared/
    └── infra/
        └── database/
            └── typeorm/
                └── entities/
                    └── ClientEntity.ts          ← TypeORM Entity (persistência)
```

## 🔄 **Fluxo de Dados Correto**

### **Salvando (Domain → DB):**

```typescript
// 1. Use Case recebe Domain Entity
const client = new Client({ name: 'João' });

// 2. Repository converte Domain → TypeORM
const entity = this.domainToEntity(client);

// 3. TypeORM salva no banco
await this.entityManager.save(ClientEntity, entity);
```

### **Recuperando (DB → Domain):**

```typescript
// 1. TypeORM busca do banco
const entity = await this.entityManager.findOne(ClientEntity, {
  where: { id },
});

// 2. Repository converte TypeORM → Domain
const client = this.entityToDomain(entity);

// 3. Use Case recebe Domain Entity
return client;
```

## ✅ **Benefícios Desta Abordagem**

1. **🏗️ Clean Architecture**: Dependências apontam para dentro
2. **🔒 Encapsulamento**: Domain não conhece detalhes de persistência
3. **🔄 Flexibilidade**: Pode trocar TypeORM por Prisma sem afetar Domain
4. **🧪 Testabilidade**: Domain pode ser testado sem banco
5. **📦 Separação**: Cada camada tem responsabilidade única

## 🚫 **Anti-Patterns Evitados**

### ❌ TypeORM Entity no Domain

```typescript
// ❌ WRONG: Domain com anotações de infraestrutura
@Entity('clients') // ← Infraestrutura no Domain!
export class Client {
  @PrimaryColumn() // ← Viola Clean Architecture
  id: string;
}
```

### ❌ Domain Entity como TypeORM Entity

```typescript
// ❌ WRONG: Misturar responsabilidades
export class Client {
  // Métodos de negócio + anotações TypeORM
  deactivate() {
    /* negócio */
  }

  @Column() // ← Responsabilidades misturadas
  name: string;
}
```

## 🎯 **Conclusão**

**Você estava CORRETO ao questionar minha solução anterior!**

A separação entre Domain Entity e TypeORM Entity é fundamental para manter a Clean Architecture. Obrigado por me corrigir - isso demonstra seu conhecimento sólido dos princípios arquiteturais.

**Estrutura correta:**

- **Domain Entity** → No módulo (regras de negócio)
- **TypeORM Entity** → Na infra shared (mapeamento DB)
- **Repository** → Converte entre ambos
