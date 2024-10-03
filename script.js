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