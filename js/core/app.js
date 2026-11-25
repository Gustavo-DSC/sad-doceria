/* ===== INICIALIZAÇÃO, EXEMPLOS E "LIMPAR" ===== */

// Dados de demonstração de cada módulo (botão "Exemplo")
const EXEMPLOS = {
  prec: () => {
    const idDe = nome => state.catalogo.find(i => i.nome === nome).id;
    const receita = [['Farinha de trigo', 0.5], ['Açúcar', 0.4], ['Ovos', 4], ['Manteiga', 0.2], ['Chocolate em pó', 0.15], ['Leite condensado', 1]];
    state.prec = {
      ...estadoInicial().prec,
      nome: 'Bolo de chocolate', rend: 20, perda: 5, horas: 3, hora: 15,
      botPreco: 110, gasKgH: 0.2, gasHoras: 1.5, potW: 1500, enHoras: 1, tarifa: 0.9, fixosMes: 400, horasMes: 120,
      itens: receita.map(([nome, qtd]) => ({ id: uid(), insumo: idDe(nome), qtd }))
    };
  },
  ahp: () => { state.ahp = window.exemploAHP(); },
  ent: () => {
    const clientes = [
      ['Maria Souza', 'Rua das Flores, 120', 'Portão azul', -6.0480, -37.0260],
      ['João Lima', 'Av. Central, 45', '', -6.0290, -37.0300],
      ['Ana Paula', 'Rua do Comércio, 300', 'Ligar ao chegar', -6.0200, -37.0050]
    ];
    state.ent = {
      ...estadoInicial().ent,
      origem: { lat: -6.0345, lng: -37.0092, endereco: 'Doceria — Centro' },
      paradas: clientes.map(([cliente, endereco, obs, lat, lng]) => ({ id: uid(), cliente, endereco, obs, lat, lng })),
      veic: { kmL: 10, comb: 6.2, outros: 0.4, margem: 30 }
    };
  }
};

function renderTudo() {
  renderPrec();
  renderEnt();
  window.renderPriorizar?.();   // o módulo de priorização carrega depois (ES module)
}

document.getElementById('lista-produtos').innerHTML = PRODUTOS_SUGERIDOS.map(p => `<option value="${p}">`).join('');

document.querySelectorAll('[data-exemplo]').forEach(botao => botao.onclick = () => {
  EXEMPLOS[botao.dataset.exemplo]();
  save(); renderTudo(); toast('Exemplo carregado');
});

document.querySelectorAll('[data-limpar]').forEach(botao => botao.onclick = () => {
  const modulo = botao.dataset.limpar, novo = estadoInicial()[modulo];
  if (modulo === 'ent') novo.veic = state.ent.veic;   // mantém os custos do veículo já preenchidos
  state[modulo] = novo;
  save(); renderTudo(); toast('Limpo');
});

renderTudo();

// Se o módulo de priorização nem chegou a iniciar (ex.: arquivo aberto sem servidor), avisa na tela
setTimeout(() => {
  const alvo = document.getElementById('ahp-app');
  if (!alvo || alvo.innerHTML.trim()) return;
  const dica = location.protocol === 'file:'
    ? 'Rode <code>python -m http.server 8000</code> na pasta e abra http://localhost:8000.'
    : 'Veja o console (F12) e a conexão com a CDN.';
  alvo.innerHTML = `<div class="nota erro"><span>O módulo de priorização não iniciou. ${dica}</span></div>`;
}, 1500);
