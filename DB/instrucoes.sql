CREATE TABLE IF NOT EXISTS usuario(
	pk_usu_cpf varchar(14) not null primary key,
	nome varchar(100) not null
);

CREATE TABLE IF NOT EXISTS chamado(
    numero int not null primary key auto_increment,
    data varchar(10) not null,
    fk_usu_cpf varchar(14) not null,
    constraint fk_usuario foreign key(fk_usu_cpf) references usuario(pk_usu_cpf)
);

CREATE TABLE IF NOT EXISTS chamado_servico(
	fk_cha_numero int not null,
	fk_serv_id int not null,
	constraint fk_chamado foreign key(fk_cha_numero) references chamado(numero),
	constraint fk_servico foreign key(fk_serv_id) references servico(id)
)