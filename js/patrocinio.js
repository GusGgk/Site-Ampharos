document.addEventListener("DOMContentLoaded", () => {
  let usuarioAtual = localStorage.getItem("usuarioID");
  if (!usuarioAtual) {
    usuarioAtual = `usuario-${crypto.randomUUID()}`;
    localStorage.setItem("usuarioID", usuarioAtual);
  }

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

      // Regras para quadrados centrais
      if (isCentral) {
        const linha = Math.floor(i / 8) + 1;
        const coluna = (i % 8) + 1;

        const quadradosEspeciais = [
          "D1", "D2", "D7", "D8",
          "E1", "E2", "E7", "E8",
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

  const carregarQuadradosReservados = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/quadrados");
      const reservas = await response.json();

      reservas.forEach(({ id, usuario }) => {
        const quadrado = document.querySelector(`[data-id="${id}"]`);
        if (quadrado) {
          quadrado.classList.add("reservado");
          quadrado.style.backgroundColor = "#000";
          quadrado.dataset.preco = "";
          quadrado.dataset.dono = usuario;
          quadrado.removeEventListener("click", () => {});
        }
      });
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  };

  const salvarQuadrados = async () => {
    console.log("Iniciando salvamento...");
  
    try {
      for (const quadrado of quadradosSelecionados) {
        const id = quadrado.dataset.id;
        console.log(`Salvando quadrado: ${id}`);
  
        const response = await fetch("https://site-ampharos.onrender.com/quadrados");
        const API_BASE_URL = "https://site-ampharos.onrender.com";

        fetch(`${API_BASE_URL}/quadrados`)
          .then((response) => response.json())
          .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados:", error);
         });

        
  
        if (response.ok) {
          console.log(`Quadrado ${id} salvo com sucesso!`);
  
          // Atualizar visualmente
          quadrado.classList.add("reservado");
          quadrado.classList.remove("selecionado");
          quadrado.style.backgroundColor = "#000";
          quadrado.dataset.dono = usuarioAtual;
  
          // Remover da lista de quadrados selecionados
          quadradosSelecionados.delete(quadrado);
        } else {
          const erro = await response.json();
          console.error(`Erro ao salvar quadrado ${id}:`, erro.error);
          alert(erro.error || "Erro ao salvar quadrado!");
        }
      }
    } catch (error) {
      console.error("Erro na comunicação com o backend:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const resetarMeusQuadrados = async () => {
    try {
      const quadradosReservados = document.querySelectorAll(".quadrado.reservado");

      for (const quadrado of quadradosReservados) {
        if (quadrado.dataset.dono === usuarioAtual) {
          const id = quadrado.dataset.id;

          const response = await fetch(`http://127.0.0.1:5000/quadrados/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            quadrado.classList.remove("reservado");
            quadrado.dataset.dono = "";

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
    } catch (error) {
      console.error("Erro ao resetar quadrados:", error);
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

  carregarQuadradosReservados();

  document.getElementById("salvar-quadrado").addEventListener("click", salvarQuadrados);
  document.getElementById("resetar-meus-quadrados").addEventListener("click", resetarMeusQuadrados);
});
