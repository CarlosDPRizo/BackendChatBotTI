import Info from "../Model/Info.js";
import conectar from "./Conexao.js";

export default class InfoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Criar a tabela serviço caso ela não exista
            const sql = `
                CREATE TABLE IF NOT EXISTS info(
                    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    nome VARCHAR(100) NOT NULL,
                    descricao VARCHAR(200) NOT NULL,
                    status VARCHAR(100) NOT NULL,
                    urlImagem VARCHAR(500) NOT NULL
                )
            `;
    
            const conexao = await conectar();
            await conexao.execute(sql);
            console.log("Tabela info iniciada com sucesso!");
        } catch(error) {
            console.log("Não foi possível iniciar a tabela info: " + error.message)
        }
    }

    async gravar(info) {
        if (info instanceof Info) {
            const sql = `
                INSERT INTO info (nome,descricao,status,urlImagem)
                VALUES (?,?,?,?,?,?)
            `;

            const parametros = [
                info.nome,
                info.descricao,
                info.status,
                info.urlImagem
            ];

            const conexao = await conectar();
            const resultado = await conexao.execute(sql,parametros);
            info.id = resultado[0].insertId;
        }
    }

    async alterar(info) {
        if (info instanceof Info) {
            const sql = `
                UPDATE info 
                    SET
                        nome = ?,
                        descricao = ?,
                        status = ?,
                        urlImagem = ?
                    WHERE id= ?
            `;

            const parametros = [
                info.nome,
                info.descricao,
                info.status,
                info.urlImagem,
                info.id
            ];

            const conexao = await conectar();
            await conexao.execute(sql,parametros);
        }
    }

    async excluir(info) {
        if (info instanceof Info) {
            const sql = `
                DELETE FROM info 
                    WHERE id= ?
            `;

            const parametros = [
                info.id
            ];

            const conexao = await conectar();
            await conexao.execute(sql,parametros);
        }
    }

    async consultar(termoBusca) {
        if (!termoBusca) {
            termoBusca = '';
        }

        const sql = `
            SELECT *
            FROM info
            WHERE descricao LIKE ?
            ORDER BY nome
        `;

        const parametros = ["%" + termoBusca + "%"];
        const conexao = await conectar();
        const [registros, campos] = await conexao.query(sql,parametros);
        let listaServicos = [];

        for (const registro of registros) {
            const info = new Info(
                registro['id'],
                registro['nome'],
                registro['descricao'],
                registro['status'],
                registro['urlImagem']
            );

            listaServicos.push(info);
        }

        return listaServicos;
    }
}