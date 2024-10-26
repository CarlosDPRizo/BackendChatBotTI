import express from 'express';
import rotaServico from './Routes/rotaServico.js';
import rotaDF from './Routes/rotaDF.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/servico", rotaServico);
app.unsubscribe('/webhook', rotaDF)

const host = "localhost";
const porta = "3000";

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando em http://${host}:${porta}`);
});

