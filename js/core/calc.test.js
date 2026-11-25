// Rodar: node js/core/calc.test.js
const Calc = require('./calc.js'), assert = require('assert');
const near = (a, b, m) => assert(Math.abs(a - b) < 1e-6, `${m}: ${a} != ${b}`);
const p = Calc.precificar({ itens: [{ qtd: 2, preco: 5 }], rend: 10, perda: 0, horas: 2, hora: 15, gasKgH: .2, gasHoras: 2, botPreco: 100, botKg: 13, potW: 1000, enHoras: 1, tarifa: .9, fixosMes: 0, horasMes: 0, margem: 100 });
near(p.ing, 10, 'ingredientes'); near(p.mao, 30, 'mão de obra'); near(p.gas, .4 * 100 / 13, 'gás'); near(p.energia, .9, 'energia');
near(p.total, 10 + 30 + 40 / 13 + .9, 'total'); near(p.preco, p.total / 10 * 2, 'preço (markup 100%)');
const q = Calc.precificar({ itens: [{ qtd: 1, preco: 10 }], rend: 10, perda: 20, horas: 1, hora: 10, fixosMes: 300, horasMes: 100, margem: 50 });
near(q.vend, 8, 'perdas'); near(q.indireto, 3, 'indireto rateado'); near(q.custoUn, 23 / 8, 'custo unit com perda');
near(q.mc, q.preco - 20 / 8, 'margem de contribuição'); assert.strictEqual(q.pe, Math.ceil(300 / q.mc), 'ponto de equilíbrio');
assert.strictEqual(Calc.precificar({ itens: [], rend: 0 }), null);
const v = { kmL: 10, comb: 6, manut: .1, pneus: 0, deprec: 0, outros: 0, horaEnt: 20, margem: 50 };
near(Calc.custoKm(v), .7, 'custo/km');
const r = Calc.custoRota(10, 30, 2, v, 1); near(r.minimo, 17, 'mínimo'); near(r.rec, 25.5, 'recomendado'); near(r.porEntrega, 13.75, 'por entrega');
near(Calc.cenarios(17, 2, 0, [0, 100])[1].total, 34, 'cenário');

// AHP: matriz perfeitamente consistente (pesos 0.6/0.3/0.1 -> razões 2, 6, 3)
const ids = ['a', 'b', 'c'], ok = Calc.ahpDiag(ids, { 'a|b': -1, 'a|c': -5, 'b|c': -2 });
near(ok.cr, 0, 'CR consistente'); near(ok.w[0], .6, 'peso a'); near(ok.w[1], .3, 'peso b'); near(ok.w[2], .1, 'peso c');
// inconsistente: a>>b, b>>c, mas a=c  -> CR alto e o par (a,c) deve ser o mais destoante
const ruim = Calc.ahpDiag(ids, { 'a|b': -8, 'b|c': -8, 'a|c': 0 });
assert(ruim.cr > 0.1, 'CR alto esperado: ' + ruim.cr); assert(ruim.pares[0].a === 'a' && ruim.pares[0].b === 'c', 'par suspeito');
near(Calc.razao(-1), 2, 'razão -1'); near(Calc.razao(1), .5, 'razão +1'); near(Calc.ahpDiag(['x', 'y'], { 'x|y': -3 }).cr, 0, 'CR com 2 itens');
// ---- Ordem das entregas (ordenarRota) ----
{
const plano = pts => [[0, 0], ...pts].map(a => [[0, 0], ...pts].map(b => Math.hypot(a[0] - b[0], a[1] - b[1]) * 60));   // 1 unidade = 1 min
const desloc = (ordem, m) => Math.max(...ordem.map((p, pos) => Math.abs(pos - (p - 1))), 0);
// (a) pedido 2 fica no caminho do pedido 1: inverte 1 e 2 (ganho claro) e mantém o 3 onde estava
let r = Calc.ordenarRota(plano([[10, 0], [5, 0], [5, 3]]), false);
assert.deepStrictEqual(r.ordem, [2, 1, 3], 'deve inverter 1 e 2'); assert(r.custo < r.custoOriginal, 'inversão deve economizar');
// (b) ganho pequeno (< limiar): a ordem original é preservada
r = Calc.ordenarRota(plano([[10, 0], [10.2, 0.1], [10.1, 5]]), false);
assert.deepStrictEqual(r.ordem, [1, 2, 3], 'ganho irrelevante não reordena'); assert.strictEqual(r.trocas, 0);
// (c) exemplo do enunciado (10, 8, 3 e 12 km): não ordena por distância e ninguém se afasta mais de 1 posição
r = Calc.ordenarRota(plano([[10, 0], [8, 0], [3, 0], [12, 0]]), false);
assert(desloc(r.ordem) <= 1, 'deslocamento máximo de 1 posição'); assert(r.custo <= r.custoOriginal, 'não piora o percurso');
assert.notDeepStrictEqual(r.ordem, [3, 2, 1, 4], 'não deve virar ordenação por proximidade');
// (d) propriedades em 200 cenários aleatórios: nunca piora, é permutação válida, respeita o deslocamento
let sd = 11; const rd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
for (let k = 0; k < 200; k++) {
  const m = 1 + Math.floor(rd() * 8), pts = Array.from({ length: m }, () => [rd() * 20, rd() * 20]), volta = rd() < .5, md = 1 + Math.floor(rd() * 2);
  const o = Calc.ordenarRota(plano(pts), volta, { maxDesloc: md });
  assert.deepStrictEqual([...o.ordem].sort((a, b) => a - b), pts.map((_, i) => i + 1), 'permutação');
  assert(o.custo <= o.custoOriginal + 1e-9, 'nunca piora'); assert(desloc(o.ordem) <= md, 'deslocamento');
}
// (e) volta à saída entra no custo; casos vazios
near(Calc.ordenarRota(plano([[3, 4]]), true).custo, 600, 'ida e volta de 5+5 min'); assert.deepStrictEqual(Calc.ordenarRota(plano([]), true).ordem, []);
}
// setas: linha reta para leste -> 3 pontos igualmente espaçados, rumo 90°
const reta = [[0, 0], [0.01, 0]], pa = Calc.pontosAoLongo(reta, 3);
assert.strictEqual(pa.length, 3); near(pa[0].ang, 90, 'rumo leste'); near(pa[1].lng, 0.005, 'ponto médio');
near(Calc.pontosAoLongo([[0, 0], [0, 0.01]], 1)[0].ang, 0, 'rumo norte'); assert(Math.abs(Calc.comprimento(reta) - 1111.9) < 2, 'comprimento 0,01° ≈ 1112 m');
console.log('Todos os testes passaram');
