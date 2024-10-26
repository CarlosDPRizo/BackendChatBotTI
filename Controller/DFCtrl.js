import { obterCardsServicos } from "../DialogFlow/funcoes.js";

export default class DFController {
    async processarIntencoes(req, resp) {
        if (req.method == "POST" && req.is("application/json")) {
            const dados = req.body;
            const intencao = dados.queryResult.intent.displayName;
            // Identificar a origem da requisição (custom ou messenger)
                // vetrificar a existência do atributo source
            const origem = dados?.originalDetectIntentRequest?.source;

            switch(intencao) {
                case 'Default Welcome Intent':
                    const resposta = await exibirMenu(origem);
                    resp.json(resposta);
                    break;
            }
        }
    } // fim processar intenções
}

async function exibirMenu(tipo = '') {
    let resposta = {
        "fulfillmentMessages": []
    }

    if (tipo) {
        tipo = 'custom';
    }

    try {
        let cards = await obterCardsServicos(tipo);

        if (tipo == 'custom') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": [
                        "Seja bem-vindo ao suporte de TI. \n",
                        "Estamos disponíveis 24h por dia e 7 na semana. \n",
                        "Estamos preparados para te ajudar com os seguintes serviços: \n"
                    ]
                }
            });

            resposta['fulfillmentMessages'].push(...cards);

            resposta['fulfillmentMessages'].push({
                "text": {
                    "text" :[
                        "Por favor nos informe o que você deseja."
                    ]
                }
            });

            return resposta;
        } else { // formato de resposta para o ambiente messenger
            resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        "type": "description",
                        "title": "Seja bem-vindo ao suporte de TI.",
                        "text": [
                            "Estamos disponíveis 24h por dia e 7 na semana. \n",
                            "Estamos preparados para te ajudar com os seguintes serviços: \n",
                        ]
                    }]]
                }
            });

            resposta.fulfillmentMessages[0].payload.richContent[0].push(...cards);
            
            resposta.fulfillmentMessages[0].payload.richContent[0].push({
                "type": "description",
                "title": "Por favor nos informe o que você deseja.",
                "text": []
            });

            return resposta;
        }
    } catch(erro) {
        if (tipo == 'custom') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text" :[
                        "Não foi possível recuperar a lista de suporte dos serviços disponíveis.",
                        "Desculpe-nos pelo transtorno!",
                        "Entre em contato conosco por telefone (18) 3226-1515."
                    ]
                }
            });
        } else { // formato de mensagem para messenger
            resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        "type": "description",
                        "title": "Não foi possível recuperar a lista de suporte dos serviços disponíveis.",
                        "text": [
                            "Desculpe-nos pelo transtorno!",
                            "Entre em contato conosco por telefone (18) 3226-1515."
                        ]
                    }]]
                }
            });
        } // fim else

        return resposta;
    }
}