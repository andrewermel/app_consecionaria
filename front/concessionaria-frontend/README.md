# Concessionária Frontend

Interface web moderna para o sistema de concessionária, desenvolvida com React + TypeScript + Vite.

## 🎨 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Material-UI** - Componentes de interface
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Formik + Yup** - Gerenciamento de formulários

## 🚀 Como executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Construir para produção
npm run build

# Prévia da build de produção
npm run preview
```

## 🌐 Acesso

- **Desenvolvimento**: http://localhost:5173
- **API User Service**: http://localhost:8081
- **API Cars Service**: http://localhost:8080

## 👤 Usuários para teste

### Vendedor

- **Login**: vendedor@teste.com
- **Senha**: 123456

### Cliente

- **Login**: cliente@teste.com
- **Senha**: 123456

## 📱 Funcionalidades

### Área do Vendedor

- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de usuários
- ✅ Cadastro e edição de veículos
- ✅ Visualização de vendas
- ✅ Relatórios detalhados

### Área do Cliente

- ✅ Catálogo de veículos
- ✅ Carrinho de compras
- ✅ Finalização de compra
- ✅ Desconto VIP automático

## 🛠️ Scripts disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Verificação de código
- `npm run preview` - Prévia da build

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Context API (autenticação)
├── pages/          # Páginas da aplicação
├── services/       # Integração com APIs
└── utils/          # Utilitários e temas
```

## 🔧 Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_CARS_SERVICE_URL=http://localhost:8080
```

## 🎯 Compatibilidade

- **Node.js**: 18+
- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Vite**: 4.5.14 (compatibilidade com Node.js 22)
