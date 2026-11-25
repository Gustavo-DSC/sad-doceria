/* ===== ESTADO DA APLICAÇÃO (salvo no localStorage) ===== */
const STORAGE_KEY = 'sadoceria.v5';

// Ingredientes pré-cadastrados: [nome, unidade do preço, preço de referência]. O usuário pode editar tudo na tela.
const CATALOGO = () => [
  ['Açúcar', 'kg', 5],
  ['Farinha de trigo', 'kg', 6],
  ['Ovos', 'un', 0.9],
  ['Manteiga', 'kg', 45],
  ['Leite', 'L', 5],
  ['Leite condensado', 'lata', 7],
  ['Creme de leite', 'caixa', 4],
  ['Chocolate em pó', 'kg', 30],
  ['Cacau em pó', 'kg', 40],
  ['Chocolate granulado', 'kg', 25],
  ['Coco ralado', 'kg', 28],
  ['Limão', 'un', 0.6],
  ['Biscoito maisena', 'pacote', 5],
  ['Óleo', 'L', 8],
  ['Embalagem', 'un', 1]
].map(([nome, un, preco], i) => ({ id: 'i' + i, nome, un, preco }));

// Sugestões de nomes de doces (lista de escolha nos campos de produto)
const PRODUTOS_SUGERIDOS = ['Bolo de chocolate', 'Bolo de cenoura', 'Bolo de creme', 'Brigadeiro', 'Beijinho', 'Cupcake', 'Torta de limão', 'Pudim', 'Brownie', 'Cookie'];

// Estado vazio de cada módulo (também usado pelos botões "Limpar")
const estadoInicial = () => ({
  catalogo: CATALOGO(),
  prec: {
    nome: '', rend: '', perda: '', margem: 80, horas: '', hora: '', itens: [],
    botPreco: '', botKg: '13', gasKgH: '', gasHoras: '', potW: '', enHoras: '', tarifa: '', fixosMes: '', horasMes: ''
  },
  ahp: { criterios: [], produtos: [], jc: {}, jp: {} },
  ent: { origem: null, paradas: [], voltar: true, res: null, veic: { kmL: '', comb: '', outros: '', margem: 30 } }
});

// Carrega o que foi salvo, completando campos novos com os valores padrão
let state;
try {
  const ini = estadoInicial(), salvo = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  state = {
    ...ini, ...salvo,
    prec: { ...ini.prec, ...salvo.prec },
    ent: { ...ini.ent, ...salvo.ent, veic: { ...ini.ent.veic, ...salvo.ent?.veic } }
  };
} catch (e) {
  state = estadoInicial();
}

// Salva com um pequeno atraso para não gravar a cada tecla digitada
let _timerSave;
function save() {
  clearTimeout(_timerSave);
  _timerSave = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* armazenamento cheio ou bloqueado: segue sem salvar */ }
  }, 250);
}
