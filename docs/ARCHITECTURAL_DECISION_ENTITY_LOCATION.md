# Decisão Arquitetural: Localização de Entities TypeORM

## 🎯 Problema Identificado

**Pergunta do usuário:** "A infra pode depender do módulo neste caso?"

**Contexto:** `ClientEntity` estava em `shared/infra/` mas precisava usar `ClientStatus` do `modules/clients/domain/`.

## ❌ Por que a Infra Shared NÃO deve depender de Módulos

### 1. **Violação da Clean Architecture**

```typescript
// ❌ WRONG: Dependência shared → modules
// src/shared/infra/database/typeorm/entities/ClientEntity.ts
import { ClientStatus } from '../../../modules/clients/domain/enums/ClientStatus';
```

**Problemas:**

- 🔄 **Dependência reversa**: Infra (externa) → Domain (interna)
- 🔗 **Acoplamento**: Shared acoplado a módulos específicos
- ⚖️ **Responsabilidade**: Infra conhecendo regras de negócio

### 2. **Princípios Violados**

#### **Clean Architecture - Dependency Rule**

> _"Dependências devem apontar para dentro, nunca para fora"_

```
shared/infra → modules/clients/domain ❌ VIOLAÇÃO!
```

#### **SOLID - Single Responsibility**

> _"Shared/infra deve ser responsável apenas por infraestrutura genérica"_

## ✅ Solução Implementada

### **Mover Entities para seus Módulos Respectivos**

```
❌ ANTES:
src/shared/infra/database/typeorm/entities/ClientEntity.ts

✅ DEPOIS:
src/modules/clients/infrastructure/typeorm/entities/ClientEntity.ts
```

### **Benefícios Arquiteturais:**

1. **🏗️ Coesão de Módulo**
   - ClientEntity pertence ao módulo clients
   - Pode usar ClientStatus livremente
   - Evolui junto com o domínio

2. **🔄 Dependências Corretas**

   ```typescript
   // ✅ CORRECT: modules/clients/infra → modules/clients/domain
   import { ClientStatus } from '../../../domain/enums/ClientStatus';
   ```

3. **📦 Shared Limpo**
   - Shared/infra só contém infraestrutura genérica
   - Sem dependências de módulos específicos
   - Reutilizável por qualquer projeto

### **Estrutura Final:**

```
src/
├── modules/
│   └── clients/
│       ├── domain/
│       │   └── enums/ClientStatus.ts        ← Source of truth
│       └── infrastructure/
│           └── typeorm/entities/
│               └── ClientEntity.ts           ← ✅ Moved here
└── shared/
    └── infra/
        └── database/
            ├── providers/TypeORMProvider.ts  ← References modules/clients/...
            └── typeorm/entities/
                ├── SaleEntity.ts            ← Generic entities only
                └── ProductEntity.ts
```

## 🎯 **Regra Geral para Entities TypeORM**

### **✅ Coloque em `modules/{domain}/infrastructure/typeorm/entities/` quando:**

1. **Entity específica de um domínio**
2. **Usa enums/types do domínio**
3. **Evolui junto com regras de negócio**

### **✅ Coloque em `shared/infra/database/typeorm/entities/` quando:**

1. **Entity verdadeiramente genérica** (logs, auditoria)
2. **Não usa conceitos específicos de domínio**
3. **Infraestrutura pura** (sem regras de negócio)

## 🔄 **Adaptações Necessárias**

### **TypeORMProvider.ts**

```typescript
// ✅ CORRECT: Shared/infra referencia modules quando necessário
import { ClientEntity } from '../../../../modules/clients/infrastructure/typeorm/entities/ClientEntity';

// Isso é aceitável porque:
// 1. É configuração de infraestrutura
// 2. TypeORM precisa conhecer todas as entities
// 3. Não há lógica de negócio aqui
```

### **Repository Implementation**

```typescript
// ✅ CORRECT: Repository no módulo usa entity do próprio módulo
import { ClientEntity } from '../typeorm/entities/ClientEntity';
import { ClientStatus } from '../../domain/enums/ClientStatus';
```

## 📚 **Lições Aprendidas**

1. **🎯 Localização correta de código é crucial** para manter Clean Architecture
2. **🔄 Dependências devem sempre apontar para dentro** (ou para shared genérico)
3. **📦 Shared deve ser verdadeiramente compartilhável** e não específico
4. **🏗️ Coesão de módulo** é mais importante que conveniência de imports

## ✅ **Conclusão**

A decisão de mover `ClientEntity` para `modules/clients/infrastructure/` está correta e segue os princípios de Clean Architecture.

**Infra shared NÃO deve depender de módulos específicos** - sempre que isso acontecer, é sinal de que o código está no lugar errado.
