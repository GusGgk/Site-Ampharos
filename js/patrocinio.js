document.addEventListener("DOMContentLoaded", () => {
  const usuarioAtual = localStorage.getItem("usuarioID") || `usuario-${crypto.randomUUID()}`;
  localStorage.setItem("usuarioID", usuarioAtual);

  const quadradosSelecionados = new Set();

  const criarTabuleiro = (container, isCentral) => {
    for (let i = 0; i < 64; i++) {
      const quadrado = document.createElement("div");
      quadrado.className = "quadrado";

      const idQuadrado = `${container.id}-${i}`;
      quadrado.dataset.id = idQuadrado;

      quadrado.addEventListener("click", () => {
        if (quadradosSelecionados.has(quadrado)) {
          quadradosSelecionados.delete(quadrado);
          quadrado.classList.remove("selecionado");
        } else {
          quadradosSelecionados.add(quadrado);
          quadrado.classList.add("selecionado");
        }
      });

      container.appendChild(quadrado);
    }
  };

  const carregarQuadradosReservados = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/quadrados");
      const dados = await response.json();

      dados.forEach((quadrado) => {
        const elemento = document.querySelector(`[data-id="${quadrado.id}"]`);
        if (elemento) {
          elemento.classList.add("reservado");
          elemento.style.backgroundColor = "#000";
          elemento.dataset.dono = quadrado.usuario;
        }
      });
    } catch (error) {
      console.error("Erro ao carregar quadrados:", error);
    }
  };

  const salvarQuadrados = async () => {
    try {
      for (const quadrado of quadradosSelecionados) {
        const id = quadrado.dataset.id;

        const response = await fetch("http://127.0.0.1:5000/quadrados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            usuario: usuarioAtual,
          }),
        });

        if (response.ok) {
          quadrado.classList.add("reservado");
          quadrado.classList.remove("selecionado");
          quadrado.style.backgroundColor = "#000";
          quadrado.dataset.dono = usuarioAtual;
          quadradosSelecionados.delete(quadrado);
        } else {
          const erro = await response.json();
          alert(erro.error || "Erro ao salvar quadrado!");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar quadrados:", error);
    }
  };

  const resetarMeusQuadrados = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/quadrados");
      const dados = await response.json();

      for (const quadrado of dados) {
        if (quadrado.usuario === usuarioAtual) {
          await fetch(`http://127.0.0.1:5000/quadrados/${quadrado.id}`, {
            method: "DELETE",
          });

          const elemento = document.querySelector(`[data-id="${quadrado.id}"]`);
          if (elemento) {
            elemento.classList.remove("reservado");
            elemento.dataset.dono = "";
            elemento.style.backgroundColor = "#fff"; // Restaura a cor original
          }
        }
      }
    } catch (error) {
      console.error("Erro ao resetar quadrados:", error);
    }
  };

  // Criação do tabuleiro
  const tabuleiroWrappers = document.querySelectorAll(".tabuleiro-wrapper");
  tabuleiroWrappers.forEach((wrapper) => {
    const tabuleiro = wrapper.querySelector(".tabuleiro");
    const isCentral = tabuleiro.id === "pit-central";
    criarTabuleiro(tabuleiro, isCentral);
  });

  // Carregar quadrados ao iniciar
  carregarQuadradosReservados();

  // Botões
  document.getElementById("salvar-quadrado").addEventListener("click", salvarQuadrados);
  document.getElementById("resetar-meus-quadrados").addEventListener("click", resetarMeusQuadrados);
});
