import express from "express";
import connectionBd from "../../bd/connection.js";
import { getAluno } from "../../services/querys.js";

const router = express.Router();
const conn = await connectionBd();

router.post("/registrar", async (req, res) => {
  const { cpf, hora_entrada, hora_saida, data_registro } = req.body;

  if (!checkCPF(cpf) || getAluno(cpf, null, conn) == null) {
    res.status(400).send("CPF inválido ou não cadastrado.");
    return;
  } else if (hora_entrada >= hora_saida) {
    res
      .status(400)
      .send("As horas de entrada e saídas fornecidas estão erradas.");
    return;
  }
  const horaTotal = hora_saida - hora_entrada;
  try {
    await conn.execute(
      `INSERT INTO REGISTROS_CATRACA (CPF_ALUNO, HORA_ENTRADA, HORA_SAIDA, HORA_TOTAL, DATA_REGISTRO) VALUES (:cpf, :hora_entrada, :hora_saida, :hora_total, TO_DATE(:data_registro, 'YYYY-MM-DD'))`,
      [cpf, hora_entrada, hora_saida, horaTotal, data_registro],
      { autoCommit: true }
    );
    res.status(200).json({ message: "Acesso registrado com sucesso." });
  } catch (err) {
    console.error("Erro ao registrar acesso: ", err);
    res.status;
  } finally {
    conn.close();
  }
});
