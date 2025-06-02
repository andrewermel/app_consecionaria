# Cars Service

Microsserviço responsável pelo gerenciamento de veículos, vendas e carrinho da concessionária.

## 🚗 Funcionalidades

- **Gerenciamento de Veículos**: CRUD completo de veículos
- **Sistema de Vendas**: Registro e consulta de vendas
- **Carrinho de Compras**: Adicionar/remover veículos do carrinho
- **Relatórios**: Estatísticas de vendas e veículos

## 📊 Entidades

### Veículo

- ID, ano, preço base, cor, modelo, disponibilidade

### Venda

- ID, tipo (online/física), cliente, vendedor, veículo, data

### Carrinho

- ID, veículo, cliente, data/hora adicionado

## 🚀 Como executar

```bash
# Navegar para o diretório
cd Back/cars-service/cars-service

# Compilar e executar
mvn spring-boot:run
```

## 🔧 Configuração

### application.properties

```properties
# Banco PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/concessionaria
spring.datasource.username=postgres
spring.datasource.password=postgres

# Porta do serviço
server.port=8080
```

## 🛠️ Dependências principais

- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- Spring Boot DevTools

## 🔐 Autenticação

Este serviço **não implementa autenticação própria**. Utiliza JWT gerado pelo user-service para validação de endpoints protegidos.

## 📡 Endpoints principais

- `GET /vehicles` - Listar veículos
- `POST /vehicles` - Criar veículo
- `PUT /vehicles/{id}` - Atualizar veículo
- `DELETE /vehicles/{id}` - Remover veículo
- `GET /sales` - Consultar vendas
- `POST /sales` - Registrar venda
- `GET /cart` - Ver carrinho
- `POST /cart` - Adicionar ao carrinho
