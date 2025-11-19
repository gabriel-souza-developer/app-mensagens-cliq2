// ============================================
// HTML: PÁGINA DE SUCESSO
// ============================================
function renderSuccess() {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mensagem Enviada</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          text-align: center;
          max-width: 400px;
        }
        
        .success-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }
        
        h1 {
          color: #28a745;
          margin-bottom: 10px;
        }
        
        p {
          color: #666;
          margin-bottom: 30px;
        }
        
        button {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }
        
        button:hover {
          background: #5568d3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <h1>Mensagem enviada!</h1>
        <p>Sua mensagem foi entregue com sucesso no canal selecionado.</p>
        <a href="/form">
          <button>Enviar outra mensagem</button>
        </a>
      </div>
    </body>
    </html>
  `;
}

function renderError(message) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .box {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          text-align: center;
        }
        h1 { color: #e74c3c; }
        p { color: #666; margin: 20px 0; }
        a { color: #667eea; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Erro ao enviar mensagem</h1>
        <p>${message || 'Ocorreu um erro inesperado.'}</p>
        <a href="/form">← Tentar novamente</a>
      </div>
    </body>
    </html>
  `;
}

module.exports = { renderSuccess, renderError };