document.addEventListener("DOMContentLoaded", function () {
    const blocos = document.querySelectorAll(".bloco");
  
    blocos.forEach(bloco => {
      bloco.addEventListener("click", function () {
        this.classList.toggle("ativo"); // Alterna a classe "ativo"
      });
    });
  });
  