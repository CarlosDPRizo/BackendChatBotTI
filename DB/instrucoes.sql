CREATE TABLE IF NOT EXISTS usuario(
	pk_usu_cpf varchar(14) not null primary key,
	nome varchar(100) not null
);

CREATE TABLE IF NOT EXISTS occurrence(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	protocol VARCHAR(10) NOT NULL,
    data varchar(10) NOT NULL,
    fk_usu_cpf varchar(14) NOT NULL,
	veiculo VARCHAR(50) NOT NULL,
	placa VARCHAR(10) NOT NULL,
    constraint fk_usuario_occ foreign key(fk_usu_cpf) references usuario(pk_usu_cpf)
);

CREATE TABLE IF NOT EXISTS info(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	descricao VARCHAR(200) NOT NULL,
	status VARCHAR(100) NOT NULL,
	urlImagem VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS info_occurrence(
	fk_occ_id int not null,
	fk_info_id int not null,
	constraint fk_occurence foreign key(fk_occ_id) references occurrence(id),
	constraint fk_info foreign key(fk_info_id) references info(id)
);

CREATE TABLE IF NOT EXISTS log_info(
	fk_info_id int not null,
    fk_usu_cpf varchar(14) NOT NULL,
    data varchar(10) NOT NULL,
	constraint fk_info_log foreign key(fk_info_id) references info(id),
    constraint fk_usuario_log foreign key(fk_usu_cpf) references usuario(pk_usu_cpf)
);