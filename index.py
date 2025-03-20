from flask import Flask
from routes.rota_info import rota_info
from routes.rota_df import rota_df
import os
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)

# Configurar middlewares
app.config['JSON_AS_ASCII'] = False  # Garantir suporte a caracteres especiais no JSON

# Configurar as rotas
app.register_blueprint(rota_info, url_prefix="/info")
app.register_blueprint(rota_df, url_prefix="/webhook")

# Servir arquivos estáticos
app.static_folder = './Public'

# Configuração de host e porta
host = "localhost"
porta = 3000

# Inicializar o servidor
if __name__ == "__main__":
    print(f"Servidor escutando em http://{host}:{porta}")
    app.run(host=host, port=porta, debug=True)
