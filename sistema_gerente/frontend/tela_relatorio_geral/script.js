async function carregarDadosAlunos(filtro = null) {
  let response = null;
  if (filtro === null) {
    response = await fetch("http://localhost:3000/gerente/alunos");
  } else {
    response = await fetch(
      `http://localhost:3000/gerente/ord_alunos/${filtro}`
    );
  }
  return await response.json();
}

function popularLista(alunos, alunosLista) {
  alunos.forEach((aluno) => {
    const alunoItem = document.createElement("li");
    alunoItem.id = "aluno_item";
    const alunoLink = document.createElement("a");
    alunoLink.id = "aluno_link";

    alunoLink.href = `./aluno.html?id=${aluno[0]}`;
    alunoLink.textContent = aluno[1];
    alunoItem.appendChild(alunoLink);
    if (aluno[2] !== undefined) {
      const dadoAdicional = document.createElement("span");
      dadoAdicional.id = "dado_adicional";
      dadoAdicional.textContent = aluno[2];
      alunoItem.appendChild(dadoAdicional);
    }
    alunosLista.appendChild(alunoItem);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const alunosLista = document.getElementById("listaAlunos");
  let alunos = await carregarDadosAlunos();
  popularLista(alunos, alunosLista);

  const filtro = document.getElementById("filtro");
  filtro.addEventListener("change", () => {
    alunosLista.innerHTML = "";
    alunos = carregarDadosAlunos(filtro.value);
    popularLista(alunos, alunosLista);
  });
});
