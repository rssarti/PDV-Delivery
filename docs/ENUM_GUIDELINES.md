# Guia de Decisão: Onde Colocar Enums

## 🎯 Regra de Ouro

**Pergunte-se: "Este enum tem significado específico para um domínio ou é verdadeiramente universal?"**

## ✅ Colocar em `shared/domain/enums/` QUANDO:

### 1. Conceitos Técnicos/Infraestrutura

```typescript
// ✅ Conceitos de HTTP - universais
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// ✅ Níveis de log - universais
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
```

### 2. Cross-Cutting Concerns

```typescript
// ✅ Auditoria - se aplica a todos os domínios
enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
}

// ✅ Prioridade - pode ser usado em qualquer contexto
enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
```

### 3. Conceitos de Negócio Universal

```typescript
// ✅ Se TODO o sistema usa as mesmas permissões
enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
}
```

## ❌ Manter em `modules/{domain}/enums/` QUANDO:

### 1. Estados Específicos de Entidade

```typescript
// ❌ Específico para clientes
enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLACKLISTED = 'blacklisted',
}

// ❌ Específico para vendas
enum SaleStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
```

### 2. Workflows Específicos

```typescript
// ❌ Específico para produtos
enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  COMING_SOON = 'coming_soon',
}

// ❌ Específico para pagamentos
enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  DECLINED = 'declined',
  REFUNDED = 'refunded',
}
```

### 3. Tipos de Domínio

```typescript
// ❌ Específico para delivery
enum DeliveryType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  DINE_IN = 'dine_in',
}

// ❌ Específico para pagamentos
enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
}
```

## 🤔 Casos Duvidosos - Como Decidir

### Pergunta 1: "Quantos domínios usam isso?"

- **1 domínio**: Manter específico
- **2+ domínios**: Analisar mais

### Pergunta 2: "Os valores têm o mesmo significado em todos os contextos?"

- **Sim**: Candidato a compartilhado
- **Não**: Manter específico

### Pergunta 3: "Se eu adicionar um valor, afeta outros domínios?"

- **Sim**: Manter específico
- **Não**: Candidato a compartilhado

### Pergunta 4: "É um conceito técnico ou de negócio?"

- **Técnico**: Provavelmente compartilhado
- **Negócio**: Provavelmente específico

## 📊 Exemplos do Nosso Projeto

### ✅ Mantemos Específicos (CORRETO)

```
ClientStatus → modules/clients/domain/enums/
SaleStatus → modules/sales/domain/enums/
ProductStatus → modules/products/domain/enums/
```

### ✅ Compartilhamos (NOVO)

```
Priority → shared/domain/enums/
AuditAction → shared/domain/enums/
LogLevel → shared/domain/enums/
```

## 🚫 Anti-Patterns a Evitar

### ❌ "Status Genérico"

```typescript
// ❌ NUNCA faça isso
enum GenericStatus {
  ACTIVE = 'active', // Ativo para que?
  INACTIVE = 'inactive', // Inativo como?
  PENDING = 'pending', // Pendente de que?
}
```

### ❌ "Enum Gigante"

```typescript
// ❌ NUNCA faça isso
enum EverythingStatus {
  // Clientes
  CLIENT_ACTIVE = 'client_active',
  CLIENT_INACTIVE = 'client_inactive',
  // Vendas
  SALE_OPEN = 'sale_open',
  SALE_CANCELLED = 'sale_cancelled',
  // Produtos
  PRODUCT_AVAILABLE = 'product_available',
  // ... 50 valores diferentes
}
```

## ✅ Nossa Decisão Final

**Manter a estrutura atual:** Enums específicos por domínio com compartilhamento apenas de conceitos verdadeiramente universais.
