document.addEventListener("DOMContentLoaded", () => {
  let usuarioAtual = localStorage.getItem("usuarioID");
  if (!usuarioAtual) {
    usuarioAtual = `usuario-${crypto.randomUUID()}`;
    localStorage.setItem("usuarioID", usuarioAtual);
  }

  const quadradosReservados = new Set([
    "pit-central-27", "pit-central-26", "pit-central-28","pit-central-29","pit-central-34","pit-central-35","pit-central-36","pit-central-37",
    "pit-lateral-esquerda-", "pit-lateral-esquerda-",
    "pit-lateral-direita-", "pit-lateral-direita-"
  ]);

  const quadradosSelecionados = new Set();

  const criarTabuleiro = (container, isCentral) => {
    for (let i = 0; i < 64; i++) {
      const quadrado = document.createElement("div");
      quadrado.className = "quadrado";

      const idQuadrado = `${container.id}-${i}`;
      quadrado.dataset.id = idQuadrado;

      if (quadradosReservados.has(idQuadrado)) {
        quadrado.classList.add("reservado");
        quadrado.style.backgroundColor = "#000";
      } else {
        quadrado.addEventListener("click", () => {
          if (quadradosSelecionados.has(quadrado)) {
            quadradosSelecionados.delete(quadrado);
            quadrado.classList.remove("selecionado");
          } else {
            quadradosSelecionados.add(quadrado);
            quadrado.classList.add("selecionado");
          }
        });

        if (isCentral) {
          const linha = Math.floor(i / 8) + 1;
          const coluna = (i % 8) + 1;

          const quadradosEspeciais = ["D1", "D2", "D7", "D8", "E1", "E2", "E7", "E8"];
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
            quadrado.dataset.preco = "R$ 25,00";
            quadrado.style.backgroundColor = "#FFF8DC";
          }
        } else {
          quadrado.dataset.preco = "R$ 11,00";
          quadrado.style.backgroundColor = "#fff";
        }
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
    console.log("Botão de salvar pressionado.");
  });

  document.getElementById("resetar-meus-quadrados").addEventListener("click", () => {
    console.log("Botão de resetar pressionado.");
  });
});
