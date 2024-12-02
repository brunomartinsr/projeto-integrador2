import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import { getAlunoById, getHorasTotais, calcHoras } from "../../services/querys.js";

const router = express.Router();
createPool();

router.get("/alunos", async (req, res) => {
  let conn = await getConnection();
  try {
    const alunos = await conn.execute(
      `SELECT CPF, NOME_COMPLETO FROM ALUNOS`
    );
    if (alunos.rows.length === 0) {
      return res.status(404).send("Nenhum aluno encontrado");
    }
    const info_aluno = [];

    for (const aluno of alunos.rows) {
      const cpf = aluno.CPF;
      const nome_completo = aluno.NOME_COMPLETO;
      const horas_totais = await getHorasTotais(cpf, conn);

      const horas_treinadas = horas_totais && horas_totais[0] ? horas_totais[0].HORA_TOTAL : "00:00:00";
      info_aluno.push({
        nome: nome_completo,
        horas_treinadas,
      });
    }
    info_aluno.sort((a, b) => {
      const segundosA = calcHoras(a.horas_treinadas);
      const segundosB = calcHoras(b.horas_treinadas); 
      return segundosB - segundosA;
    });

    res.status(200).json(info_aluno);
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
  const info_aluno = [];
  const ordenacao = req.params.order;
  let conn = await getConnection();
  let alunos = null;
  try {
    switch(ordenacao) {
      case "nome":
        alunos = await conn.execute(
          `SELECT CPF, NOME_COMPLETO
          FROM ALUNOS
          ORDER BY NOME_COMPLETO`
        );
        break;
      
      default:
        return res.status(400).res("Ordenação inválida");
    }      

    for(const aluno of alunos.rows) {
      const cpf = aluno.CPF;
      const nome_completo = aluno.NOME_COMPLETO;
      const horas_totais = await getHorasTotais(cpf, conn);

      info_aluno.push({
        nome: nome_completo,
        horas_treinadas: horas_totais ? horas_totais[0].HORA_TOTAL : "00:00:00",
      });
    }

    res.json(info_aluno);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar alunos");
  }
});


export default router;
