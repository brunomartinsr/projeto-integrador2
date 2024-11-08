import express from "express";
import connectionBd from "../../bd/connection.js";
import { checkCPF, checkEmail } from "../../services/validators.js";
import {
  getAlunoByCpf,
  getHorasSemanais,
  atualizarClassificacao,
} from "../../services/querys.js";

const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
  const { cpf } = req.body;

  if (!checkCPF(cpf)) {
    res
      .status(400)
      .send(
        "CPF inválido, por favor verifique o campo e preencha corretamente."
      );
    return;
  }

  console.log("Verificando o cpf: ", cpf);

  try {
    const connection = await connectionBd();
    const cpfExistente = await getAlunoByCpf(cpf, connection);

    if (cpfExistente) {
      console.log("Login realizado com o cpf: ", cpf);
      res
        .status(200)
        .json({ message: "Login realizado com sucesso!", cpf: cpf });
    } else {
      console.log("Não foi possivel encontrar o cpf: ", cpf);
      res.status(404).send("Erro ao realizar o Login");
    }
  } catch (erro) {
    console.error("Erro ao realizar o login: ", erro);
    res.status(500).send("Erro ao realizar o login");
  }
});

// Rota de cadastro
router.post("/cadastrar", async (req, res) => {
  const { nome, cpf, email, telefone, data_de_nascimento, peso, altura } =
    req.body;

  if (!checkCPF(cpf) || !checkEmail(email)) {
    res
      .status(400)
      .send(
        "Dados inválidos, por favor verifique os campos e preencha corretamente."
      );
    return;
  }

  try {
    const conn = await connectionBd();

    const cpfExistente = await getAlunoByCpf(cpf, conn);
    if (cpfExistente) {
      res.status(400).send("CPF já cadastrado.");
      return;
    }

    const sql = `
      INSERT INTO ALUNOS (NOME_COMPLETO, CPF, EMAIL, TELEFONE, PESO, ALTURA, DATA_DE_NASCIMENTO)
      VALUES (:nome, :cpf, :email, :telefone, :peso, :altura, TO_DATE(:data_de_nascimento, 'YYYY-MM-DD'))
    `;

    await conn.execute(
      sql,
      { nome, cpf, email, telefone, peso, altura, data_de_nascimento },
      { autoCommit: true }
    );
    res.status(200).json({ message: "Aluno cadastrado com sucesso." });
    conn.close();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao conectar ao banco de dados: " + err);
  }
});

// Função para determinar classificação com base nas horas semanais
function determinarClassificacao(horasSemanais) {
  if (horasSemanais <= 5) return "INICIANTE";
  if (horasSemanais <= 10) return "INTERMEDIÁRIO";
  if (horasSemanais <= 20) return "AVANÇADO";
  return "EXTREMAMENTE AVANÇADO";
}

// Rota para obter o relatório do aluno por CPF
router.get("/relatorio/:cpf", async (req, res) => {
  const { cpf } = req.params;

  try {
    const conn = await connectionBd();

    const aluno = await getAlunoByCpf(cpf, conn);
    if (!aluno) {
      return res.status(404).send("CPF não encontrado.");
    }

    const horasSemanais = await getHorasSemanais(cpf, conn);
    const classificacao = determinarClassificacao(horasSemanais);

    await atualizarClassificacao(cpf, classificacao, conn);

    res.status(200).json({
      classificacao: classificacao,
      horas_semanais: horasSemanais,
    });
    conn.close();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
