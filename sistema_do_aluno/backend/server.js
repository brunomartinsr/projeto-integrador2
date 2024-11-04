import express from "express";
import cors from "cors";
import connectionBd from "./connection.js";
import { validaCPF, validaEmail } from "./validators.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/login", async (req, res) => {
  const { cpf } = req.body;
  const connection = await connectionBd();

  console.log("Verificando o cpf: ", cpf);

  try {
    const result = await connection.execute(
      `SELECT * FROM ALUNOS WHERE CPF = :cpf`,
      [cpf]
    );

    if (result.rows.length > 0) {
      console.log("Login realizado com o cpf: ", cpf);
      res.send("Login realizado com sucesso");
    } else {
      console.log("não foi possivel encontrar o cpf: ", cpf);
      res.status(404).send("Erro ao realizar o Login");
    }
  } catch (erro) {
    console.error("Erro ao realizar o login: ", erro);
    res.status(500).send("Erro ao realizar o login");
  } finally {
    connection.close();
  }
});

app.post("/cadastrar", (req, res) => {
  const { nome, cpf, email, telefone, data_de_nascimento, peso, altura } =
    req.body;

  if (!validaCPF(cpf) || !validaEmail(email)) {
    res
      .status(400)
      .send(
        "Dados inválidos, por favor verifique os campos e preencha corretamente."
      );
    return;
  }

  const sql = `
    INSERT INTO ALUNOS (NOME_COMPLETO, CPF, EMAIL, TELEFONE, PESO, ALTURA, DATA_DE_NASCIMENTO)
    VALUES (:nome, :cpf, :email, :telefone, :peso, :altura, TO_DATE(:data_de_nascimento, 'YYYY-MM-DD'))
  `;

  connectionBd()
    .then((conn) => {
      conn.execute(
        `SELECT * FROM ALUNOS WHERE CPF = :cpf`,
        [cpf],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Erro ao consultar CPF.");
            conn.close();
            return;
          }

          if (result.rows.length > 0) {
            res.status(400).send("CPF já cadastrado.");
            conn.close();
            return;
          }

          conn.execute(
            sql,
            { nome, cpf, email, telefone, peso, altura, data_de_nascimento },
            { autoCommit: true },
            (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Erro ao cadastrar aluno.");
              } else {
                res
                  .status(200)
                  .json({ message: "Aluno cadastrado com sucesso." });
              }
              conn.close();
            }
          );
        }
      );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erro ao conectar ao banco de dados.");
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
