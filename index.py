from flask import Flask
from Routes.rotaInfo import rota_info
from Routes.rotaDF import rota_df
from dotenv import load_dotenv
from asgiref.wsgi import WsgiToAsgi
from train import train_and_save_model
import os

load_dotenv()

def create_app():
    # Treina o modelo antes de iniciar o servidor
    if not os.path.exists("modelos/tempo_saida_model"):
        train_and_save_model()

    app = Flask(__name__)
    app.config['JSON_AS_ASCII'] = False
    app.register_blueprint(rota_info, url_prefix="/info")
    app.register_blueprint(rota_df, url_prefix="/webhook")
    app.static_folder = './Public'
    return app

app = create_app()
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 3000))
    print(f"Servidor escutando em http://{host}:{port}")
    uvicorn.run(asgi_app, host=host, port=port)