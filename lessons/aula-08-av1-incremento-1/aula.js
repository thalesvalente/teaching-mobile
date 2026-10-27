const dialog = document.getElementById('image-dialog');
for (const figure of document.querySelectorAll('[data-required-image]')) {
  const img = figure.querySelector('img'), button = figure.querySelector('.enlarge');
  img.addEventListener('load', () => { img.hidden = false; button.hidden = false; figure.querySelector('.image-pending').hidden = true; });
  img.addEventListener('error', () => { img.hidden = true; button.hidden = true; });
  img.src = img.dataset.src;
  button.addEventListener('click', () => {
    const expanded = document.getElementById('expanded-image'); expanded.src = img.src; expanded.alt = img.alt;
    dialog.showModal(); document.getElementById('close-image').focus();
  });
}
document.getElementById('close-image')?.addEventListener('click', () => dialog.close());
for (const button of document.querySelectorAll('[data-copy]')) button.addEventListener('click', async () => {
  const text = document.getElementById(button.dataset.copy).textContent;
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText(text); if (status) status.textContent = button.dataset.feedback || 'Texto copiado.'; }
  catch { const range = document.createRange(); range.selectNodeContents(document.getElementById(button.dataset.copy)); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); if (status) status.textContent = 'Texto selecionado. Use Ctrl+C ou o comando Copiar do seu dispositivo.'; }
});
