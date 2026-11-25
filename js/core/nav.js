/* ===== NAVEGAÇÃO ENTRE MÓDULOS ===== */
// Cada botão do menu (data-tab) mostra a seção com o mesmo id e esconde as demais.
document.querySelectorAll('nav button').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modulo').forEach(m => m.classList.remove('ativo'));
    botao.classList.add('active');
    document.getElementById(botao.dataset.tab).classList.add('ativo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
