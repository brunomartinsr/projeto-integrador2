import express from "express";
import cors from "cors";
import router_aluno from "../sistema_do_aluno/backend/routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/aluno", router_aluno);
// app.use("/catraca", router_catraca);
// app.use("/gerente", router_gerente);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
