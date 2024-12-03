async function obterDadosAluno(id) {

    try {
        const response = await fetch(`http://localhost:3000/aluno/relatorio/${id}`);
        if(response.status === 500 ) throw new Error("Erro ao obter dados do aluno");
        const dadosAluno = await response.json();

        document.getElementById('frequencia').textContent = dadosAluno.horas_semanais;
        document.getElementById('classificacao').textContent = dadosAluno.classificacao;

    }catch (error){
        console.log('Erro na requisição', error);
        alert("Erro ao exibir as informações do relatório");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if(id){
        obterDadosAluno(id);
    } else{
        console.log("Erro ao pegar ID da URL");
        alert("ID não encontrado. Redirecionando para a pagina de login");
        setTimeout(() => {
            window.location.href = "../tela_login/index.html";
        }, 600);
    }
})  