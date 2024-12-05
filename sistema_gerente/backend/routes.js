import express from "express";
import { createPool, getConnection } from "../../bd/connection.js";
import {
  atualizarClassificacao,
  getAlunoById,
  getHorasSemanais,
  getHorasTotais,
} from "../../services/querys.js";
import { formatDate } from "../../services/formaters.js";

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

function determinarClassificacao(horasSemanais) {
  if (horasSemanais <= 5) return "INICIANTE";
  if (horasSemanais <= 10) return "INTERMEDIÁRIO";
  if (horasSemanais <= 20) return "AVANÇADO";
  else return "EXTREMAMENTE AVANÇADO";
}

router.get("/alunos/:id", async (req, res) => {
  try {
    let conn = await getConnection();
    const aluno = await getAlunoById(req.params.id, conn);

    if (!aluno) {
      return res.status(404).send("Aluno não encontrado.");
    }

    const nascimento = new Date(aluno.DATA_DE_NASCIMENTO);
    aluno.DATA_DE_NASCIMENTO = isNaN(nascimento)
      ? "Data inválida"
      : formatDate(nascimento, "br");
      
    const horas_semanais = await getHorasSemanais(aluno.CPF, conn);
    console.log(aluno.CLASSIFICACAO)
    if(aluno.CLASSIFICACAO !== null){
      const classificacao = determinarClassificacao(horas_semanais);
      await atualizarClassificacao(
        aluno.CPF, 
        classificacao,
        conn
      );
      aluno.CLASSIFICACAO = classificacao;
    } else {
      aluno.CLASSIFICACAO = "INICIANTE"
    }
    console.log(aluno.CLASSIFICACAO)
    res.json({ ...aluno, HORAS_SEMANAIS: horas_semanais });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar aluno");
  }
});


router.get("/ord_alunos/:order", async (req, res) => {
  const ordenacao = req.params.order;
  let valorOrdenacao = null;
  const conn = await getConnection();
  let alunos = null;
  try {
    switch (ordenacao) {
      case "nome":
        valorOrdenacao = "NOME_COMPLETO";
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO
          FROM ALUNOS
          ORDER BY NOME_COMPLETO ASC`
        );
        break;
      case "nascimento":
        valorOrdenacao = "DATA_DE_NASCIMENTO";
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, DATA_DE_NASCIMENTO
          FROM ALUNOS
          ORDER BY DATA_DE_NASCIMENTO ASC`
        );
        break;
      case "peso":
        valorOrdenacao = "PESO";
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, PESO
          FROM ALUNOS
          ORDER BY PESO DESC`
        );
        break;
      case "altura":
        valorOrdenacao = "ALTURA";
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO, ALTURA
          FROM ALUNOS
          ORDER BY ALTURA DESC`
        );
        break;
      case "matricula":
        valorOrdenacao = "MATRICULA";
        alunos = await conn.execute(
          `SELECT ID, NOME_COMPLETO
          FROM ALUNOS WHERE MATRICULA = 'ATIVA'
          ORDER BY NOME_COMPLETO ASC`
        );
        break;
      default:
        return res.status(400).res("Ordenação inválida");
    }

    alunos = alunos.rows.map((aluno) => {
      if (valorOrdenacao === "DATA_DE_NASCIMENTO") {
        return [
          aluno.ID,
          aluno.NOME_COMPLETO,
          formatDate(new Date(aluno[valorOrdenacao]), "br"),
        ];
      } else if (
        valorOrdenacao === "NOME_COMPLETO" ||
        valorOrdenacao === "MATRICULA"
      ) {
        return [aluno.ID, aluno.NOME_COMPLETO];
      }
      return [aluno.ID, aluno.NOME_COMPLETO, aluno[valorOrdenacao]];
    });
    console.log(alunos);
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
