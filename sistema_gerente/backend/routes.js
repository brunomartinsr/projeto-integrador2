import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import { getAlunoById } from "../../services/querys.js";

const router = express.Router();
createPool();

router.get("/alunos", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute("SELECT * FROM ALUNOS");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar alunos");
  }
});

router.get("/alunos/:id", async (req, res) => {
  try {
    const connection = await getConnection();
    const aluno = await getAlunoById(req.params.id, connection);
    res.json(aluno);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar aluno");
  }
});

// router.get("/ord_alunos/:order", async (req, res) => {
//   try {
//     const ordenacao = req.params.order;
//     const connection = await getConnection();
//     let result = null;
//     if (ordenacao === "classificacao") {
//       result = await connection.execute(
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
