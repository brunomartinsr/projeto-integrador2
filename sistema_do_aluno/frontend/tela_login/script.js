document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const cpf = document.getElementById("cpf_login").value;

    try {
      const response = await fetch("http://localhost:3000/aluno/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      if (response.ok) {
        const { id } = await response.json();
        alert("Login realizado com sucesso!");
        window.location.href = `../tela_relatorio/relatorio.html?id=${id}`;
      } else {
        const { message } = await response.json();
        alert(message);
      }
    } catch (error) {
      alert("Erro na requisição. Por favor, tente novamente.");
      console.error("Erro na requisição:", error);
    }
  });
