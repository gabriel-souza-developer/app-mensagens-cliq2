# Zoho Cliq – Sender & Channel Explorer

Ferramenta em Node.js para listar canais do Zoho Cliq e enviar mensagens utilizando OAuth 2.0.

---

## Sobre o Projeto

Este projeto foi criado para permitir que usuários visualizem os canais do Zoho Cliq (somente aqueles dos quais participam) e enviem mensagens diretamente através de uma interface web simples.

O sistema utiliza o fluxo de autenticação OAuth 2.0 com renovação automática de tokens e consome as APIs oficiais do Zoho Cliq para realizar operações de listagem e envio de mensagens.

---

## Funcionalidades

- Autenticação segura com OAuth 2.0
- Renovação automática do access token via refresh token
- Listagem filtrada de canais (apenas canais onde o usuário participa)
- Envio de mensagens para qualquer canal listado
- Interface web simples e intuitiva
- Tratamento automático de erros de autenticação (401)
- Sistema de retry automático quando o token expira

---

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web minimalista
- **Axios** - Cliente HTTP para requisições à API
- **Querystring** - Manipulação e formatação de parâmetros de URL
- **Zoho Cliq API** - Integração oficial com a plataforma

---

## Estrutura do Projeto
```
app-mensagens-cliq/
├── node_modules/          # Dependências do projeto
├── index.js               # Arquivo principal da aplicação
├── package.json           # Configurações e dependências
├── package-lock.json      # Versões exatas das dependências
└── README.md              # Documentação do projeto
```

---

## Como Configurar

### Passo 1: Criar uma aplicação no Zoho API Console

1. Acesse: https://api-console.zoho.com/
2. Clique em "Add Client" ou "Adicionar Cliente"
3. Configure com as seguintes informações:

**Configurações necessárias:**

- **Client Type:** Server-Based Applications
- **Authorized Redirect URI:** `http://localhost:3000/oauth/callback`
- **Scopes necessários:**
```
  ZohoCliq.Webhooks.CREATE
  ZohoCliq.Webhooks.READ
  ZohoCliq.Channels.READ
```

4. Após criar, você receberá:
   - **Client ID** (exemplo: 1000.XXXXXXXXX)
   - **Client Secret** (guarde em local seguro)

---

### Passo 2: Configurar as credenciais no código

Abra o arquivo `index.js` e substitua os valores das constantes:
```javascript
const CLIENT_ID = "seu_client_id_aqui";
const CLIENT_SECRET = "seu_client_secret_aqui";
const REDIRECT_URI = "http://localhost:3000/oauth/callback";
```

**Importante:** Nunca compartilhe suas credenciais publicamente ou faça commit delas em repositórios públicos.

---

### Passo 3: Instalar as dependências

Abra o terminal na pasta do projeto e execute:
```bash
npm install
```

Este comando instalará todas as bibliotecas necessárias listadas no `package.json`:
- express
- axios
- querystring
- nodemon (apenas para desenvolvimento)

---

### Passo 4: Iniciar o servidor

Para iniciar o servidor, você tem duas opções:

**Modo Produção (sem auto-reload):**
```bash
npm start
```

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

---

## Como Usar

### 1. Acessar a aplicação

Abra seu navegador e acesse: `http://localhost:3000`

### 2. Fazer login

Clique no botão "Entrar com Zoho" e faça login com suas credenciais do Zoho.

### 3. Autorizar permissões

O Zoho solicitará permissão para:
- Ler seus canais
- Criar e ler webhooks
- Enviar mensagens

Clique em "Accept" ou "Aceitar".

### 4. Selecionar canal e enviar mensagem

Após o login, você verá uma lista dos canais onde participa. Selecione um canal e clique em "Enviar Mensagem".

---

## Fluxo de Funcionamento

### Fluxo de Autenticação OAuth 2.0
```
1. Usuário acessa http://localhost:3000
   ↓
2. Clica em "Entrar com Zoho"
   ↓
3. É redirecionado para a página de login do Zoho
   ↓
4. Faz login e autoriza as permissões
   ↓
5. Zoho redireciona para /oauth/callback com um código
   ↓
6. Aplicação troca o código por access_token e refresh_token
   ↓
7. Tokens são armazenados em memória
   ↓
8. Usuário é redirecionado para /form (lista de canais)
```

### Renovação Automática de Token

O sistema monitora todas as requisições à API do Zoho. Quando detecta erro 401 (Unauthorized), automaticamente:

1. Utiliza o refresh_token para obter um novo access_token
2. Atualiza o token em memória
3. Reexecuta a operação que falhou

Isso garante que o usuário não precise fazer login novamente a cada hora.

---

## Endpoints da API Utilizados

### Autenticação
```
POST https://accounts.zoho.com/oauth/v2/token
```
Usado para obter access_token e refresh_token.

### Listar Canais
```
GET https://cliq.zoho.com/api/v2/channels
```
Retorna todos os canais disponíveis. A aplicação filtra apenas os canais onde `joined=true`.

### Enviar Mensagem
```
POST https://cliq.zoho.com/api/v2/channels/{channel_id}/message
```
Envia uma mensagem para o canal especificado.

**Corpo da requisição:**
```json
{
  "text": "Sua mensagem aqui"
}
```

---

## Rotas da Aplicação

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Página inicial com botão de login |
| `/login` | GET | Redireciona para autenticação OAuth do Zoho |
| `/oauth/callback` | GET | Recebe código e troca por tokens |
| `/form` | GET | Lista canais disponíveis |
| `/send` | POST | Envia mensagem para o canal selecionado |

