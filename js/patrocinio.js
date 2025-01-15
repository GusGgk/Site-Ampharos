// Código JS adaptado para sincronizar com o servidor
const usuarioAtual = localStorage.getItem("usuarioID") || (() => {
  const id = `usuario-${crypto.randomUUID()}`;
  localStorage.setItem("usuarioID", id);
  return id;
})();

const quadradosSelecionados = new Set();
let quadradosReservados = [];

// Função para carregar os quadrados reservados do servidor
const carregarReservas = async () => {
  try {
    const response = await fetch("/api/reservados"); // Rota do servidor para buscar reservas
    if (response.ok) {
      quadradosReservados = await response.json();
    } else {
      console.error("Erro ao carregar reservas do servidor.");
    }
  } catch (error) {
    console.error("Erro na comunicação com o servidor:", error);
  }
};

// Função para atualizar o servidor com as novas reservas
const salvarReservasNoServidor = async (reservas) => {
  try {
    const response = await fetch("/api/reservar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservas),
    });
    if (!response.ok) {
      console.error("Erro ao salvar reservas no servidor.");
    }
  } catch (error) {
    console.error("Erro na comunicação com o servidor:", error);
  }
};

// Criação do tabuleiro
const criarTabuleiro = (container, isCentral) => {
  for (let i = 0; i < 64; i++) {
    const quadrado = document.createElement("div");
    quadrado.className = "quadrado";

    const idQuadrado = `${container.id}-${i}`;
    quadrado.dataset.id = idQuadrado;

    const reservado = quadradosReservados.find((q) => q.id === idQuadrado);
    if (reservado) {
      quadrado.classList.add("reservado");
      quadrado.style.backgroundColor = "#000";
      quadrado.dataset.preco = "";
      quadrado.dataset.dono = reservado.usuario;
    } else {
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

// Adicionar marcações
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

// Inicialização do tabuleiro
const inicializarTabuleiro = async () => {
  await carregarReservas();

  const tabuleiroWrappers = document.querySelectorAll(".tabuleiro-wrapper");
  tabuleiroWrappers.forEach((wrapper) => {
    const lateral = wrapper.querySelector(".marcacao-lateral");
    const superior = wrapper.querySelector(".marcacao-superior");
    const tabuleiro = wrapper.querySelector(".tabuleiro");
    const isCentral = tabuleiro.id === "pit-central";

    criarTabuleiro(tabuleiro, isCentral);
    adicionarMarcacoes(wrapper, lateral, superior);
  });
};

// Salvar quadrados selecionados
const salvarQuadrados = async () => {
  const reservas = [];
  quadradosSelecionados.forEach((quadrado) => {
    const idQuadrado = quadrado.dataset.id;
    reservas.push({ id: idQuadrado, usuario: usuarioAtual });

    quadrado.classList.add("reservado");
    quadrado.classList.remove("selecionado");
    quadrado.style.backgroundColor = "#000";
    quadrado.dataset.preco = "";
    quadrado.dataset.dono = usuarioAtual;
  });

  await salvarReservasNoServidor(reservas);
  quadradosSelecionados.clear();
};

document.getElementById("salvar-quadrado").addEventListener("click", salvarQuadrados);

// Resetar quadrados do usuário atual
document.getElementById("resetar-meus-quadrados").addEventListener("click", async () => {
  quadradosReservados = quadradosReservados.filter((q) => q.usuario !== usuarioAtual);
  await salvarReservasNoServidor(quadradosReservados);
  inicializarTabuleiro();
});

inicializarTabuleiro();
