/* Envoi du formulaire de contact sans quitter la page. */
(function () {
  var M = window.SO_FORM || {};
  document.querySelectorAll('form[action*="formspree"]').forEach(function (form) {
    var btn = form.querySelector('[type=submit]');
    var note = document.createElement('p');
    note.className = 'full'; note.setAttribute('role', 'status');
    note.style.cssText = 'margin:0;font-weight:600;font-size:16px;line-height:1.5';
    form.appendChild(note);
    form.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var label = btn.innerHTML;
      btn.disabled = true; btn.textContent = M.sending || '…'; note.textContent = '';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset(); note.style.color = '#00a865'; note.textContent = M.ok || 'OK';
        })
        .catch(function () { note.style.color = '#c0392b'; note.textContent = M.err || 'Erreur'; })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });
})();
