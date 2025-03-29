from flask import Blueprint, request, render_template
# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from Controller.InfoCtrl import InfoCtrl

# Instanciar o controlador
serv_ctrl = InfoCtrl()

# Criar o blueprint para as rotas
rota_info = Blueprint('rota_info', __name__, template_folder='Public')

@rota_info.route('/home', methods=["GET"])
def home():
    print("Acessando a rota home")
    return render_template('index.html')

# Configurar as rotas
@rota_info.route("/", methods=["GET"])
def consultar_tudo():
    print("Acessando a rota consultar_tudo")
    return serv_ctrl.consultar(request)

@rota_info.route("/<info>", methods=["GET"])
def consultar_info(info):
    print("Acessando a rota consultar_info")
    return serv_ctrl.consultar(request, info=info)

@rota_info.route("/", methods=["POST"])
def gravar():
    return serv_ctrl.gravar(request)

@rota_info.route("/", methods=["PUT"])
def alterar():
    return serv_ctrl.alterar(request)

@rota_info.route("/<id>", methods=["DELETE"])
def excluir(id):
    return serv_ctrl.excluir(request, id=id)
