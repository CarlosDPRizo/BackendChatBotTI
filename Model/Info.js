import InfoDAO from "../DB/InfoDAO.js"

export default class Info{
    #id
    #nome
    #descricao
    #status
    #urlImagem
    //SLA

    constructor(
        id = 0,
        nome,
        descricao,
        status = "",
        urlImagem = ""
    ) {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#status = status;
        this.#urlImagem = urlImagem;
    }

    get id() {
        return this.#id;
    }
    
    set id(novoId) {
        this.#id = novoId;
    }

    get nome() {
        return this.#nome
    }

    set nome(novoNome) {
        this.#nome = novoNome
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDesc) {
        this.#descricao=novaDesc;
    }

    get status() {
        return this.#status;
    }

    set status(novoStatus) {
        this.#status=novoStatus;
    }

    get urlImagem() {
        return this.#urlImagem;
    }

    set urlImagem(novaUrl) {
        this.#urlImagem=novaUrl;
    }

    //override 
    toJSON() {
        return {
            id:this.#id,
            nome:this.#nome,
            descricao:this.#descricao,
            status:this.#status,
            urlImagem:this.#urlImagem
        }

    }

    async gravar() {
        const infDAO = new InfoDAO();
        await infDAO.gravar(this);
    }

    async alterar() {
        const infDAO = new InfoDAO();
        await infDAO.alterar(this);
    }

    async excluir() {
        const infDAO = new InfoDAO();
        await infDAO.excluir(this);
    }

    async consultar(termoBusca) {
        const infDAO = new InfoDAO();
        return await infDAO.consultar(termoBusca);
    }
}
