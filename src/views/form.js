// ============================================
// HTML: FORMULÁRIO DE CANAIS
// ============================================
function renderForm(channels) {
  if (!channels || channels.length === 0) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nenhum canal encontrado</title>
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
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Nenhum canal encontrado</h1>
          <p>Você não participa de nenhum canal no Zoho Cliq.</p>
          <a href="/">← Voltar</a>
        </div>
      </body>
      </html>
    `;
  }

  // Gera as opções do dropdown
  const options = channels
    .map(channel => {
      const id = channel.channel_id || channel.id;
      const name = channel.channel_name || channel.name || "Canal sem nome";
      return `<option value="${id}">${name}</option>`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enviar Mensagem - Zoho Cliq</title>
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
          padding: 20px;
        }
        
        .container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 500px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 30px;
          text-align: center;
        }
        
        label {
          display: block;
          color: #555;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        select, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 5px;
          font-size: 14px;
          margin-bottom: 20px;
          font-family: inherit;
        }
        
        select:focus, textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        button {
          width: 100%;
          background: #667eea;
          color: white;
          border: none;
          padding: 15px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
          font-weight: 500;
        }
        
        button:hover {
          background: #5568d3;
        }
        
        .info {
          background: #f0f7ff;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 20px;
          color: #0066cc;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Enviar Mensagem</h1>
        
        <div class="info">
          Encontramos ${channels.length} canal(is) onde você participa
        </div>
        
        <form action="/send" method="post">
          <label for="channel">Selecione o canal:</label>
          <select name="channel" id="channel" required>
            ${options}
          </select>
          
          <label for="message">Digite sua mensagem:</label>
          <textarea 
            name="message" 
            id="message" 
            placeholder="Digite sua mensagem aqui..."
            required
          ></textarea>
          
          <button type="submit">Enviar Mensagem</button>
        </form>
      </div>
    </body>
    </html>
  `;
}

module.exports = { renderForm };