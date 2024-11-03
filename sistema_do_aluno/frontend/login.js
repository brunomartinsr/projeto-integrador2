document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const cpf = document.getElementById("cpf_login").value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf })
        });

        if (response.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "relatorio.html";
        } else {
            const errorMessage = await response.text();
            alert("Erro ao realizar o login: " + errorMessage);
        }
    } catch (error) {
        alert('Erro na requisição. Por favor, tente novamente.');
        console.error('Erro na requisição:', error);
    }
});