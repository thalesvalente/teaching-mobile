/* Guia didático: marcação pessoal, nunca pontuação ou evidência oficial. */
const KEY = 'aula08-guia-etapas-v1';
const boxes = [...document.querySelectorAll('[data-student-step]')];
const panels = [...document.querySelectorAll('.mission-steps-panel')];
const progress = document.getElementById('student-progress-bar');
const status = document.getElementById('student-progress-status');
let saved = [];
try {
  const value = JSON.parse(localStorage.getItem(KEY) || '[]');
  if (Array.isArray(value)) saved = value.filter(x => typeof x === 'string');
} catch { /* Navegador sem armazenamento: controles continuam funcionais. */ }
for (const checkbox of boxes) checkbox.checked = saved.includes(checkbox.dataset.studentStep);
function renderProgress() {
  const selected = boxes.filter(box => box.checked).map(box => box.dataset.studentStep);
  progress.value = selected.length;
  status.textContent = selected.length + ' de ' + boxes.length + ' passos marcados como realizados. Isso não é nota oficial.';
  for (const panel of panels) {
    const all = [...panel.querySelectorAll('[data-student-step]')];
    const marked = all.filter(box => box.checked).length;
    const count = document.querySelector('[data-count-for="' + panel.dataset.mission + '"]');
    if (count) count.textContent = marked + ' de ' + all.length + ' marcadas';
  }
  try { localStorage.setItem(KEY, JSON.stringify(selected)); } catch { /* Sem persistência, ainda permite marcar. */ }
}
for (const checkbox of boxes) checkbox.addEventListener('change', renderProgress);
document.getElementById('clear-progress')?.addEventListener('click', () => {
  for (const checkbox of boxes) checkbox.checked = false;
  renderProgress();
});
for (const panel of panels) panel.addEventListener('toggle', () => {
  if (panel.open) for (const other of panels) if (other !== panel) other.open = false;
});
function openMissionFromHash() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  const panel = target?.querySelector('.mission-steps-panel');
  if (!panel) return;
  for (const other of panels) other.open = other === panel;
}
addEventListener('hashchange', openMissionFromHash);
openMissionFromHash();
renderProgress();
