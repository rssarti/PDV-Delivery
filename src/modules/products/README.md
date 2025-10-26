# Módulo de Produtos - API Documentation

Este módulo gerencia o cadastro e controle de produtos para o sistema PDV/Delivery, incluindo produtos finais, insumos, semi-processados, controle de estoque, preços e informações fiscais.

## 📋 Índice

- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Modelos de Dados](#modelos-de-dados)
- [Exemplos de Requisições](#exemplos-de-requisições)
- [Códigos de Status](#códigos-de-status)

## 🚀 Endpoints Disponíveis

### Base URL: `/products`

| Método | Endpoint       | Descrição                                  |
| ------ | -------------- | ------------------------------------------ |
| POST   | `/`            | Criar um novo produto                      |
| GET    | `/`            | Listar produtos com filtros                |
| GET    | `/:id`         | Buscar produto por ID                      |
| GET    | `/search`      | Buscar produtos por nome                   |
| GET    | `/ingredients` | Listar produtos que podem ser ingredientes |
| GET    | `/low-stock`   | Listar produtos com estoque baixo          |
| GET    | `/expired`     | Listar produtos vencidos                   |
| GET    | `/available`   | Listar produtos disponíveis                |
| PATCH  | `/:id/stock`   | Atualizar estoque do produto               |

---

## 📊 Modelos de Dados

### Enums Disponíveis

#### ProductType

```typescript
enum ProductType {
  INSUMO = 'INSUMO', // Matérias-primas
  SEMI_PROCESSADO = 'SEMI_PROCESSADO', // Produtos em processo
  PRODUTO_FINAL = 'PRODUTO_FINAL', // Produtos finais para venda
}
```

#### UnitType

```typescript
enum UnitType {
  QUILOGRAMA = 'KG',
  GRAMA = 'G',
  LITRO = 'L',
  MILILITRO = 'ML',
  UNIDADE = 'UN',
  PORCAO = 'PORCAO',
  METRO = 'M',
  CENTIMETRO = 'CM',
  PACOTE = 'PACOTE',
  CAIXA = 'CAIXA',
}
```

#### ProductOrigin

```typescript
enum ProductOrigin {
  NACIONAL = 'NACIONAL',
  IMPORTADO_DIRETO = 'IMPORTADO_DIRETO',
  IMPORTADO_TERCEIROS = 'IMPORTADO_TERCEIROS',
}
```

---

## 📝 Exemplos de Requisições

### 1. Criar Produto

**POST** `/products`

#### Body - Produto Final (Ex: Pizza)

```json
{
  "name": "Pizza Margherita",
  "description": "Pizza clássica com molho de tomate, mussarela e manjericão",
  "type": "PRODUTO_FINAL",
  "categoryId": "uuid-categoria-pizzas",
  "baseUnit": "UN",
  "baseQuantity": 1,
  "costPrice": 15.5,
  "salePrice": 35.9,
  "suggestedPrice": 39.9,
  "origin": "NACIONAL",
  "internalCode": "PIZ001",
  "images": ["https://exemplo.com/pizza-margherita.jpg"],
  "preparationTime": 25,
  "minimumStock": 5,
  "currentStock": 20,
  "canBeIngredient": false,
  "needsRecipe": true
}
```

#### Body - Insumo com Preço Fracionário (Ex: Farinha)

```json
{
  "name": "Farinha de Trigo Tipo 1",
  "description": "Farinha de trigo especial para massas",
  "type": "INSUMO",
  "categoryId": "uuid-categoria-farinhas",
  "baseUnit": "KG",
  "baseQuantity": 25,
  "fractionalUnit": "G",
  "fractionalQuantity": 1000,
  "conversionFactor": 0.04,
  "costPrice": 125.0,
  "salePrice": 8.5,
  "ncm": "11010000",
  "icmsRate": 18.0,
  "pisRate": 1.65,
  "cofinsRate": 7.6,
  "origin": "NACIONAL",
  "eanCode": "7891234567890",
  "internalCode": "FAR001",
  "minimumStock": 100,
  "currentStock": 500,
  "canBeIngredient": true,
  "needsRecipe": false
}
```

#### Body - Semi-Processado (Ex: Massa de Pizza)

```json
{
  "name": "Massa de Pizza Tradicional",
  "description": "Massa pronta para pizza, fermentada naturalmente",
  "type": "SEMI_PROCESSADO",
  "categoryId": "uuid-categoria-massas",
  "baseUnit": "UN",
  "baseQuantity": 1,
  "costPrice": 3.5,
  "salePrice": 5.0,
  "origin": "NACIONAL",
  "internalCode": "MAS001",
  "preparationTime": 120,
  "minimumStock": 20,
  "currentStock": 50,
  "canBeIngredient": true,
  "needsRecipe": true,
  "expirationDate": "2024-12-31",
  "batchNumber": "LOT20241026"
}
```

#### Resposta de Sucesso

```json
{
  "success": true,
  "data": {
    "id": "uuid-produto",
    "name": "Pizza Margherita",
    "description": "Pizza clássica com molho de tomate, mussarela e manjericão",
    "type": "PRODUTO_FINAL",
    "categoryId": "uuid-categoria-pizzas",
    "unit": {
      "baseUnit": "UN",
      "baseQuantity": 1,
      "fractionalUnit": null,
      "fractionalQuantity": null,
      "conversionFactor": null
    },
    "pricing": {
      "costPrice": 15.5,
      "salePrice": 35.9,
      "suggestedPrice": 39.9,
      "profitMargin": 131.6
    },
    "stockStatus": "DISPONIVEL",
    "isActive": true,
    "createdAt": "2024-10-26T10:30:00Z",
    "updatedAt": "2024-10-26T10:30:00Z"
  },
  "message": "Produto criado com sucesso"
}
```

### 2. Listar Produtos com Filtros

**GET** `/products?categoryId=uuid&type=PRODUTO_FINAL&minPrice=10&maxPrice=50&searchTerm=pizza`

#### Query Parameters Disponíveis

- `categoryId` - Filtrar por categoria
- `type` - Filtrar por tipo (INSUMO, SEMI_PROCESSADO, PRODUTO_FINAL)
- `stockStatus` - Filtrar por status do estoque
- `isActive` - Filtrar produtos ativos (true/false)
- `canBeIngredient` - Filtrar produtos que podem ser ingredientes (true/false)
- `needsRecipe` - Filtrar produtos que precisam de receita (true/false)
- `minStock` - Estoque mínimo
- `maxStock` - Estoque máximo
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo
- `unit` - Filtrar por unidade
- `searchTerm` - Buscar por nome ou descrição

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-produto-1",
      "name": "Pizza Margherita",
      "type": "PRODUTO_FINAL",
      "pricing": {
        "salePrice": 35.9
      },
      "stockStatus": "DISPONIVEL",
      "currentStock": 20
    }
  ],
  "total": 1
}
```

### 3. Buscar Produto por ID

**GET** `/products/:id`

#### Resposta

```json
{
  "success": true,
  "data": {
    "id": "uuid-produto",
    "name": "Pizza Margherita",
    "description": "Pizza clássica com molho de tomate, mussarela e manjericão",
    "type": "PRODUTO_FINAL",
    "categoryId": "uuid-categoria-pizzas",
    "unit": {
      "baseUnit": "UN",
      "baseQuantity": 1
    },
    "pricing": {
      "costPrice": 15.5,
      "salePrice": 35.9,
      "profitMargin": 131.6
    },
    "taxInfo": {
      "origin": "NACIONAL"
    },
    "availability": {
      "status": "SEMPRE_DISPONIVEL"
    },
    "preparationTime": 25,
    "currentStock": 20,
    "minimumStock": 5,
    "stockStatus": "DISPONIVEL",
    "isActive": true,
    "canBeIngredient": false,
    "needsRecipe": true,
    "createdAt": "2024-10-26T10:30:00Z",
    "updatedAt": "2024-10-26T10:30:00Z"
  }
}
```

### 4. Buscar Produtos por Nome

**GET** `/products/search?q=pizza`

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-produto-1",
      "name": "Pizza Margherita",
      "salePrice": 35.9
    },
    {
      "id": "uuid-produto-2",
      "name": "Pizza Calabresa",
      "salePrice": 39.9
    }
  ],
  "total": 2
}
```

