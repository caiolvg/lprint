# 🚀 Guia de Deploy na Vercel

## Status Atual ✅

Seu projeto está pronto para deploy na Vercel! Os seguintes arquivos foram preparados:

- ✅ `vercel.json` - Configuração de build e deployment
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `.gitignore` - Atualizado para excluir arquivos sensíveis
- ✅ `README.md` - Documentação completa do projeto
- ✅ Commit enviado para GitHub

## 📋 Pré-requisitos

1. Conta no [GitHub](https://github.com)
2. Conta no [Vercel](https://vercel.com)
3. Credenciais do Turso Database (já configuradas no `.env`)

## 🔧 Passos para Deploy

### 1. Acessar Vercel Dashboard

1. Vá para [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Faça login com sua conta GitHub

### 2. Criar Novo Projeto

1. Clique em **"Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Procure por `leoprint` e selecione `cietz/leoprint`

### 3. Configurar Variáveis de Ambiente

Na tela de configuração do projeto:

1. Expanda **"Environment Variables"**
2. Adicione as seguintes variáveis:

| Nome                  | Valor                                                 |
| --------------------- | ----------------------------------------------------- |
| `DATABASE_URL`        | `libsql://leopardoprint-cietz.aws-us-east-2.turso.io` |
| `DATABASE_AUTH_TOKEN` | (seu token Turso)                                     |
| `NODE_ENV`            | `production`                                          |

**⚠️ IMPORTANTE:** Nunca exponha seu `DATABASE_AUTH_TOKEN` publicamente!

### 4. Configuração de Build

Na seção "Build and Output Settings":

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

_Nota: Vercel detectará automaticamente, mas confirme essas configurações._

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (primeira vez pode levar 2-3 min)
3. Acesse sua aplicação via URL fornecida pelo Vercel

## ✨ Após o Deploy

### Configurar Domínio Personalizado (Opcional)

1. No dashboard do Vercel
2. Vá para **Settings** → **Domains**
3. Adicione seu domínio personalizado
4. Configure os registros DNS conforme indicado

### Monitorar Deployments

- **Logs**: Dashboard Vercel → **Deployments** → **Analytics**
- **Erros**: Vercel → **Logs** → **Build** ou **Runtime**

### Redeploy

Para fazer redeploy manualmente:

1. Vá para **Deployments**
2. Clique nos três pontos (⋯) em qualquer deployment
3. Selecione **Redeploy**

## 🔄 CI/CD Automático

Cada push para `main` no GitHub dispara um novo deploy automaticamente no Vercel:

```bash
# Para fazer deploy automático, simplesmente:
git add .
git commit -m "your changes"
git push origin main

# Vercel detectará o push e iniciará o build automaticamente
```

## 🐛 Troubleshooting

### Build falha com erro de banco de dados

**Solução:** Verifique se `DATABASE_URL` e `DATABASE_AUTH_TOKEN` estão corretos no Vercel

```bash
# Teste localmente primeiro
npm run build
npm run start
```

### Asset estático não carrega

**Solução:** Verifique `vite.config.ts` e certifique-se que caminhos estão corretos

### Timeout na primeira requisição

**Normal no cold start.** Serverless functions têm latência inicial. Para melhorar:

1. Mantenha dependências mínimas
2. Use lazy loading quando possível
3. Considere upgradar plano Vercel se tráfego crescer

## 📊 Monitoramento

O Vercel oferece análytics gratuitamente:

- **Speed Insights:** Performance das requisições
- **Web Analytics:** Comportamento dos usuários
- **Logs:** Ver erros em tempo real

Acesse em: **Vercel Dashboard** → **Analytics**

## 🔐 Segurança

- ✅ `.env` está no `.gitignore`
- ✅ Credenciais configuradas no Vercel (não no código)
- ✅ Environment variables privadas no Vercel
- ✅ HTTPS automático em todos os deploys

## 📞 Suporte

- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Turso Docs:** [https://docs.turso.tech](https://docs.turso.tech)
- **Issues no GitHub:** [https://github.com/cietz/leoprint/issues](https://github.com/cietz/leoprint/issues)

---

**🎉 Pronto! Seu projeto está 100% preparado para deploy na Vercel.**