---

## Problemas Conhecidos e Soluções

### Erro 401 - Unauthorized

**Causa:** Token de acesso expirado (tokens expiram após 1 hora de inatividade)

**Solução implementada:** A aplicação detecta automaticamente este erro e renova o token usando o refresh_token, sem necessidade de intervenção do usuário.

### Erro "Cannot GET /"

**Causa:** Servidor não iniciado ou rota inicial não configurada

**Solução:** Certifique-se de que o servidor está rodando (`npm start` ou `npm run dev`) e que a rota `/` está definida no código.

### Erro "oauthtoken_invalid"

**Causa:** Token inválido, expirado ou refresh_token corrompido

**Solução:** A aplicação tenta renovar automaticamente. Se persistir, faça logout e login novamente.

### Erro "EADDRINUSE: address already in use"

**Causa:** Já existe um processo rodando na porta 3000

**Solução:** 
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F
```

---

## Estrutura do Código

### Variáveis Globais
```javascript
let accessToken = null;   // Token de acesso (expira em 1 hora)
let refreshToken = null;  // Token de renovação (não expira)
```

### Funções Principais

**refreshAccessToken()**
- Renova o access_token usando o refresh_token
- Chamada automaticamente quando detecta erro 401

**Tratamento de Erros**
- Utiliza try/catch em todas as requisições
- Verifica status HTTP das respostas
- Implementa retry automático para erros de autenticação

---

## Melhorias Futuras

### Funcionalidades
- Permitir usuário digitar mensagem personalizada
- Envio de arquivos e imagens
- Histórico de mensagens enviadas
- Agendamento de mensagens
- Automação de envio em massa
- Suporte a mensagens com formatação (markdown)

### Interface
- Interface mais moderna com React ou Vue.js
- Design responsivo para dispositivos móveis
- Cards de status das requisições
- Notificações em tempo real
- Tema claro/escuro

### Segurança
- Implementar variáveis de ambiente (.env)
- Armazenamento seguro de tokens (banco de dados)
- Rate limiting para prevenir abuso
- Logs de auditoria

### Código
- Separar rotas em arquivos diferentes
- Implementar testes unitários
- Adicionar validação de dados
- Documentação da API com Swagger

---

## Segurança e Boas Práticas

### Nunca compartilhe:
- Client ID e Client Secret
- Access Token e Refresh Token
- Credenciais de login

### Recomendações:
1. Use variáveis de ambiente para credenciais sensíveis
2. Adicione `.env` ao `.gitignore`
3. Não faça commit de tokens no Git
4. Implemente HTTPS em produção
5. Valide todos os inputs do usuário

### Exemplo de arquivo .gitignore:
```
node_modules/
.env
*.log
.DS_Store
```

---

## Solução de Problemas

### O servidor não inicia

Verifique se:
1. Node.js está instalado (`node --version`)
2. Dependências estão instaladas (`npm install`)
3. Porta 3000 está disponível
4. Não há erros de sintaxe no código

### Login não funciona

Verifique se:
1. CLIENT_ID e CLIENT_SECRET estão corretos
2. REDIRECT_URI está configurada no Zoho API Console
3. URL de callback é exatamente `http://localhost:3000/oauth/callback`
4. Scopes necessários estão habilitados

### Mensagens não são enviadas

Verifique se:
1. Token está válido (não expirou)
2. Você tem permissão para enviar mensagens no canal
3. Canal existe e você é membro
4. Conexão com internet está ativa

---

## Recursos para Aprendizado

### Documentação Oficial
- **Express.js:** https://expressjs.com/
- **Axios:** https://axios-http.com/
- **OAuth 2.0:** https://oauth.net/2/
- **Zoho Cliq API:** https://www.zoho.com/cliq/help/restapi/v2/

### Tutoriais Recomendados
- Node.js básico: https://nodejs.org/en/docs/guides/
- JavaScript moderno (ES6+): https://javascript.info/
- APIs RESTful: https://restfulapi.net/

---

## Contribuindo

Contribuições são bem-vindas! Se você encontrou um bug ou tem uma sugestão:

1. Abra uma issue descrevendo o problema
2. Faça um fork do projeto
3. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT. Você pode usá-lo livremente para fins educacionais e comerciais.

---

## Autor

**Gabriel Souza**

Desenvolvido para facilitar a comunicação via Zoho Cliq através dos canais.

Se este projeto foi útil para você, considere dar uma estrela no repositório!

---

## Perguntas Frequentes (FAQ)

**P: Preciso pagar para usar o Zoho Cliq?**
R: O Zoho Cliq possui planos gratuitos e pagos. Verifique em https://www.zoho.com/cliq/pricing.html

**P: Os tokens ficam salvos onde?**
R: Atualmente ficam em memória (variáveis globais). Ao reiniciar o servidor, é necessário fazer login novamente.

**P: Posso usar em produção?**
R: Este é um projeto educacional. Para produção, implemente segurança adicional (HTTPS, banco de dados, variáveis de ambiente).

**P: Como adicionar mais funcionalidades?**
R: Consulte a documentação da API do Zoho Cliq para descobrir outros endpoints disponíveis.

---

## Changelog

### Versão 1.0.0 (2024)
- Implementação inicial
- Autenticação OAuth 2.0
- Listagem de canais
- Envio de mensagens
- Renovação automática de tokens
- Tratamento de erros 401