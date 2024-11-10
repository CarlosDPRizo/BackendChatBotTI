import { obterCardsInfos } from "../DialogFlow/funcoes.js";
import LogInfo from "../Model/LogInfo.js";
import Info from "../Model/Info.js";

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
                case 'InformarProtocoloNome':
                    resposta = await exibirMenu(origem);
                    break;
                case 'ApresentarOpcoes':
                    resposta = await processarEscolha(dados, origem);
                    break;
                case 'ConcluirInformarProtocoloNome':
                    resposta = await devolverEscolhas(dados, origem);
                    break;
                case 'AvaliarConversa':
                    resposta = await registrarLog(dados, origem);
                    break;
                // case 'simConcluirDemanda':
                //     resposta = await registrarLog(dados, origem);
                //     break;
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
        let cards = await obterCardsInfos(tipo);

        if (tipo == 'custom') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": [
                        "Tudo certo, Carlos! \n",
                        "Estamos disponíveis 24h por dia e 7 na semana. \n",
                        "Estamos preparados para te ajudar com as seguintes informações: \n"
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
                        "title": "Tudo certo, Carlos!",
                        "text": [
                            "Estamos disponíveis 24h por dia e 7 na semana. \n",
                            "Estamos preparados para te ajudar com as seguintes informações: \n",
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
                        "Não foi possível recuperar a lista de informações disponíveis.",
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
                        "title": "Não foi possível recuperar a lista de informações disponíveis.",
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
            'infos':[]
        }
    }

    let infosSelecionadas = [dados.queryResult.parameters.informacoes];
    global.dados[sessao]['infos'].push(...infosSelecionadas); // Gravar os dados na sessão

    let listaMensagens = [];
    for (const inf of infosSelecionadas) {
        const info = new Info();
        const resultado = await info.consultar(inf);

        if (resultado.length > 0) {
            listaMensagens.push(`✅ ${inf} registrado com sucesso! \n`);
        } else {
            listaMensagens.push(`❌ O ${inf} não está disponível! \n`);
        }
    }

    listaMensagens.push('Posso te ajudar em algo mais?');

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

async function devolverEscolhas(dados, origem) { // Aplicar um try catch
    let resposta = {
        "fulfillmentMessages": []
    }

    let listaMensagens = [];
    const sessao = dados.session.split('/').pop();
    const infoSelecionadas = global.dados[sessao]['infos'];

    if (infoSelecionadas) {
        const infoM = new Info();
        listaMensagens.push('Essas são as informaçôes que solicitou: \n');

        for (const inf of infoSelecionadas) {
            const busca = await infoM.consultar(inf);

            if (busca.length > 0) {
                listaMensagens.push(`➡️ ${busca[0].descricao}: ${busca[0].status} \n`);
            }
        }

        listaMensagens.push('Obrigado pela paciência, por favor avalie o atendimento com uma nota de 0 a 10.');
    } else {
        listaMensagens.push('Algo deu errado!');
    }

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

async function registrarLog(dados, origem) {
    const sessao = dados.session.split('/').pop();
    // Fique atento, será necessário recuperar o usuário identificado na sessão
    const usuario = {
        "cpf":"111.111.111-11"
    }

    let listaDeInfos = [];
    const infoSelecionadas = global.dados[sessao]['infos'];
    const infoM = new Info();

    for (const inf of infoSelecionadas) {
        const busca = await infoM.consultar(inf);

        if (busca.length > 0 ) {
            listaDeInfos.push(busca[0]); // primeiro serviço da lista
        }
    }

    const chamado = new LogInfo(0, usuario, '', listaDeInfos);
    await chamado.gravar();

    let resposta = {
        "fulfillmentMessages": []
    }

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text" :[
                    `Chegamos ao fim do atendimento. \n`, // O número está vindo como 0
                    "Obrigado pela avaliação, espero ter sido útil."
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
                        `Chegamos ao fim do atendimento. \n`, // O número está vindo como 0
                        "Obrigado pela avaliação, espero ter sido útil."
                    ]
                }]]
            }
        });
    }

    return resposta;
}