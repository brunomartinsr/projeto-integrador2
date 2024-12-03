import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import { getAlunoById, getHorasTotais } from "../../services/querys.js";

const router = express.Router();
createPool();

router.get("/alunos", async (req, res) => {
  let conn = await getConnection();
  try {
    const alunos = await conn.execute(
      `SELECT ID, CPF, NOME_COMPLETO FROM ALUNOS`
    );
    if (alunos.rows.length === 0) {
      return res.status(404).send("Nenhum aluno encontrado");
    }
    const listaAlunos = [];

    for (const aluno of alunos.rows) {
      const id = aluno.ID;
      const cpf = aluno.CPF;
      const nome = aluno.NOME_COMPLETO;
      const horas_totais = (await getHorasTotais(cpf, conn))
        ? await getHorasTotais(cpf, conn)
        : 0;
      listaAlunos.push([id, nome, horas_totais]);
    }

    listaAlunos.sort((a, b) => {
      if (a[2] < b[2]) {
        return 1;
      }
      if (a[2] > b[2]) {
        return -1;
      }
      return 0;
    });

    console.log(listaAlunos);
    res.status(200).json(listaAlunos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar alunos");
  } finally {
    try {
      await conn.close();
    } catch (err) {
      console.error("Erro ao fechar a conexão: ", err);
    }
  }
});

router.get("/alunos/:id", async (req, res) => {
  try {
    let conn = await getConnection();
    const aluno = await getAlunoById(req.params.id, conn);
    res.json(aluno);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar aluno");
  }
});

router.get("/ord_alunos/:order", async (req, res) => {
  const ordenacao = req.params.order;
  const conn = await getConnection();
  let alunos = null;
  try {
    switch (ordenacao) {
      case "nome":
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO
          FROM ALUNOS
          ORDER BY NOME_COMPLETO ASC`
        );
        break;
      case "nascimento":
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, DATA_DE_NASCIMENTO
          FROM ALUNOS
          ORDER BY DATA_DE_NASCIMENTO DESC`
        );
        break;
      case "peso":
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, PESO
          FROM ALUNOS
          ORDER BY PESO DESC`
        );
        break;
      case "altura":
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, ALTURA
          FROM ALUNOS
          ORDER BY ALTURA DESC`
        );
        break;
      default:
        return res.status(400).res("Ordenação inválida");
    }
    alunos = alunos.rows;
    res.json(alunos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar alunos");
  } finally {
    try {
      await conn.close();
    } catch (err) {
      console.error("Erro ao fechar a conexão: ", err);
    }
  }
});

export default router;
