let alunos = [];

async function carregarDadosAlunos() {
  const response = await fetch("http://localhost:3000/gerente/alunos");
  alunos = await response.json();
  atualizarListaAlunos();
}

function atualizarListaAlunos(alunosLista) {
  alunosLista.innerHTML = "";
  alunos.forEach((aluno) => {
    const alunoItem = document.createElement("li");
    alunoItem.textContent = aluno.nome;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const alunosLista = document.getElementById("alunos");

  alunos.forEach((aluno) => {
    const alunoItem = document.createElement("li");
    alunoItem.textContent = aluno.nome;
    alunosLista.appendChild(alunoItem);
  });

  const ordenacao = document.getElementById("ordenacao");
  ordenacao.addEventListener("change", () => {
    alunos.sort((a, b) => {
      if (ordenacao.value === "classificacao") {
        const classificacoes = [
          "EXTREMAMENTE AVANÇADO",
          "AVANÇADO",
          "INTERMEDIÁRIO",
          "INICIANTE",
        ];
        return (
          classificacoes.indexOf(a.classificacao) -
          classificacoes.indexOf(b.classificacao)
        );
      } else {
        return a[ordenacao.value] > b[ordenacao.value] ? 1 : -1;
      }
    });

    atualizarListaAlunos(alunosLista);
  });
});
