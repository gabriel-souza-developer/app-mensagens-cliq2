// ============================================
// ARQUIVO DE ROTAS
// ============================================
const express = require('express');
const router = express.Router();

// Importa as views
const { renderHome } = require('../views/home');
const { renderForm } = require('../views/form');
const { renderSuccess, renderError } = require('../views/success');

// ============================================
// ROTA: Página inicial
// ============================================
router.get('/', (req, res) => {
  res.send(renderHome());
});

// ============================================
// ROTA: Iniciar login OAuth
// Recebe: CLIENT_ID, REDIRECT_URI via parâmetros da função setup
// ============================================
function setupAuthRoutes(CLIENT_ID, REDIRECT_URI) {
  router.get('/login', (req, res) => {
    const url =
      `https://accounts.zoho.com/oauth/v2/auth` +
      `?response_type=code` +
      `&client_id=${CLIENT_ID}` +
      `&scope=ZohoCliq.Webhooks.CREATE,ZohoCliq.Webhooks.READ,ZohoCliq.Channels.READ` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&access_type=offline` +
      `&prompt=consent`;

    res.redirect(url);
  });
}

// ============================================
// ROTA: Callback OAuth
// Usa função callback passada como parâmetro
// ============================================
function setupCallbackRoute(handleCallback) {
  router.get('/oauth/callback', async (req, res) => {
    try {
      await handleCallback(req, res);
    } catch (err) {
      console.error("Erro no callback:", err);
      res.send("Erro ao processar autenticação. Tente novamente.");
    }
  });
}

// ============================================
// ROTA: Exibir formulário de canais
// ============================================
function setupFormRoute(getChannelsFunction) {
  router.get('/form', async (req, res) => {
    try {
      const channels = await getChannelsFunction();
      res.send(renderForm(channels));
    } catch (err) {
      console.error("Erro ao listar canais:", err);
      res.send(renderError("Erro ao carregar canais. Tente fazer login novamente."));
    }
  });
}

// ============================================
// ROTA: Enviar mensagem
// ============================================
function setupSendRoute(sendMessageFunction) {
  router.post('/send', async (req, res) => {
    try {
      const { channel, message } = req.body;

      if (!channel || !message) {
        return res.send(renderError("Canal e mensagem são obrigatórios."));
      }

      await sendMessageFunction(channel, message);
      res.send(renderSuccess());

    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      res.send(renderError(err.message));
    }
  });
}

// ============================================
// EXPORTA O ROUTER E AS FUNÇÕES DE SETUP
// ============================================
module.exports = {
  router,
  setupAuthRoutes,
  setupCallbackRoute,
  setupFormRoute,
  setupSendRoute
};