import { obterCardsServicos } from "../DialogFlow/funcoes.js";
import Chamado from "../Model/Chamado.js";
import Servico from "../Model/Servico.js";

export default class DFController {
    async processarIntencoes(req, resp) {
        if (req.method == "POST" && req.is("application/json")) {
            const dados = req.body;
            const intencao = dados.queryResult.intent.displayName;
            // Identificar a origem da requisição (custom ou messenger)
                // vetrificar a existência do atributo source
            const origem = dados?.originalDetectIntentRequest?.source;
            let resposta;

            switch(intencao) {
                case 'Default Welcome Intent':
                    resposta = await exibirMenu(origem);
                    break;
                case 'SelecaoSuporte':
                    resposta = await processarEscolha(dados, origem);
                    break;
                // case 'coletaDadosDemandante':
                //     resposta = await identificarUsuario(dados, origem);
                //     break;
                case 'simConcluirDemanda':
                    resposta = await registrarChamado(dados, origem);
                    break;
                // default: 
                //     // Criar uma resposta padrão para o default
                //     break;
            }

            resp.json(resposta);
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
                        "Entre em contato conosco por telefone ☎ (18) 3226-1515."
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
                            "Entre em contato conosco por telefone ☎ (18) 3226-1515."
                        ]
                    }]]
                }
            });
        } // fim else

        return resposta;
    }
}

async function processarEscolha(dados, origem) { // Aplicar um try catch
    let resposta = {
        "fulfillmentMessages": []
    }

    const sessao = dados.session.split('/').pop();
    if (!global.dados) {
        global.dados = {};
    }

    if (!global.dados[sessao]) {
        global.dados[sessao] = {
            'servicos':[]
        }
    }

    let servicosSelecionados = dados.queryResult.parameters.Servico;
    global.dados[sessao]['servicos'].push(...servicosSelecionados); // Gravar os dados na sessão

    let listaMensagens = [];
    for (const serv of servicosSelecionados) {
        const servico = new Servico();
        const resultado = await servico.consultar(serv);

        if (resultado.length > 0) {
            listaMensagens.push(`✅ ${serv} registrado com sucesso! \n`);
        } else {
            listaMensagens.push(`❌ O ${serv} não está disponível! \n`);
        }
    }

    listaMensagens.push('Posso de ajudar em algo mais?');

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text" :[...listaMensagens]
            }
        });
    } else {
        resposta.fulfillmentMessages.push({
            "payload": {
                "richContent": [[{
                    "type": "description",
                    "title": "",
                    "text": [...listaMensagens]
                }]]
            }
        });
    }

    return resposta;
}

async function registrarChamado(dados, origem) {
    const sessao = dados.session.split('/').pop();
    // Fique atento, será necessário recuperar o usuário identificado na sessão
    const usuario = {
        "cpf":"111.111.111-11"
    }

    let listaDeServicos = [];
    const servicosSelecionados = global.dados[sessao]['servicos'];
    const servicoM = new Servico();

    for (const serv of servicosSelecionados) {
        const busca = await servicoM.consultar(serv);

        if (busca.length > 0 ) {
            listaDeServicos.push(busca[0]); // primeiro serviço da lista
        }
    }

    const chamado = new Chamado(0, '', usuario, listaDeServicos);
    await chamado.gravar();

    let resposta = {
        "fulfillmentMessages": []
    }

    
    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text" :[
                    `Chamado nº ${chamado.numero} registrado com sucesso. \n`, // O número está vindo como 0
                    "Anote o número para consulta ou acompanhamento posterior"
                ]
            }
        });
    } else {
        resposta.fulfillmentMessages.push({
            "payload": {
                "richContent": [[{
                    "type": "description",
                    "title": "",
                    "text" :[
                        `Chamado nº ${chamado.numero} registrado com sucesso. \n`, // O número está vindo como 0
                        "Anote o número para consulta ou acompanhamento posterior"
                    ]
                }]]
            }
        });
    }

    return resposta;
}