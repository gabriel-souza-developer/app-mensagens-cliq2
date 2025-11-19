// ============================================
// ARQUIVO PRINCIPAL - SERVIDOR
// ============================================

const express = require('express');
const axios = require('axios');
const qs = require('querystring');

// Importa as rotas
const {
  router,
  setupAuthRoutes,
  setupCallbackRoute,
  setupFormRoute,
  setupSendRoute
} = require('./routes/routes');

// ============================================
// CONFIGURAÇÕES E CREDENCIAIS
// ============================================
// ⚠️ IMPORTANTE: Substitua os "X" pelas suas credenciais reais!
// Obtenha em: https://api-console.zoho.com/

const CLIENT_ID = "1000.OPM0OVM156F7BA0L4TRDD3BP5F2DGI";
const CLIENT_SECRET = "3e04b9cc2b1658d830271f1eb3a6bc608d1e8d9bb8";
const REDIRECT_URI = "http://localhost:3000/oauth/callback";
const PORT = 3000;

// ============================================
// VARIÁVEIS GLOBAIS (TOKENS)
// ============================================
// accessToken: "Chave temporária" para acessar APIs (expira em ~1 hora)
let accessToken = null;

// refreshToken: "Chave permanente" para gerar novos accessTokens
let refreshToken = null;

// ============================================
// FUNÇÃO: Obter tokens com código OAuth
// ============================================
// O que faz: Troca o código de autorização por access_token e refresh_token
// Quando executa: Logo após o usuário fazer login no Zoho
async function getTokens(code) {
  const data = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code
  };

  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    qs.stringify(data)
  );

  // Armazena os tokens nas variáveis globais
  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;

  console.log("✅ TOKEN GERADO:", accessToken);
  console.log("✅ REFRESH TOKEN:", refreshToken);
}

// ============================================
// FUNÇÃO: Renovar access token
// ============================================
// O que faz: Gera novo accessToken usando o refreshToken
// Quando executa: Quando detectamos erro 401 (token expirado)
async function refreshAccessToken() {
  console.log("🔄 Renovando token...");

  const data = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  };

  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    qs.stringify(data)
  );

  // Atualiza o accessToken com o novo valor
  accessToken = response.data.access_token;
  
  console.log("✅ NOVO ACCESS TOKEN:", accessToken);
}

// ============================================
// FUNÇÃO: Listar canais do Zoho Cliq
// ============================================
// O que faz: Busca todos os canais e filtra apenas onde o usuário participa
// Retorna: Array com os canais filtrados
async function getChannels() {
  try {
    // Faz requisição GET para API do Zoho
    const response = await axios.get(
      "https://cliq.zoho.com/api/v2/channels",
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );

    console.log("📋 Retorno do Zoho /channels:", response.data);

    // Extrai a lista de canais
    let channels =
      response.data?.data?.channels ||
      response.data?.channels ||
      [];

    // Filtra apenas canais onde o usuário participa
    channels = channels.filter(c =>
      c.joined === true ||
      (c.current_user_role && c.current_user_role !== "allowed_users")
    );

    console.log(`✅ Encontrados ${channels.length} canal(is)`);
    
    return channels;

  } catch (err) {
    // Se token expirou (erro 401), renova e tenta novamente
    if (err.response?.status === 401) {
      console.log("⚠️ Token expirado. Renovando...");
      await refreshAccessToken();
      return getChannels(); // Chama a função novamente após renovar
    }
    
    // Se for outro erro, lança exceção
    throw err;
  }
}

// ============================================
// FUNÇÃO: Enviar mensagem para um canal
// ============================================
// O que faz: Envia uma mensagem de texto para o canal especificado
// Parâmetros:
//   - channelId: ID do canal onde enviar
//   - messageText: Texto da mensagem
async function sendMessage(channelId, messageText) {
  try {
    // POST para endpoint de mensagens
    await axios.post(
      `https://cliq.zoho.com/api/v2/channels/${channelId}/message`,
      { text: messageText },
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );

    console.log("✅ Mensagem enviada com sucesso!");

  } catch (err) {
    // Se token expirou, renova e tenta novamente
    if (err.response?.status === 401) {
      console.log("⚠️ Token expirado. Renovando...");
      await refreshAccessToken();
      return sendMessage(channelId, messageText); // Tenta novamente
    }
    
    // Se for outro erro, lança exceção
    throw err;
  }
}

// ============================================
// CALLBACK: Processar retorno do OAuth
// ============================================
// O que faz: Recebe o código do Zoho e troca por tokens
// Depois: Redireciona para a página de formulário
async function handleOAuthCallback(req, res) {
  const { code } = req.query;

  // Verifica se o código foi recebido
  if (!code) {
    return res.send(`
      <h1>❌ Erro</h1>
      <p>Código de autorização não recebido.</p>
      <a href="/">← Voltar</a>
    `);
  }

  try {
    // Obtém os tokens
    await getTokens(code);
    
    // Redireciona para o formulário
    res.redirect('/form');
    
  } catch (err) {
    console.error("❌ Erro ao obter tokens:", err.response?.data || err);
    res.send(`
      <h1>❌ Erro na autenticação</h1>
      <p>Não foi possível obter os tokens. Tente novamente.</p>
      <a href="/">← Voltar</a>
    `);
  }
}

// ============================================
// CONFIGURAR SERVIDOR EXPRESS
// ============================================
const app = express();

// Middlewares para processar dados
app.use(express.urlencoded({ extended: true })); // Formulários HTML
app.use(express.json());                          // JSON

// ============================================
// CONFIGURAR ROTAS
// ============================================
// Passa as credenciais e funções para as rotas

setupAuthRoutes(CLIENT_ID, REDIRECT_URI);  // Configura /login
setupCallbackRoute(handleOAuthCallback);   // Configura /oauth/callback
setupFormRoute(getChannels);               // Configura /form
setupSendRoute(sendMessage);               // Configura /send

// Registra o router no Express
app.use(router);

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Acesse para começar: http://localhost:${PORT}`);
  console.log("=".repeat(50));
});

// ============================================
// RESUMO DO FLUXO:
// ============================================
// 1. Usuário acessa http://localhost:3000 (mostra página inicial)
// 2. Clica em "Entrar com Zoho" (vai para /login)
// 3. Zoho redireciona para /oauth/callback com código
// 4. getTokens() troca código por tokens
// 5. Usuário é redirecionado para /form
// 6. getChannels() lista os canais
// 7. Usuário seleciona canal e digita mensagem
// 8. sendMessage() envia a mensagem
// 9. Se token expirar, renova automaticamente
// ============================================