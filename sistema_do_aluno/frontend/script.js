document.addEventListener("DOMContentLoaded", function(){
    const peso_range = document.getElementById("peso");
    const peso_valor = document.getElementById("peso_valor");
    const altura_range = document.getElementById("altura");
    const altura_valor = document.getElementById("altura_valor")

    peso_range.addEventListener("input", function(){
        peso_valor.textContent = peso_range.value;
    })

    altura_range.addEventListener("input", function(){
        altura_valor.textContent = altura_range.value;
    })
})


const nascimento = document.getElementById("nascimento");
const hoje = new Date();
const anoMinimo = hoje.getFullYear() - 100
const anoMaximo = hoje.getFullYear() - 10;
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const dia = String(hoje.getDate()).padStart(2, '0');
nascimento.min = `${anoMinimo}-${mes}-${dia}`;
nascimento.max = `${anoMaximo}-${mes}-${dia}`;

