import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import { getAlunoByCpf } from "../../services/querys.js";
import { formatTime, formatDate } from "../../services/formaters.js";
import { checkCPF } from "../../services/validators.js";

const router = express.Router();
createPool();

router.post("/registrar", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const { cpf, hora_entrada, hora_saida, data_registro } = req.body;
    const entrada = new Date(`1970-01-01T${hora_entrada}Z`);
    const saida = new Date(`1970-01-01T${hora_saida}Z`);
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

    await conn.execute(
      `INSERT INTO REGISTROS_CATRACA (CPF_ALUNO, HORA_ENTRADA, HORA_SAIDA, DATA_REGISTRO) VALUES (:cpf, TO_TIMESTAMP(:hora_entrada, 'HH24:MI:SS'), TO_TIMESTAMP(:hora_saida, 'HH24:MI:SS'), TO_DATE(:data_registro, 'YYYY-MM-DD'))`,
      {
        cpf,
        hora_entrada: horaEntradaFormated,
        hora_saida: horaSaidaFormated,
        data_registro: dataRegistroFormated,
      },
      { autoCommit: true }
    );
    res.status(200).json({ message: "Acesso registrado com sucesso." });
  } catch (err) {
    console.error("Erro ao registrar acesso: ", err);
    res.status(500).send("Erro ao registrar acesso: " + err.message);
  } finally {
    try {
      await conn.close();
    } catch (err) {
      console.error("Erro ao fechar a conexão: ", err);
    }
  }
});

export default router;
