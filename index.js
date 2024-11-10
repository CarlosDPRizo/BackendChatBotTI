import express from 'express';
import rotaInfo from './Routes/rotaInfo.js';
import rotaDF from './Routes/rotaDF.js';
import dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/info", rotaInfo);
app.use('/webhook', rotaDF);

app.use(express.static('./Public'));

const host = "localhost";
const porta = "3000";

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando em http://${host}:${porta}`);
});

