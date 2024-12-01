import { formatTime, formatDate } from "../../services/formaters.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementsByTagName("form")[0];
  const cpfInput = document.getElementById("cpf_input");
  const btnEntrada = document.getElementById("entrada");
  const btnSaida = document.getElementById("saida");

  let horaEntrada = null;
  let horaSaida = null;
  const dataRegistro = formatDate(new Date());

  btnEntrada.addEventListener("click", () => {
    if (horaEntrada === null) {
      horaEntrada = formatTime(new Date());
      alert("Entrada registrada");
    } else {
      alert("Entrada já registrada");
    }
  });

  btnSaida.addEventListener("click", () => {
    if (horaEntrada !== null && horaSaida === null) {
      horaSaida = formatTime(new Date());
      alert("Saída registrada");
    } else if (horaEntrada === null) {
      alert("É necessário registrar a entrada antes da saída");
    } else {
      alert("Saída já registrada");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (horaEntrada !== null && horaSaida !== null) {
      console.log("Horário de entrada: ", horaEntrada);
      console.log("Horário de saída: ", horaSaida);

      try {
        const cpf = cpfInput.value.trim();
        const response = await fetch(
          "http://localhost:3000/catraca/registrar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cpf,
              hora_entrada: horaEntrada,
              hora_saida: horaSaida,
              data_registro: dataRegistro,
            }),
          }
        );

        if (response.ok) {
          alert("Registro realizado com sucesso!");
          horaEntrada = null;
          horaSaida = null;
        } else {
          const { message } = await response.json();
          alert(message);
        }
      } catch (error) {
        alert("Erro na requisição. Por favor, tente novamente.");
        console.error("Erro na requisição:", error);
      }
    } else {
      alert("Certifique-se de registrar a entrada e a saída antes de enviar.");
    }
  });
});
