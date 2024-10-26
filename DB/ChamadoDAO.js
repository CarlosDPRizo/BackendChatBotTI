import Chamado from "../Model/Chamado.js";
import conectar from "./Conexao.js";

export default class ChamadoDAO {
    async init() {
        try {
            const conexao = conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS chamado(
                    numero int not null primary key auto_increment,
                    data varchar(10) not null,
                    fk_usu_cpf varchar(14) not null,
                    constraint fk_usuario foreign key(fk_usu_cpf) references usuario(pk_usu_cpf)
                )
            `;
            conexao.release();
        } catch(erro) {

        }
    }

    async gravar(chamado) {
        if (chamado instanceof Chamado) {
            try {
                const conexao = await conectar();
                conexao.beginTransaction();
                // Inserir o chamado na tabela
                const sqlChamado = "INSERT INTO chamado(data, fk_usu_cpf) VALUES(?, ?)";
                const data = new Date();
                let parametros = [data.toLocaleDateString(), chamado.usuario.cpf];
                const resultado = await conexao.execute(sqlChamado, parametros);
                chamado.numero = resultado[0].insertId;
    
                for (const serf of chamado.servicos) {
                    const sqlServicos = "INSERT INTO chamado_servico(fk_cha_numero, fk_serv_id) VALUES(?,?)";
                    parametros = [chamado.numero, serf.id];
                    conexao.execute(sqlServicos, parametros)
                }
                // resultado = await conexao.execute(sql, parametros);
                conexao.commit();
                conexao.release();
            } catch(erro) {
                if (conexao) {
                    conexao.rollback();
                }
            }
        }
    }
}