import Info from "../Model/Info.js";

export default class InfoCtrl {
    // Traduzir comandos http em ações negociais
    // Conceito REST
    // Considerar o protocolo HTTP

    gravar(requisicao, resposta) {
        if(requisicao.method == "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;

            // pseudo validação
            if (
                dados.nome && dados.descricao && dados.status && dados.urlImagem
            ) {
                const servico = new Info(
                    0,
                    dados.nome,
                    dados.descricao,
                    dados.status,
                    dados.urlImagem
                );

                servico.gravar()
                    .then(() => {
                        resposta.status(201).json({
                            "status": true,
                            "mensagem": "Info gravada com sucesso!",
                            "id": servico.id
                        });
                    })
                    .catch((error) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar a info: " + error.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados necessários conforme documentação!"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }

    alterar(requisicao, resposta) {
        if(["PUT","PATCH"].includes(requisicao.method) && requisicao.is("application/json")) {
            const dados = requisicao.body;

            // pseudo validação
            if (
                dados.id && dados.nome && dados.descricao && dados.status  && dados.urlImagem
            ) {
                const servico = new Info(
                    dados.id,
                    dados.nome,
                    dados.descricao,
                    dados.status,
                    dados.urlImagem
                );

                servico.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Info alterada com sucesso!"
                        });
                    })
                    .catch((error) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao alterar a info: " + error.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados necessários conforme documentação!"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }
    
    excluir(requisicao, resposta) {
        if(requisicao.method == "DELETE" && requisicao.is("application/json")) {
            const id = requisicao.params.id; // O id deve ser informado na url

            // pseudo validação
            if (id > 0) {
                const info = new Info(id);

                info.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Info excluída com sucesso!"
                        });
                    })
                    .catch((error) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir a info: " + error.message
                        });
                    });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o id na url!"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }
    
    consultar(requisicao, resposta) {
        const termoBusca = requisicao.params.info;
        if(requisicao.method == "GET") {
            const info = new Info(0);

            info.consultar(termoBusca)
                .then((listaInfos) => {
                    resposta.status(200).json({
                        "status": true,
                        listaInfos
                    });
                })
                .catch((error) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível recuperar as infos: " + error.message
                    });
                });
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Método não permitido!"
            });
        }
    }
}