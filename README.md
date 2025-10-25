# PDV Backend

## 🎯 Sobre o Projeto

Este é um Sistema de Ponto de Venda (PDV) + Gestão Completa + KDS **open source** desenvolvido como parte de um desafio pessoal ambicioso: **criar um negócio do zero utilizando tecnologia, marketing e estratégias inovadoras**.

### 💡 A História por Trás do Código

Como programador e profissional de marketing digital que atuou em diversas empresas, sempre tive o sonho de construir algo próprio. Este projeto representa muito mais que linhas de código - é a materialização de uma jornada empreendedora que combina:

- **Tecnologia de ponta** com arquitetura limpa e escalável
- **Estratégias de marketing digital** para crescimento orgânico
- **Transparência total** através do desenvolvimento open source
- **Compartilhamento de conhecimento** com a comunidade

### 📺 Acompanhe a Jornada

Em breve, estarei documentando toda essa aventura em um **canal no YouTube**, onde vou compartilhar:

- O processo de desenvolvimento do sistema
- Estratégias de marketing e crescimento
- Desafios e aprendizados do empreendedorismo tech
- Construção de um negócio sustentável do zero

> **🚀 Por que Open Source?** Acredito que o conhecimento deve ser compartilhado. Este projeto serve como prova de conceito, portfólio técnico e fonte de aprendizado para outros desenvolvedores que também sonham em empreender.

---

## 🏗️ Arquitetura Técnica

Sistema de Ponto de Venda construído com **Clean Architecture** e princípios **SOLID** para máxima escalabilidade e manutenibilidade.

## 🏗️ Arquitetura Técnica

Sistema de Ponto de Venda construído com **Clean Architecture** e princípios **SOLID** para máxima escalabilidade e manutenibilidade.

### Princípios Aplicados

- **Clean Architecture** com separação clara de camadas
- **SOLID Principles** rigorosamente aplicados
- **Domain Driven Design (DDD)** para modelagem do negócio
- **Repository Pattern** com abstração de dados
- **Dependency Injection** para baixo acoplamento
- **Factory Pattern** para criação de objetos
- **Command Query Responsibility Segregation (CQRS)** ready

### Benefícios da Arquitetura

✅ **Testabilidade**: Cobertura de testes facilitada  
✅ **Manutenibilidade**: Código limpo e organizaddo  
✅ **Escalabilidade**: Preparado para crescimento  
✅ **Flexibilidade**: Fácil troca de tecnologias  
✅ **Reutilização**: Componentes modulares

## 🛠️ Stack Tecnológica

- **Node.js** + **TypeScript**
- **Express.js**
- **TypeORM** (PostgreSQL)
- **Redis** (Cache)
- **RabbitMQ** (Message Broker)
- **Docker** + **Docker Compose**

## 🚀 Como executar

### Desenvolvimento (com Docker)

1. **Clone o repositório**

```bash
git clone https://github.com/rssarti/PDV-Delivery
cd pdv-backend
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o .env conforme necessário
```

3. **Inicie os serviços do Docker**

```bash
# Apenas serviços (PostgreSQL, Redis, RabbitMQ)
pnpm docker:dev

# Ou manualmente:
docker-compose -f docker-compose.dev.yml up -d
```

4. **Instale as dependências**

```bash
pnpm install
```

5. **Execute a aplicação**

```bash
pnpm dev
```

### Produção (com Docker)

```bash
# Build e execução completa
pnpm docker:prod

# Ou manualmente:
docker-compose --profile production up -d
```

## 📋 Scripts disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Executa aplicação em modo desenvolvimento
pnpm build                  # Build da aplicação
pnpm start                  # Executa aplicação em produção

# Qualidade de Código
pnpm lint                   # ESLint com auto-fix
pnpm lint:check             # Verificar problemas sem corrigir
pnpm format                 # Prettier - formatar código
pnpm format:check           # Verificar formatação

# TypeORM & Migrations
pnpm migration:generate     # Gerar nova migration
pnpm migration:run          # Executar migrations
pnpm migration:revert       # Reverter última migration
pnpm migration:show         # Mostrar status das migrations
pnpm schema:sync            # Sincronizar schema (dev only)

# Docker
pnpm docker:dev             # Sobe apenas serviços (dev)
pnpm docker:down            # Para todos os containers
pnpm docker:logs            # Visualiza logs
pnpm docker:build           # Build da imagem da aplicação
pnpm docker:prod            # Execução completa (prod)
pnpm docker:clean           # Remove containers e volumes
```

## 🗄️ Serviços

### PostgreSQL

- **Porta**: 5432
- **Database**: pdv_db
- **User**: postgres
- **Password**: password

### Redis

- **Porta**: 6379
- **Password**: redis123

### RabbitMQ

- **Porta**: 5672 (AMQP)
- **Management UI**: http://localhost:15672
- **User**: rabbitmq
- **Password**: rabbitmq123

## 🌐 Endpoints

```bash
# Base URL
http://localhost:3333

