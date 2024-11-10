import { Router } from 'express';
import InfoCtrl from '../Controller/InfoCtrl.js';

const servCtrl = new InfoCtrl();
const rotaInfo = Router();

rotaInfo
    .get("/", servCtrl.consultar)
    .get("/:info", servCtrl.consultar)
    .post("/", servCtrl.gravar)
    .put("/", servCtrl.alterar)
    .delete("/:id", servCtrl.excluir)

export default rotaInfo;