document.addEventListener('DOMContentLoaded', () => {
  initQuoteForm();
});

function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const postal = document.getElementById('contactPostal')?.value.trim();

    if (!name || !phone || !postal) {
      showToast('Veuillez renseigner votre nom, téléphone et commune.', 'warning');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status === 200 && json.success) {
        form.reset();
        showToast('Votre demande a bien été envoyée ! Nous vous répondrons sous 48h.');
      } else {
        showToast(json.message || "Une erreur est survenue lors de l'envoi.", 'warning');
      }
    })
    .catch((error) => {
      console.error(error);
      showToast("Impossible d'envoyer le message. Vérifiez votre connexion.", 'warning');
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = originalText;
    });
  });
}

function showToast(message, type = 'info') {
  let outlet = document.getElementById('toastOutlet');
  if (!outlet) {
    outlet = document.createElement('div');
    outlet.id = 'toastOutlet';
    outlet.className = 'toast-outlet';
    document.body.appendChild(outlet);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background-color:${type === 'warning' ? '#D97706' : 'var(--c-terracotta)'}; flex-shrink:0;"></span>
    <span>${message}</span>
  `;

  outlet.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 4000);
}
