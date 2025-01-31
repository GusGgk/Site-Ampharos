document.addEventListener("DOMContentLoaded", function () {
  const infoBoxes = document.querySelectorAll(".info-box");

  infoBoxes.forEach(box => {
    box.addEventListener("click", toggleInfo);
    box.addEventListener("touchstart", toggleInfo); // Adiciona suporte ao toque
  });

  function toggleInfo(event) {
    event.preventDefault(); // Evita problemas com o toque duplo
    this.classList.toggle("ativo");
  }
});