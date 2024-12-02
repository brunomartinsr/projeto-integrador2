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

// router.get("/ord_alunos/:order", async (req, res) => {
//   try {
//     const ordenacao = req.params.order;
//     let conn = await getConnection();
//     let result = null;
//     if (ordenacao === "classificacao") {
//       result = await conn.execute(
//         `SELECT *
//       FROM ALUNOS
//       ORDER BY
//         CASE CLASSIFICACAO
//           WHEN 'EXTREMAMENTE AVANÇADO' THEN 1
//           WHEN 'AVANÇADO' THEN 2
//           WHEN 'INTERMEDIÁRIO' THEN 3
//           WHEN 'INICIANTE' THEN 4
//           ELSE 5
//         END
//       `
//       );
//     } else {
//       result = await connection.execute(
//         `SELECT *
//       FROM ALUNOS
//       ORDER BY ${ordenacao}`
//       );
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Erro ao consultar alunos");
//   }
// });

export default router;