### 5. Listar Ingredientes

**GET** `/products/ingredients`

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-farinha",
      "name": "Farinha de Trigo Tipo 1",
      "type": "INSUMO",
      "unit": {
        "baseUnit": "KG",
        "fractionalUnit": "G"
      },
      "pricing": {
        "costPrice": 125.0,
        "salePrice": 8.5
      },
      "currentStock": 500,
      "canBeIngredient": true
    }
  ],
  "total": 1
}
```

### 6. Atualizar Estoque

**PATCH** `/products/:id/stock`

#### Body - Adicionar Estoque

```json
{
  "quantity": 50,
  "operation": "ADD",
  "batchNumber": "LOT20241026",
  "expirationDate": "2024-12-31"
}
```

#### Body - Remover Estoque

```json
{
  "quantity": 10,
  "operation": "REMOVE"
}
```

#### Resposta

```json
{
  "success": true,
  "data": {
    "id": "uuid-produto",
    "name": "Farinha de Trigo Tipo 1",
    "currentStock": 550,
    "stockStatus": "DISPONIVEL",
    "batchNumber": "LOT20241026",
    "expirationDate": "2024-12-31"
  },
  "message": "Estoque atualizado com sucesso"
}
```

### 7. Produtos com Estoque Baixo

**GET** `/products/low-stock`

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-produto",
      "name": "Molho de Tomate",
      "currentStock": 3,
      "minimumStock": 10,
      "stockStatus": "ESTOQUE_BAIXO"
    }
  ],
  "total": 1
}
```

