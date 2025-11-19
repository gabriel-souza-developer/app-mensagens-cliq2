// ============================================
// HTML: PÁGINA INICIAL
// ============================================
function renderHome() {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zoho Cliq - Login</title>
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
        
        h1 {
          color: #333;
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
          padding: 15px 30px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        button:hover {
          background: #5568d3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bem-vindo!</h1>
        <p>Faça login com sua conta Zoho para começar a enviar mensagens nos canais.</p>
        <a href="/login">
          <button>Entrar com Zoho</button>
        </a>
      </div>
    </body>
    </html>
  `;
}

module.exports = { renderHome };