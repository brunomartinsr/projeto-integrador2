import express from "express";
import connectionBd from "../../bd/connection.js";
import { getAlunoByCpf } from "../../services/querys.js";
import { formatTime, formatDate } from "../../services/formaters.js";

const router = express.Router();
const conn = await connectionBd();

router.post("/registrar", async (req, res) => {
  const { cpf, hora_entrada, hora_saida, data_registro } = req.body;
  const entrada = new Date(hora_entrada);
  const saida = new Date(hora_saida);
  const dataRegistro = new Date(data_registro);

  if (!checkCPF(cpf) || getAlunoByCpf(cpf, conn) == null) {
    res.status(400).send("CPF inválido ou não cadastrado.");
    return;
  } else if (entrada >= saida) {
    res
      .status(400)
      .send("As horas de entrada e saídas fornecidas estão erradas.");
    return;
  }

  const horaEntradaFormated = formatTime(entrada);
  const horaSaidaFormated = formatTime(saida);
  const dataRegistroFormated = formatDate(dataRegistro);

  try {
    await conn.execute(
      `INSERT INTO REGISTROS_CATRACA (CPF_ALUNO, HORA_ENTRADA, HORA_SAIDA, DATA_REGISTRO) VALUES (:cpf, TO_DATE(:hora_entrada, 'HH24:MI:SS'), TO_DATE(:hora_saida, 'HH24:MI:SI'), TO_DATE(:data_registro, 'YYYY-MM-DD'))`,
      [cpf, horaEntradaFormated, horaSaidaFormated, dataRegistroFormated],
      { autoCommit: true }
    );
    res.status(200).json({ message: "Acesso registrado com sucesso." });
  } catch (err) {
    console.error("Erro ao registrar acesso: ", err);
    res.status(500).send("Erro ao registrar acesso: " + err.message);
  } finally {
    conn.close();
  }
});

export default router;
