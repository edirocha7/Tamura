# Repositório de Arquivos On-line

Landing pública (`/`) para ver/baixar PDF, JPG, HTML e links sem login + painel do administrador (`/admin`) protegido por senha. Next.js 14 + Vercel Blob.

## Publicar na Vercel
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project** → importe o repositório (Framework: Next.js).
3. Antes do deploy, em **Environment Variables**, crie:
   - `ADMIN_PASSWORD` → a senha do painel
   - `AUTH_SECRET` → texto aleatório longo (ex.: `openssl rand -hex 32`)
4. Faça o deploy. Depois vá em **Storage → Create → Blob**, conecte ao projeto (isso cria `BLOB_READ_WRITE_TOKEN`) e clique em **Redeploy**.
5. Acesse `https://SEU-SITE.vercel.app/admin`, entre com a senha e cadastre os conteúdos.

## Rodar localmente
```
npm install
cp .env.example .env.local   # preencha as 3 variáveis (token: vercel env pull)
npm run dev
```
