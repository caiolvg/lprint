# LeoPoint - 3D Product Showcase

Uma aplicação fullstack para showcase de produtos 3D usando Google Model Viewer.

## 🚀 Funcionalidades

- Visualização interativa de modelos 3D
- Animações suaves com Framer Motion
- Componentes UI modernos com Radix UI
- Design responsivo com Tailwind CSS
- Banco de dados com Turso (SQLite serverless)

## 💻 Stack Técnico

**Frontend:**

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Query

**Backend:**

- Express.js
- Drizzle ORM
- Turso Database
- TypeScript

## 📦 Instalação

```bash
npm install
```

## 🔧 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

As variáveis necessárias são:

- `DATABASE_URL` - URL da sua instância Turso
- `DATABASE_AUTH_TOKEN` - Token de autenticação Turso

Obtenha as credenciais em [https://turso.tech](https://turso.tech)

## 🛠️ Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Type checking
npm run check

# Atualizar schema do banco
npm run db:push
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Executar em produção
npm run start
```

## 🌐 Deploy na Vercel

O projeto está configurado para deploy automático na Vercel.

### Passos:

1. **Push do repositório para GitHub:**

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Conectar no Vercel:**
   - Acesse [https://vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Selecione seu repositório GitHub
   - Deixe as configurações padrão (detecta automaticamente)

3. **Configurar variáveis de ambiente:**
   - Na aba "Environment Variables" do Vercel, adicione:
     - `DATABASE_URL`
     - `DATABASE_AUTH_TOKEN`
     - `NODE_ENV=production`

4. **Deploy:**
   - Clique em "Deploy"
   - A aplicação será automaticamente deployada em cada push para main

## 📝 Estrutura do Projeto

```
├── client/              # Frontend React
│   └── src/
│       ├── components/  # Componentes React
│       ├── pages/       # Páginas da aplicação
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilitários
├── server/              # Backend Express
│   ├── routes.ts        # Rotas da API
│   ├── db.ts            # Conexão com banco
│   └── index.ts         # Servidor principal
├── shared/              # Código compartilhado
│   ├── schema.ts        # Schema do banco (Drizzle)
│   └── routes.ts        # Definições de rotas
└── script/              # Scripts de build
```

## 🔐 Segurança

- Nunca commite o arquivo `.env` com credenciais reais
- Use `.env.example` como template
- Credentials sensíveis devem ser configuradas apenas no Vercel Dashboard

## 📄 Licença

MIT
