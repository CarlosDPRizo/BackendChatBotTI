from flask import Flask
from Routes.rotaInfo import rota_info
from Routes.rotaDF import rota_df
from dotenv import load_dotenv
from asgiref.wsgi import WsgiToAsgi

# Carregar variáveis do arquivo .env
load_dotenv()

# Definir host e porta
host = "localhost"
porta = 3000

app = Flask(__name__)

# Configurar middlewares
app.config['JSON_AS_ASCII'] = False  # Garantir suporte a caracteres especiais no JSON

# Configurar as rotas
app.register_blueprint(rota_info, url_prefix="/info")
app.register_blueprint(rota_df, url_prefix="/webhook")

# Servir arquivos estáticos
app.static_folder = './Public'

# Adaptar para ASGI
asgi_app = WsgiToAsgi(app)

# Inicializar o servidor via ASGI
if __name__ == "__main__":
    import uvicorn
    print(f"Servidor escutando em http://{host}:{porta}")
    uvicorn.run(asgi_app, host=host, port=porta)