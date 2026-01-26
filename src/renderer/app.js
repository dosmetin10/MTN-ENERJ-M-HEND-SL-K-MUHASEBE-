const summaryEl = document.getElementById('system-check-summary');
const listEl = document.getElementById('system-check-list');

function renderSystemCheck(result) {
  if (!result || !Array.isArray(result.items)) {
    summaryEl.textContent = 'Sistem kontrolü alınamadı.';
    summaryEl.classList.add('system-check__summary--warning');
    return;
  }

  const issues = result.items.filter((item) => !item.ok);
  summaryEl.textContent = issues.length === 0
    ? 'Tüm kritik kontroller başarılı.'
    : `${issues.length} uyarı tespit edildi. Lütfen detayları kontrol edin.`;
  summaryEl.classList.toggle('system-check__summary--warning', issues.length > 0);

  listEl.innerHTML = '';
  result.items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'system-check__item';
    li.innerHTML = `
      <div class="system-check__item-title">
        <span class="status-pill ${item.ok ? 'status-pill--ok' : 'status-pill--warning'}">
          ${item.ok ? 'OK' : 'Uyarı'}
        </span>
        <strong>${item.title}</strong>
      </div>
      <p>${item.message}</p>
    `;
    listEl.appendChild(li);
  });
}

window.api.getSystemCheck()
  .then(renderSystemCheck)
  .catch(() => {
    summaryEl.textContent = 'Sistem kontrolü sırasında hata oluştu.';
    summaryEl.classList.add('system-check__summary--warning');
  });
