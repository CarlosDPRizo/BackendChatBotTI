from flask import Blueprint, request, render_template, jsonify
# import sys
import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from Controller.InfoCtrl import InfoCtrl

# Instanciar o controlador
info_ctrl = InfoCtrl()

# Criar o blueprint para as rotas
rota_info = Blueprint(
    'rota_info', 
    __name__, 
    template_folder=os.path.join(os.path.dirname(__file__), '../Public')
)

@rota_info.route('/home', methods=["GET"])
def home():
    print("Acessando a rota home", rota_info.template_folder)
    return render_template('index.html')

# Configurar as rotas
@rota_info.route("/", methods=["GET"])
async def consultar_tudo():
    print("Acessando a rota consultar_tudo")
    consultado = await info_ctrl.consultar(request)  # Aguarda a execução da corrotina
    # print("Consultado:", consultado)
    return jsonify(consultado)  # Garante que o retorno seja serializável em JSON

@rota_info.route("/<info>", methods=["GET"])
async def consultar_info(info):
    print("Acessando a rota consultar_info")
    consultado = await info_ctrl.consultar(request, info=info)
    
    return jsonify(consultado)

@rota_info.route("/", methods=["POST"])
def gravar():
    return info_ctrl.gravar(request)

@rota_info.route("/", methods=["PUT"])
def alterar():
    return info_ctrl.alterar(request)

@rota_info.route("/<id>", methods=["DELETE"])
def excluir(id):
    return info_ctrl.excluir(request, id=id)