### 8. Produtos Vencidos

**GET** `/products/expired`

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-produto",
      "name": "Leite Integral",
      "expirationDate": "2024-10-20",
      "stockStatus": "VENCIDO",
      "currentStock": 5
    }
  ],
  "total": 1
}
```

---

## 📊 Códigos de Status

### Sucesso

- `200 OK` - Busca ou listagem realizada com sucesso
- `201 Created` - Produto criado com sucesso

### Erro do Cliente

- `400 Bad Request` - Dados inválidos ou parâmetros obrigatórios ausentes
- `404 Not Found` - Produto não encontrado

### Erro do Servidor

- `500 Internal Server Error` - Erro interno do servidor

---

## 💡 Dicas de Uso

### Produtos com Preços Fracionários

Para produtos vendidos em unidades diferentes da compra (ex: comprar farinha em sacos de 25kg mas vender por grama):

- Use `baseUnit` e `baseQuantity` para a unidade de compra
- Use `fractionalUnit` e `fractionalQuantity` para a unidade de venda
- Defina `conversionFactor` para conversão automática

### Controle de Estoque

- O sistema calcula automaticamente o `stockStatus` baseado no estoque atual vs. mínimo
- Use `batchNumber` e `expirationDate` para controle de lotes e validade
- Produtos vencidos são automaticamente marcados como indisponíveis

### Informações Fiscais

- Campos `ncm`, `cest`, `icmsRate`, `pisRate`, `cofinsRate` são importantes para emissão de notas fiscais
- `origin` define a origem do produto para cálculo de impostos

### Receitas e Ingredientes

- Use `canBeIngredient: true` para produtos que podem compor receitas
- Use `needsRecipe: true` para produtos que precisam de receita para preparo
- `preparationTime` é usado para calcular tempo de preparo de pedidos

---

## 🔧 Configuração

O módulo usa Clean Architecture com:

- **Domain**: Entidades, enums e interfaces de domínio
- **Application**: Casos de uso e regras de negócio
- **Infrastructure**: Controllers, repositories e integrações externas

Dependências registradas no container IoC:

- Repositories, Use Cases e Controllers são injetados automaticamente
- Database connection via TypeORM
- Validações de domínio aplicadas automaticamente