# Vendas
POST   /sales              # Criar venda
PATCH  /sales/:id/cancel   # Cancelar venda
```

## 📁 Estrutura do Projeto

```
src/
├── modules/                    # Módulos de domínio
│   └── sales/
│       ├── entities/          # Entidades de domínio
│       ├── enums/             # Enums
│       ├── repositories/      # Interfaces e implementações
│       └── use-cases/         # Casos de uso
├── shared/                    # Código compartilhado
│   ├── container/            # Dependency Injection
│   └── infra/               # Infraestrutura
│       ├── database/        # Providers de banco
│       ├── http/            # Servidor HTTP
│       └── routes/          # Rotas
```

## 🔧 Configurações

### Configuração de Desenvolvimento

O projeto está configurado com ferramentas modernas para máxima produtividade:

- **ESLint** + **Prettier** para qualidade e formatação automática
- **Auto-fix** ao salvar arquivos no VS Code
- **TypeScript** strict mode para type safety
- **Hot reload** com ts-node-dev
- **Docker Compose** para ambiente consistente

### Extensões VS Code Recomendadas

O projeto inclui configurações automáticas para VS Code:

- ESLint
- Prettier
- TypeScript
- Auto-formatação ao salvar

### Trocar de banco de dados

Edite o `.env`:

```env
# PostgreSQL (padrão)
DB_TYPE=postgres

# MySQL
DB_TYPE=mysql

# SQLite
DB_TYPE=sqlite
DB_DATABASE=./database.sqlite
```

### Diferentes ambientes

```bash
# Desenvolvimento
NODE_ENV=development

# Produção
NODE_ENV=production

# Testes
NODE_ENV=test
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes usam InMemoryRepository automaticamente
```

## 📚 Documentação da Arquitetura

### Repository Pattern

- **ISaleRepository**: Interface (contrato)
- **SaleRepository**: Regras de negócio
- **TypeORMSaleRepository**: Implementação TypeORM
- **InMemorySaleRepository**: Para testes

### Dependency Injection

```typescript
// Container resolve automaticamente
const saleRepository = container.resolve<ISaleRepository>('SaleRepository');
```

### Factory Pattern

```typescript
// Factory cria repository baseado no ambiente
const repository = RepositoryFactory.createSaleRepository(dataSource);
```

## 🐳 Docker

### Desenvolvimento

```bash
# Apenas serviços
docker-compose -f docker-compose.dev.yml up -d
```

### Produção

```bash
# Aplicação completa
docker-compose --profile production up -d
```

### Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f postgres
```

## 🤝 Contribuição & Comunidade

### Como Contribuir

Este projeto é **100% open source** e contributions são muito bem-vindas! Seja você:

- **Desenvolvedor iniciante** querendo aprender
- **Profissional experiente** com sugestões de melhorias
- **Empreendedor tech** com ideias de funcionalidades
- **Estudante** buscando conhecimento prático

### Processo de Contribuição

1. **Fork** o projeto
2. Crie uma **branch** descritiva (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request** detalhado

### Padrões do Projeto

- **Conventional Commits** para mensagens padronizadas
- **Clean Code** e **SOLID principles**
- **Testes** para novas funcionalidades
- **Documentação** atualizada
- **TypeScript** com tipagem forte

### Conecte-se

- 🐛 **Issues**: Reporte bugs ou sugira features
- 💬 **Discussions**: Tire dúvidas e compartilhe ideias
- 📺 **YouTube**: Acompanhe o desenvolvimento (canal em breve)
- 🐦 **Twitter**: [@seuusuario](https://twitter.com/seuusuario) (atualizar com seu perfil)

> **💡 Dica para Iniciantes**: Este projeto é uma excelente oportunidade para aprender Clean Architecture, TypeScript avançado e desenvolvimento backend moderno. Não hesite em fazer perguntas!

## 📄 Licença

Este projeto está sob a licença **ISC** - totalmente livre para uso, modificação e distribuição.

---

## 🌟 Inspiração Final

> _"O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é agora."_

Este projeto representa mais que código - é sobre **transformar ideias em realidade**, **compartilhar conhecimento** e **construir algo significativo**.

Se você chegou até aqui, você faz parte desta jornada. Seja contribuindo com código, compartilhando o projeto ou simplesmente se inspirando para criar o seu próprio desafio.

**Vamos construir o futuro juntos! 🚀**

---

### 📊 Status do Projeto

![GitHub stars](https://img.shields.io/github/stars/rssarti/PDV-Delivery?style=social)
![GitHub forks](https://img.shields.io/github/forks/rssarti/PDV-Delivery?style=social)
![GitHub issues](https://img.shields.io/github/issues/rssarti/PDV-Delivery)
![GitHub license](https://img.shields.io/github/license/rssarti/PDV-Delivery)

**Feito com ❤️ por [Rafael Sarti](https://github.com/rssarti)**
