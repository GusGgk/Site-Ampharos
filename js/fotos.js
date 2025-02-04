function mostrarGaleria(tipo) {
    document.querySelectorAll('.galeria').forEach(sec => sec.classList.remove('ativa'));
    document.getElementById(tipo).classList.add('ativa');

    document.querySelectorAll('.botoes button').forEach(btn => btn.classList.remove('ativo'));
    document.querySelector(`.botoes button[onclick="mostrarGaleria('${tipo}')"]`).classList.add('ativo');
}