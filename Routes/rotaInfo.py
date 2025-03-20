from flask import Blueprint, request
from controller.info_controller import InfoCtrl

# Instanciar o controlador
serv_ctrl = InfoCtrl()

# Criar o blueprint para as rotas
rota_info = Blueprint('rota_info', __name__)

# Configurar as rotas
@rota_info.route("/", methods=["GET"])
def consultar_tudo():
    return serv_ctrl.consultar(request)

@rota_info.route("/<info>", methods=["GET"])
def consultar_info(info):
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
