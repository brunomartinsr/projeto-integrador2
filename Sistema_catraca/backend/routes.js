import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import { getAlunoByCpf } from "../../services/querys.js";
import { checkCPF } from "../../services/validators.js";

const router = express.Router();
createPool();

router.post("/registrar", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const { cpf, hora_entrada, hora_saida, data_registro } = req.body;

    if (!checkCPF(cpf) || getAlunoByCpf(cpf, conn) == null) {
      res.status(400).send("CPF inválido ou não cadastrado.");
      return;
    } else if (
      new Date(`1970-01-01T${hora_entrada}Z`) >=
      new Date(`1970-01-01T${hora_saida}Z`)
    ) {
      res
        .status(400)
        .send("As horas de entrada e saídas fornecidas estão erradas.");
      return;
    }

    await conn.execute(
      `INSERT INTO REGISTROS_CATRACA (CPF_ALUNO, HORA_ENTRADA, HORA_SAIDA, DATA_REGISTRO) VALUES (:cpf, TO_TIMESTAMP(:hora_entrada, 'HH24:MI:SS'), TO_TIMESTAMP(:hora_saida, 'HH24:MI:SS'), TO_DATE(:data_registro, 'YYYY-MM-DD'))`,
      [cpf, hora_entrada, hora_saida, data_registro],
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
