import Info from "../Model/Info.js"
export function criarMessengerCard(){
    return {
        type:"info",
        title:"",
        subtitle:"",
        image: {
            src : {
                rawUrl:""
            }
        },
        actionLink:""
    }
} //fim da função criarMessengerCard

export function criarCustomCard(){
    //exibir nos ambientes padrões, tais como: ambiente de teste do DialogFlow, slack, etc
    return {
        card: {
            title:"",
            subtitle:"",
            imageUri:"",
            buttons: [
                {
                    text:"botão",
                    postback:""
                }
            ]
        }
    }
} // fim da função criarCustomCard

export async function obterCardsInfos(tipoCard="custom"){
    const listaCardsServicos = [];
    const info = new Info();
    const infos = await info.consultar();


    for (const info of infos){
        let card;

        if (tipoCard=="custom"){
            card = criarCustomCard();
            card.card.title = info.nome;
            card.card.subtitle = `
                Descrição: ${info.descricao}
            `;
            card.card.imageUri = info.urlImagem;
            card.card.buttons[0].postback = "https://www.ibati.com.br/";
        } else{
            card = criarMessengerCard();
            card.title = info.nome;
            card.subtitle = `
                Descrição: ${info.descricao}
            `;
            card.image.src.rawUrl = info.urlImagem;
            card.actionLink = "https://www.ibati.com.br/";
        }

        listaCardsServicos.push(card);
    }

    return listaCardsServicos;
}