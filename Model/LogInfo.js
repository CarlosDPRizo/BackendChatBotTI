import LogInfoDAO from "../DB/LogInfoDAO.js";

export default class LogInfo{
    #fk_info_id;
    #usuario;
    #data;
    #infos;

    constructor(fk_info_id = 0, usuario={"cpf":""}, data = '', infos = []) {
        this.#fk_info_id = fk_info_id;
        this.#data = data;
        this.#usuario = usuario;
        this.#infos = infos;
    }

    // Getters
    get fk_info_id() {
        return this.#fk_info_id;
    }

    get data() {
        return this.#data;
    }

    get usuario() {
        return this.#usuario;
    }

    get infos() {
        return this.#infos;
    }

    // Setters
    set fk_info_id(fk_info_id) {
        this.#fk_info_id = fk_info_id;
    }

    set data(data) {
        this.#data = data;
    }

    set usuario(usuario) {
        this.#usuario = usuario;
    }

    set infos(infos) {
        this.#infos = infos;
    }

    // Método toJSON
    toJSON() {
        return {
            fk_info_id: this.#fk_info_id,
            data: this.#data,
            usuario: this.#usuario,
            infos: this.#infos,
        };
    }

    async gravar() {
        const chamDAO = new LogInfoDAO();
        await chamDAO.gravar(this);
    }
}