# Sistema de Concessionária Vanda Carros

Sistema completo de gerenciamento de concessionária desenvolvido com arquitetura de microsserviços.

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Vite + Material-UI
- **Backend**: 2 microsserviços Spring Boot
  - **user-service**: Gerenciamento de usuários e autenticação JWT (porta 8081)
  - **cars-service**: Gerenciamento de veículos, vendas e carrinho (porta 8080)
- **Banco de dados**: PostgreSQL

## 📋 Pré-requisitos

- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 12+**
- **Maven 3.6+**

## 🚀 Como executar

### 1. Configurar banco de dados

```bash
# Conectar ao PostgreSQL como superusuário
psql -U postgres

# Criar banco de dados
CREATE DATABASE concessionaria;

# Sair do PostgreSQL
\q
```

### 2. Executar backend (microsserviços)

```bash
# Terminal 1 - User Service (porta 8081)
cd Back/user-service
mvn spring-boot:run

# Terminal 2 - Cars Service (porta 8080)
cd Back/cars-service/cars-service
mvn spring-boot:run
```

### 3. Executar frontend

```bash
# Terminal 3 - Frontend (porta 5173)
cd front/concessionaria-frontend
npm install
npm run dev
```

### 4. Acessar aplicação

- **Frontend**: http://localhost:5173
- **User Service**: http://localhost:8081
- **Cars Service**: http://localhost:8080

## 👤 Usuários pré-cadastrados

O sistema cria automaticamente usuários para teste:

### Vendedor (acesso completo)

- **Login**: vendedor@teste.com
- **Senha**: 123456
- **Perfil**: VENDEDOR

### Cliente (acesso limitado)

- **Login**: cliente@teste.com
- **Senha**: 123456
- **Perfil**: CLIENTE

## 🔧 Configuração

### Banco de dados

- **Host**: localhost:5432
- **Database**: concessionaria
- **Usuário**: postgres
- **Senha**: postgres

### Portas utilizadas

- **Frontend**: 5173
- **User Service**: 8081
- **Cars Service**: 8080
- **PostgreSQL**: 5432

## 📁 Estrutura do projeto

```
app_consecionaria/
├── Back/
│   ├── user-service/          # Microsserviço de usuários
│   └── cars-service/          # Microsserviço de veículos
├── front/
│   └── concessionaria-frontend/  # Interface React
└── README.md
```

## 🛠️ Funcionalidades

### Para Vendedores

- ✅ Cadastro e gerenciamento de usuários
- ✅ Cadastro e edição de veículos
- ✅ Visualização de vendas
- ✅ Relatórios de vendas
- ✅ Gerenciamento completo do sistema

### Para Clientes

- ✅ Visualização de veículos disponíveis
- ✅ Adição de veículos ao carrinho
- ✅ Finalização de compras
- ✅ Desconto VIP automático

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é gerado no user-service e validado em ambos os microsserviços.

## 🚨 Solução de problemas

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Iniciar PostgreSQL se necessário
sudo systemctl start postgresql
```

### Erro de porta ocupada

```bash
# Verificar processos nas portas
lsof -i :8080
lsof -i :8081
lsof -i :5173

# Encerrar processo se necessário
kill -9 <PID>
```

### Limpar cache do frontend

```bash
cd front/concessionaria-frontend
rm -rf node_modules package-lock.json
npm install
```
