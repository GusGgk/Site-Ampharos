<<<<<<< HEAD
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
=======
document.addEventListener("DOMContentLoaded", () => {
  let usuarioAtual = localStorage.getItem("usuarioID");
  if (!usuarioAtual) {
    usuarioAtual = `usuario-${crypto.randomUUID()}`;
    localStorage.setItem("usuarioID", usuarioAtual);
  }

  const quadradosSelecionados = new Set();
  const quadradosReservados = JSON.parse(localStorage.getItem("reservados")) || [];

  const criarTabuleiro = (container, isCentral) => {
    for (let i = 0; i < 64; i++) {
      const quadrado = document.createElement("div");
      quadrado.className = "quadrado";

      const idQuadrado = `${container.id}-${i}`;
      quadrado.dataset.id = idQuadrado;

      const reservado = quadradosReservados.find(q => q.id === idQuadrado);
      if (reservado) {
        quadrado.classList.add("reservado");
        quadrado.style.backgroundColor = "#000";
        quadrado.dataset.preco = "";
        quadrado.dataset.dono = reservado.usuario;
      } else {
        if (isCentral) {
          const linha = Math.floor(i / 8) + 1;
          const coluna = (i % 8) + 1;

          // Lista de quadrados especiais com R$ 30,00
          const quadradosEspeciais = [
            "D1", "D2", "D7", "D8",
            "E1", "E2", "E7", "E8"
          ];

          const letraColuna = String.fromCharCode(64 + coluna);
          const posicaoAtual = `${letraColuna}${linha}`;

          if (quadradosEspeciais.includes(posicaoAtual)) {
            quadrado.dataset.preco = "R$ 30,00";
            quadrado.style.backgroundColor = "#ADD8E6";
          } else if (linha >= 3 && linha <= 6 && coluna >= 2 && coluna <= 7) {
            quadrado.classList.add("quadrado-central");
            quadrado.dataset.preco = "R$ 35,00";
            quadrado.style.backgroundColor = "#D2B48C";
          } else {
            quadrado.style.backgroundColor = "#FFF8DC";
            quadrado.dataset.preco = "R$ 25,00";
          }
        } else {
          quadrado.style.backgroundColor = "#fff";
          quadrado.dataset.preco = "R$ 11,00";
        }
      }

      if (!quadrado.classList.contains("reservado")) {
        quadrado.addEventListener("click", () => {
          if (quadradosSelecionados.has(quadrado)) {
            quadradosSelecionados.delete(quadrado);
            quadrado.classList.remove("selecionado");
          } else {
            quadradosSelecionados.add(quadrado);
            quadrado.classList.add("selecionado");
          }
        });
      }

      container.appendChild(quadrado);
    }
  };

  const adicionarMarcacoes = (wrapper, lateral, superior) => {
    for (let i = 1; i <= 8; i++) {
      const numero = document.createElement("span");
      numero.textContent = i;
      lateral.appendChild(numero);
    }
    for (let i = 0; i < 8; i++) {
      const letra = document.createElement("span");
      letra.textContent = String.fromCharCode(65 + i);
      superior.appendChild(letra);
    }
  };

  const tabuleiroWrappers = document.querySelectorAll(".tabuleiro-wrapper");

  tabuleiroWrappers.forEach((wrapper) => {
    const lateral = wrapper.querySelector(".marcacao-lateral");
    const superior = wrapper.querySelector(".marcacao-superior");
    const tabuleiro = wrapper.querySelector(".tabuleiro");
    const isCentral = tabuleiro.id === "pit-central";

    criarTabuleiro(tabuleiro, isCentral);
    adicionarMarcacoes(wrapper, lateral, superior);
  });

  document.getElementById("salvar-quadrado").addEventListener("click", () => {
    quadradosSelecionados.forEach((quadrado) => {
      const idQuadrado = quadrado.dataset.id;

      quadradosReservados.push({ id: idQuadrado, usuario: usuarioAtual });
      localStorage.setItem("reservados", JSON.stringify(quadradosReservados));

      quadrado.classList.add("reservado");
      quadrado.classList.remove("selecionado");
      quadrado.style.backgroundColor = "#000";
      quadrado.dataset.preco = "";
      quadrado.dataset.dono = usuarioAtual;
      quadrado.removeEventListener("click", () => {});
    });

    quadradosSelecionados.clear();
  });

  document.getElementById("resetar-meus-quadrados").addEventListener("click", () => {
    for (let i = quadradosReservados.length - 1; i >= 0; i--) {
      if (quadradosReservados[i].usuario === usuarioAtual) {
        const quadradoId = quadradosReservados[i].id;
        quadradosReservados.splice(i, 1);

        const quadrado = document.querySelector(`[data-id="${quadradoId}"]`);
        if (quadrado) {
          quadrado.classList.remove("reservado");
          quadrado.classList.remove("selecionado");
          quadrado.dataset.dono = "";

          // Restaura o preço original com base nas regras
          if (quadrado.style.backgroundColor === "rgb(173, 216, 230)") {
            quadrado.dataset.preco = "R$ 30,00";
          } else if (quadrado.classList.contains("quadrado-central")) {
            quadrado.dataset.preco = "R$ 35,00";
          } else {
            quadrado.dataset.preco = "R$ 25,00";
          }
        }
      }
    }
    localStorage.setItem("reservados", JSON.stringify(quadradosReservados));
  });
});
>>>>>>> 7feb24d154efb71d9eb0d4828e6e87a9a01e2951
