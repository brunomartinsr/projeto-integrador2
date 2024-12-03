async function obterDadosAluno(id) {
    try {
        const response = await fetch(`https://localhost:3000/gerente/alunos/${id}`);
        if(!response.ok) throw new Error("Erro ao obter dados");
        const dadosAluno = await response.json();

        document.getElementById('nome').textContent = dadosAluno.nome_completo;
        document.getElementById('cpf').textContent = dadosAluno.cpf;
        document.getElementById('matricula').textContent = dadosAluno.matricula;
        document.getElementById('classificação').textContent = dadosAluno.classificação;
        document.getElementById('email').textContent = dadosAluno.email;
        document.getElementById('telefone').textContent = dadosAluno.telefone;
        document.getElementById('peso').textContent = dadosAluno.peso;
        document.getElementById('altura').textContent = dadosAluno.altura;
        document.getElementById('data_nascimento').textContent = dadosAluno.data_de_nascimento;
        document.getElementById('horas_semanais').textContent = dadosAluno.horas_semanais;

    } catch(err) {
        console.log("Erro ao exibir informações", err);
        alert("Erro ao carregar informações do aluno");
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     const paramsURL = new URLSearchParams(window.location.search);
//     const id = paramsURL.get("id");

//     if(id){
//         obterDadosAluno(id);
//     } else {
//         console.log("Erro ao pegar ID da URL");
//         alert("ID não encontrado. Redirecionando para a pagina de login");
//     }
// });