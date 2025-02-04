function mostrarEquipe(tipo) {
    document.querySelectorAll('.equipe').forEach(sec => sec.classList.remove('ativa'));
    document.getElementById(tipo).classList.add('ativa');

    document.querySelectorAll('.botoes button').forEach(btn => btn.classList.remove('ativo'));
    document.querySelector(`.botoes button[onclick="mostrarEquipe('${tipo}')"]`).classList.add('ativo');
}