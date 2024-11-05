document.addEventListener("DOMContentLoaded", function () {
  const peso_range = document.getElementById("peso");
  const peso_valor = document.getElementById("peso_valor");
  const altura_range = document.getElementById("altura");
  const altura_valor = document.getElementById("altura_valor");

  peso_range.addEventListener("input", function () {
    peso_valor.textContent = peso_range.value;
  });

  altura_range.addEventListener("input", function () {
    altura_valor.textContent = altura_range.value;
  });
});

const nascimento = document.getElementById("nascimento");
const hoje = new Date();
const anoMinimo = hoje.getFullYear() - 100;
const anoMaximo = hoje.getFullYear() - 10;
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");
nascimento.min = `${anoMinimo}-${mes}-${dia}`;
nascimento.max = `${anoMaximo}-${mes}-${dia}`;

document
  .getElementById("cadastroForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const nascimento = document.getElementById("nascimento").value;
    const peso = document.getElementById("peso").value;
    const altura = document.getElementById("altura").value;

    const dados = {
      nome: nome,
      cpf: cpf,
      email: email,
      telefone: telefone,
      data_de_nascimento: nascimento,
      peso: peso,
      altura: altura,
    };

    try {
      const response = await fetch("http://localhost:3000/aluno/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        console.error(
          "Erro ao cadastrar:",
          response.status,
          response.statusText,
          respostaErro
        );
        alert("Erro ao cadastrar, dados invalidos!");
      } else {
        const respostaSucesso = await response.json();
        console.log("Cadastro realizado com sucesso:", respostaSucesso);
        alert("Cadastro realizado com sucesso! Indo para a página de login...");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 900);
      }
    } catch (error) {
      console.error("Erro na requisição", error);
    }
  });
