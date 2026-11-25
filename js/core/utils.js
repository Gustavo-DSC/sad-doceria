/* ===== UTILITÁRIOS COMPARTILHADOS ===== */

// Formata número como moeda brasileira (ou "—" se não for número)
const brl = v => isFinite(v) ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

// Identificador curto e único o bastante para itens da interface
const uid = () => Math.random().toString(36).slice(2, 9);

// Escapa texto digitado pelo usuário antes de colocá-lo em innerHTML
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Mensagem rápida no rodapé da tela
function toast(txt) {
  const el = document.getElementById('toast');
  document.getElementById('toast-txt').textContent = txt;
  el.classList.add('mostrar');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('mostrar'), 1800);
}
