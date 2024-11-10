import LogInfo from "../Model/LogInfo.js";
import conectar from "./Conexao.js";

export default class LogInfoDAO {
    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS log_info(
                    fk_info_id int not null,
                    fk_usu_cpf varchar(14) NOT NULL,
                    data varchar(10) NOT NULL,
                    constraint fk_info_log foreign key(fk_info_id) references info(id),
                    constraint fk_usuario_log foreign key(fk_usu_cpf) references usuario(pk_usu_cpf)
                )
            `;

            await conexao.execute(sql);
            conexao.release();

            console.log("Tabela log_info iniciada com sucesso!");
        } catch(erro) {
            console.log("Não foi possível iniciar a tabela log_info: " + error.message)
        }
    }

    async gravar(logInfo) {
        if (logInfo instanceof LogInfo) {
            const conexao = await conectar();

            try {
                conexao.beginTransaction();
                const data = new Date();

                for (const inf of logInfo.infos) {
                    const sqlLogInfos = "INSERT INTO log_info(fk_info_id, fk_usu_cpf, data) VALUES(?, ?, ?)";
                    const parametros = [inf.id, logInfo.usuario.cpf, data.toLocaleDateString()];
                    await conexao.execute(sqlLogInfos, parametros)
                }

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