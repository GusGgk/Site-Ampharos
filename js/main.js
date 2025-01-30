document.addEventListener("DOMContentLoaded", function () {
    const infoBoxes = document.querySelectorAll(".info-box");
  
    infoBoxes.forEach(box => {
      box.addEventListener("click", function () {
        this.classList.toggle("ativo"); // Alterna entre resumo e completo
      });
    });
  });