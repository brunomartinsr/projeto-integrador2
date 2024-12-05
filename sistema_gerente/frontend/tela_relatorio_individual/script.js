async function obterDadosAluno(id) {
    try {
        const response = await fetch(`http://localhost:3000/gerente/alunos/${id}`);
        if(!response.ok) throw new Error("Erro ao obter dados");
        const dadosAluno = await response.json();

        document.getElementById('nome').textContent = dadosAluno.NOME_COMPLETO;
        document.getElementById('cpf').textContent = dadosAluno.CPF;
        document.getElementById('matricula').textContent = dadosAluno.MATRICULA;
        document.getElementById('classificacao').textContent = dadosAluno.CLASSIFICACAO;
        document.getElementById('email').textContent = dadosAluno.EMAIL;
        document.getElementById('telefone').textContent = dadosAluno.TELEFONE;
        document.getElementById('peso').textContent = dadosAluno.PESO;
        document.getElementById('altura').textContent = dadosAluno.ALTURA;
        document.getElementById('data_nascimento').textContent = dadosAluno.DATA_DE_NASCIMENTO;
        document.getElementById('horas_semanais').textContent = dadosAluno.HORAS_SEMANAIS;

    } catch(err) {
        console.log("Erro ao exibir informações", err);
        alert("Erro ao carregar informações do aluno");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const paramsURL = new URLSearchParams(window.location.search);
    const id = paramsURL.get("id");

    if(id){
        await obterDadosAluno(id);
    } else {
        console.log("Erro ao pegar ID da URL");
        alert("ID não encontrado na URL");
    }
});